import "@testing-library/jest-dom";
import { beforeEach, jest } from "@jest/globals";

const mockPush = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: mockPush,
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => "/",
  useSearchParams: () => new URLSearchParams(),
}));

const mockFetch = jest.fn() as jest.MockedFunction<typeof fetch>;

function resetFetchMock() {
  mockFetch.mockReset();
  mockFetch.mockResolvedValue({
    ok: true,
    json: async () => ({ results: [] }),
  } as Response);
}

global.fetch = mockFetch;

beforeEach(() => {
  resetFetchMock();
  mockPush.mockClear();
});
