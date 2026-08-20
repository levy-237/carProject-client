import { render, screen } from "@testing-library/react";
import AufladenIntro from "@/components/aufladen/AufladenIntro";

describe("Aufladen Intro", () => {
  it("navigates to the listings page when the aufladen intro link is clicked", () => {
    render(<AufladenIntro />);

    const aufladenIntroLink = screen.getByTestId("aufladen-intro-link");
    expect(aufladenIntroLink).toHaveAttribute("href", "/listings");

    // fireEvent.click(aufladenIntroLink);
    // expect(window.location.pathname).toBe("/listings");
  });
});
