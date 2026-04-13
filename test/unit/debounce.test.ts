import { describe, expect, it, vi } from "vitest";
import { debounce } from "../../src/content/debounce.js";

describe("debounce", () => {
  it("delays invocation until after quiet window", async () => {
    vi.useFakeTimers();
    const fn = vi.fn();
    const d = debounce(fn, 50);
    d(1);
    d(2);
    d(3);
    expect(fn).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(49);
    expect(fn).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(2);
    expect(fn).toHaveBeenCalledTimes(1);
    expect(fn).toHaveBeenCalledWith(3);
    vi.useRealTimers();
  });
});
