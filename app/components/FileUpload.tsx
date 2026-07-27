"use client";

import { useCallback, useState } from "react";
import { UploadCloud, File, X, CheckCircle, Loader2 } from "lucide-react";

interface FileUploadProps {
  onUpload: (ipfsHash: string) => void;
  isUploading: boolean;
  setIsUploading: (v: boolean) => void;
}

export default function FileUpload({
  onUpload,
  isUploading,
  setIsUploading,
}: FileUploadProps) {
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [drag, setDrag] = useState(false);
  const [uploadedHash, setUploadedHash] = useState<string | null>(null);

  const handleFile = (f: File) => {
    if (f.size > 10 * 1024 * 1024) {
      setError("File must be under 10 MB");
      return;
    }
    const allowed = ["application/pdf", "image/png", "image/jpeg", "image/jpg", "application/zip", "application/x-zip-compressed"];
    if (!allowed.includes(f.type)) {
      setError("Only PDF, PNG, JPG, and ZIP files are accepted");
      return;
    }
    setFile(f);
    setError(null);
    setUploadedHash(null);
  };

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDrag(false);
    if (e.dataTransfer.files[0]) handleFile(e.dataTransfer.files[0]);
  }, []);

  const upload = async () => {
    if (!file) return;
    setIsUploading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Use our server-side API route (keeps Pinata keys safe)
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || `Upload failed (${res.status})`);
      }

      setUploadedHash(data.ipfsHash);
      onUpload(data.ipfsHash);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Upload failed";
      setError(message);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true); }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        onClick={() => document.getElementById("file-input")?.click()}
        className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-10 transition-all duration-200 ${
          drag
            ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]"
            : uploadedHash
            ? "border-emerald-500/40 bg-emerald-500/5"
            : "border-white/20 bg-white/5 hover:border-white/30 hover:bg-white/[0.07]"
        }`}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          accept=".pdf,.png,.jpg,.jpeg,.zip"
          onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        />
        {uploadedHash ? (
          <>
            <CheckCircle className="mb-3 h-8 w-8 text-emerald-400" />
            <p className="text-sm font-medium text-emerald-300">Uploaded to IPFS</p>
            <p className="mt-1 max-w-xs truncate text-xs text-slate-500 font-mono">{uploadedHash}</p>
          </>
        ) : (
          <>
            <UploadCloud className="mb-3 h-8 w-8 text-slate-400" />
            <p className="text-sm text-slate-300">
              Drop your file here or{" "}
              <span className="text-indigo-400 underline">browse</span>
            </p>
            <p className="mt-1 text-xs text-slate-500">PDF, PNG, JPG, ZIP — max 10 MB</p>
          </>
        )}
      </div>

      {/* Selected file */}
      {file && !uploadedHash && (
        <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/5 px-4 py-3">
          <div className="flex items-center gap-2 text-sm text-slate-300">
            <File className="h-4 w-4 text-indigo-400" />
            <span className="max-w-[200px] truncate">{file.name}</span>
            <span className="text-slate-500">
              ({(file.size / 1024).toFixed(1)} KB)
            </span>
          </div>
          <button onClick={() => { setFile(null); setError(null); }} className="text-slate-500 hover:text-white transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-2">
          <p className="text-xs text-red-400">{error}</p>
        </div>
      )}

      {!uploadedHash && (
        <button
          onClick={upload}
          disabled={!file || isUploading}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3 text-sm font-semibold text-white transition-colors hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {isUploading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Uploading to IPFS…
            </>
          ) : (
            <>
              <UploadCloud className="h-4 w-4" />
              Upload to IPFS
            </>
          )}
        </button>
      )}
    </div>
  );
}
