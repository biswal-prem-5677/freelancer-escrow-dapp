import { NextRequest, NextResponse } from "next/server";

// Server-side only — these keys are NOT exposed to the browser
const PINATA_API_KEY = process.env.PINATA_API_KEY || process.env.NEXT_PUBLIC_PINATA_API_KEY || "";
const PINATA_SECRET = process.env.PINATA_SECRET_API_KEY || process.env.NEXT_PUBLIC_PINATA_SECRET_API_KEY || "";
const PINATA_JWT = process.env.PINATA_JWT || "";

const ALLOWED_TYPES = [
  "application/pdf",
  "image/png",
  "image/jpeg",
  "image/jpg",
  "application/zip",
  "application/x-zip-compressed",
];
const MAX_SIZE = 10 * 1024 * 1024; // 10 MB

// Simple in-memory rate limiter (per-IP)
const rateMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10; // max uploads per window
const RATE_WINDOW = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateMap.get(ip);

  if (!entry || now > entry.resetAt) {
    rateMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW });
    return true;
  }

  if (entry.count >= RATE_LIMIT) return false;

  entry.count++;
  return true;
}

export async function POST(request: NextRequest) {
  try {
    // Rate limit check
    const ip = request.headers.get("x-forwarded-for") || "unknown";
    if (!checkRateLimit(ip)) {
      return NextResponse.json(
        { error: "Rate limit exceeded. Max 10 uploads per hour." },
        { status: 429 }
      );
    }

    // Check API keys are configured
    if (!PINATA_JWT && (!PINATA_API_KEY || !PINATA_SECRET)) {
      return NextResponse.json(
        { error: "IPFS upload not configured. Contact admin." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Validate file size
    if (file.size > MAX_SIZE) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10 MB." },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: `File type "${file.type}" not allowed. Accepted: PDF, PNG, JPG, ZIP.` },
        { status: 400 }
      );
    }

    // Upload to Pinata
    const pinataForm = new FormData();
    pinataForm.append("file", file);

    const headers: Record<string, string> = PINATA_JWT
      ? { Authorization: `Bearer ${PINATA_JWT}` }
      : {
          pinata_api_key: PINATA_API_KEY,
          pinata_secret_api_key: PINATA_SECRET,
        };

    const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
      method: "POST",
      headers,
      body: pinataForm,
    });

    if (!res.ok) {
      const errBody = await res.text();
      console.error("Pinata error:", res.status, errBody);
      return NextResponse.json(
        { error: `IPFS upload failed (${res.status})` },
        { status: 502 }
      );
    }

    const data = await res.json();

    return NextResponse.json({
      ipfsHash: data.IpfsHash,
      pinSize: data.PinSize,
      timestamp: data.Timestamp,
      url: `https://gateway.pinata.cloud/ipfs/${data.IpfsHash}`,
    });
  } catch (err) {
    console.error("Upload API error:", err);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
