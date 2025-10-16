import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const OUT_DIR = path.resolve("out");
const COUNTRIES_DIR = path.join(OUT_DIR, "countries");
const DEST_FILE = path.join(OUT_DIR, "world-locations.full.json");
const COMPRESSED_FILE = `${DEST_FILE}.gz`;

function merge() {
  const files = fs.readdirSync(COUNTRIES_DIR).filter(f => f.endsWith(".json"));
  const countries = files.map(file =>
    JSON.parse(fs.readFileSync(path.join(COUNTRIES_DIR, file), "utf-8"))
  );

  const world = {
    dataVersion: new Date().toISOString().split("T")[0],
    countries
  };

  fs.writeFileSync(DEST_FILE, JSON.stringify(world, null, 2));
  console.log(`✅ Merged ${files.length} countries`);

  // Compress with gzip
  execSync(`npx gzipper compress ${DEST_FILE}`);
  fs.unlinkSync(DEST_FILE);
  console.log(`🗜️  Compressed → ${COMPRESSED_FILE}`);
}

merge();