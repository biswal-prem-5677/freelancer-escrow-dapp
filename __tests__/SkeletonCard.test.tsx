import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import SkeletonCard from "../app/components/SkeletonCard";

describe("SkeletonCard", () => {
  it("renders without crashing", () => {
    const { container } = render(<SkeletonCard />);
    expect(container.firstChild).toBeInTheDocument();
  });

  it("has animate-pulse class for shimmer effect", () => {
    const { container } = render(<SkeletonCard />);
    expect(container.firstChild).toHaveClass("animate-pulse");
  });

  it("has correct card styling", () => {
    const { container } = render(<SkeletonCard />);
    expect(container.firstChild).toHaveClass("rounded-2xl");
    expect(container.firstChild).toHaveClass("border");
  });
});
