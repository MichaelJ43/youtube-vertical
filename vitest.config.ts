import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "happy-dom",
    include: ["test/unit/**/*.test.ts", "test/integration/**/*.test.ts"],
    globals: true,
  },
});
