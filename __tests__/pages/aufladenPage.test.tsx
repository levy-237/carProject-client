import "@testing-library/jest-dom";
import { fireEvent, render, screen } from "@testing-library/react";
import AufladenPage from "@/app/aufladen/page";
import AufladenIntro from "@/components/aufladen/AufladenIntro";

describe("Aufladen Page", () => {
  it("renders the aufladen page", () => {
    render(<AufladenPage />);

    const aufladenPage = screen.getByTestId("aufladen-page");

    expect(aufladenPage).toBeInTheDocument();
  });

  it("navigates to the listings page when the aufladen intro link is clicked", () => {
    render(<AufladenIntro />);

    const aufladenIntroLink = screen.getByTestId("aufladen-intro-link");
    expect(aufladenIntroLink).toHaveAttribute("href", "/listings");

    // fireEvent.click(aufladenIntroLink);
    // expect(window.location.pathname).toBe("/listings");
  });
});
