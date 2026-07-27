import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import EmptyState from "../app/components/EmptyState";

// Mock next/link
vi.mock("next/link", () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

describe("EmptyState", () => {
  it("renders title and description", () => {
    render(
      <EmptyState
        icon={<span data-testid="icon">📭</span>}
        title="No items found"
        description="Create your first item to get started."
      />
    );
    expect(screen.getByText("No items found")).toBeInTheDocument();
    expect(screen.getByText("Create your first item to get started.")).toBeInTheDocument();
  });

  it("renders the icon", () => {
    render(
      <EmptyState
        icon={<span data-testid="icon">📭</span>}
        title="Empty"
        description="Nothing here."
      />
    );
    expect(screen.getByTestId("icon")).toBeInTheDocument();
  });

  it("renders action button when actionLabel and actionHref are provided", () => {
    render(
      <EmptyState
        icon={<span>📭</span>}
        title="Empty"
        description="Nothing here."
        actionLabel="Create Now"
        actionHref="/create"
      />
    );
    const link = screen.getByText("Create Now");
    expect(link).toBeInTheDocument();
    expect(link.closest("a")).toHaveAttribute("href", "/create");
  });

  it("does not render action button when no actionLabel", () => {
    render(
      <EmptyState
        icon={<span>📭</span>}
        title="Empty"
        description="Nothing here."
      />
    );
    expect(screen.queryByRole("link")).not.toBeInTheDocument();
  });
});
