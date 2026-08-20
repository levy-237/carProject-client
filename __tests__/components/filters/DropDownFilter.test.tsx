import DropDownFilter from "@/components/filters/DropDownFilter";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { jest } from "@jest/globals";

describe("DropDownFilter", () => {
  it("dropdown filter becomes unsearchable when the value is set", async () => {
    render(
      <DropDownFilter
        apiName="cars/brands"
        name="Brand"
        value={[]}
        onChange={() => {}}
        searchable={false}
      />,
    );
    fireEvent.click(screen.getByTestId("drop-down-filter-button"));
    expect(
      screen.queryByTestId("drop-down-filter-search"),
    ).not.toBeInTheDocument();
    await screen.findByText("No results found");
  });

  it("dropdown filter display name correctly", () => {
    render(
      <DropDownFilter
        apiName="cars/brands"
        name="Brand"
        value={[]}
        onChange={() => {}}
      />,
    );
    const name = screen.getByTestId("drop-down-filter-name");
    expect(name).toHaveTextContent("Brand");
  });

  it("dropdown filter opens an closes when the toggle button is clicked", async () => {
    render(
      <DropDownFilter
        apiName="cars/brands"
        name="Brand"
        value={[]}
        onChange={() => {}}
      />,
    );
    const toggleButton = screen.getByTestId("drop-down-filter-button");
    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);

    const dropdown = await screen.findByTestId("drop-down-filter-dropdown");
    expect(dropdown).toBeInTheDocument();
    fireEvent.click(toggleButton);
    expect(dropdown).not.toBeInTheDocument();
  });

  it("dropdown fetches options from the API and displays them", async () => {
    const fetchMock = jest.fn() as jest.MockedFunction<typeof fetch>;
    fetchMock.mockResolvedValue({
      ok: true,
      json: async () => ({
        results: [
          { id: 1, name: "Brand 1" },
          { id: 2, name: "Brand 2" },
        ],
      }),
    } as Response);

    global.fetch = fetchMock;
    render(
      <DropDownFilter
        apiName="cars/brands"
        name="Brand"
        value={[]}
        onChange={() => {}}
      />,
    );

    const toggleButton = screen.getByTestId("drop-down-filter-button");
    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);
    const options = await screen.findAllByTestId("drop-down-filter-option");
    expect(options).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledWith(
      `${process.env.API_BASE_URL}cars/brands`,
    );
  });

  it("dropdown filter displays options when the search is entered", async () => {
    render(
      <DropDownFilter
        apiName="cars/brands"
        name="Brand"
        value={[]}
        onChange={() => {}}
      />,
    );
    const toggleButton = await screen.findByTestId("drop-down-filter-button");
    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);
    const searchInput = await screen.findByTestId(
      "drop-down-filter-search-input",
    );
    fireEvent.change(searchInput, { target: { value: "test" } });
    expect(global.fetch).toHaveBeenCalledWith(
      `${process.env.API_BASE_URL}cars/brands?name=test`,
    );

    // clean this up
    await screen.findByText("Brand 1");
  });

  it("dropdown filter displays loading state when the options are being fetched", async () => {
    render(
      <DropDownFilter
        apiName="cars/brands"
        name="Brand"
        value={[]}
        onChange={() => {}}
      />,
    );
    const toggleButton = await screen.findByTestId("drop-down-filter-button");
    expect(toggleButton).toBeInTheDocument();
    fireEvent.click(toggleButton);
    const loading = await screen.findByTestId("drop-down-filter-loading");
    expect(loading).toBeInTheDocument();
  });
});
