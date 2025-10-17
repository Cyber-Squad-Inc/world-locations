import { defineConfig } from "tsup";

export default defineConfig({
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    minify: true,
    sourcemap: false,
    clean: true,
    treeshake: true,
    splitting: false,
    target: "es2022",
    // ✅ Prevent tsup from including Node.js built-ins
    platform: "browser",
    noExternal: ["fflate"],
    bundle: true
});
