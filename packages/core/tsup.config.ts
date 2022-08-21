import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
	},
	format: ["esm", "cjs"],
	splitting: false,
	sourcemap: true,
	dts: true,
	skipNodeModulesBundle: true,
});
