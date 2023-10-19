import path from "path";
import { defineConfig } from "vite";
import dts from "vite-plugin-dts";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  build: {
    lib: {
      entry: path.resolve(__dirname, "src/index.ts"),
      name: "fetcher",
      fileName: (format) => `fetcher.${format}.js`,
    },
  },
  resolve: {
    alias: {
      "@classes": path.resolve(__dirname, "./src/classes"),
      "@utils": path.resolve(__dirname, "./src/utils"),
      "@helpers": path.resolve(__dirname, "./src/helpers"),
      "@types": path.resolve(__dirname, "./src/types"),
      "@constants": path.resolve(__dirname, "./src/constants"),
    },
  },
  plugins: [dts(), tsconfigPaths()],
});
