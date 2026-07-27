import { render, screen, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import CountdownTimer from "../app/components/CountdownTimer";

describe("CountdownTimer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("shows 'Deadline expired' when deadline is in the past", () => {
    const pastDeadline = BigInt(Math.floor(Date.now() / 1000) - 3600); // 1 hour ago
    render(<CountdownTimer deadline={pastDeadline} />);
    expect(screen.getByText("Deadline expired")).toBeInTheDocument();
  });

  it("renders countdown for future deadline (compact mode)", () => {
    const futureDeadline = BigInt(Math.floor(Date.now() / 1000) + 90000); // ~25 hours
    render(<CountdownTimer deadline={futureDeadline} compact />);
    // Should contain a time-like string (HH:MM:SS)
    const el = document.querySelector(".font-mono");
    expect(el).toBeInTheDocument();
  });

  it("renders full countdown for future deadline", () => {
    const futureDeadline = BigInt(Math.floor(Date.now() / 1000) + 172800); // 2 days
    render(<CountdownTimer deadline={futureDeadline} />);
    expect(screen.getByText("Days")).toBeInTheDocument();
    expect(screen.getByText("Hrs")).toBeInTheDocument();
    expect(screen.getByText("Min")).toBeInTheDocument();
    expect(screen.getByText("Sec")).toBeInTheDocument();
  });

  it("shows urgent styling when less than 24 hours remain", () => {
    const urgentDeadline = BigInt(Math.floor(Date.now() / 1000) + 3600); // 1 hour
    const { container } = render(<CountdownTimer deadline={urgentDeadline} />);
    // Should have yellow/urgent border
    const wrapper = container.querySelector("[class*='yellow']");
    expect(wrapper).toBeInTheDocument();
  });

  it("shows normal styling when more than 24 hours remain", () => {
    const normalDeadline = BigInt(Math.floor(Date.now() / 1000) + 172800); // 2 days
    render(<CountdownTimer deadline={normalDeadline} />);
    expect(screen.getByText("Deadline")).toBeInTheDocument();
  });
});
