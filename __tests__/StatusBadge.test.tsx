import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import StatusBadge from "../app/components/StatusBadge";

describe("StatusBadge", () => {
  it("renders correct label for AWAITING_WORK state (0)", () => {
    render(<StatusBadge state={0} />);
    expect(screen.getByText("Awaiting Work")).toBeInTheDocument();
  });

  it("renders correct label for WORK_SUBMITTED state (1)", () => {
    render(<StatusBadge state={1} />);
    expect(screen.getByText("Work Submitted")).toBeInTheDocument();
  });

  it("renders correct label for COMPLETE state (2)", () => {
    render(<StatusBadge state={2} />);
    expect(screen.getByText("Complete")).toBeInTheDocument();
  });

  it("renders correct label for DISPUTED state (3)", () => {
    render(<StatusBadge state={3} />);
    expect(screen.getByText("Disputed")).toBeInTheDocument();
  });

  it("renders correct label for REFUNDED state (4)", () => {
    render(<StatusBadge state={4} />);
    expect(screen.getByText("Refunded")).toBeInTheDocument();
  });

  it("renders correct label for CANCELLED state (5)", () => {
    render(<StatusBadge state={5} />);
    expect(screen.getByText("Cancelled")).toBeInTheDocument();
  });

  it("renders Unknown for invalid state", () => {
    render(<StatusBadge state={99} />);
    expect(screen.getByText("Unknown")).toBeInTheDocument();
  });

  it("applies correct CSS classes for each state", () => {
    const { container } = render(<StatusBadge state={0} />);
    const badge = container.querySelector("span");
    expect(badge).toHaveClass("rounded-full");
    expect(badge).toHaveClass("text-xs");
  });
});
