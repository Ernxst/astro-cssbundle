import { defineConfig } from "tsup";

export default defineConfig({
	entry: {
		index: "src/index.ts",
	},
	format: ["esm", "cjs"],
	splitting: false,
	sourcemap: true,
	dts: true,
	banner(ctx) {
		if (ctx.format === "esm") {
			return {
				js: `import { createRequire } from 'module';const require = createRequire(process.cwd());`,
			};
		}
		return { js: "" };
	},
});
