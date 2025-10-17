import fs from "fs";
import path from "path";

const INPUT = path.resolve("out/world-locations.full.json.gz");
const OUT_JS = path.resolve("src/embedded-data.js");
const OUT_DTS = path.resolve("src/embedded-data.d.ts");

if (!fs.existsSync(INPUT)) {
    console.error("❌ Dataset not found. Run pnpm run start before embedding.");
    process.exit(1);
}

const buffer = fs.readFileSync(INPUT);
const base64 = buffer.toString("base64");

// Write tiny type declaration (no base64 inside types)
fs.writeFileSync(OUT_DTS, `export declare const embeddedDataBase64: string;\n`);

// Write runtime value in JS (so TS will NOT inline into .d.ts)
fs.writeFileSync(
    OUT_JS,
    `// AUTO-GENERATED FILE — DO NOT EDIT
export const embeddedDataBase64 = "${base64}";
`
);

console.log("✅ Embedded dataset generated → src/embedded-data.js (+ .d.ts)");