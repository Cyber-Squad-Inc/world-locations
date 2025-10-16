
import fs from "fs";
import path from "path";
const OUT = path.resolve("out");
const COUNTRY_DIR = path.join(OUT, "countries");
const DEST = path.join(OUT, "world-locations.full.json");

function merge() {
  const files = fs.readdirSync(COUNTRY_DIR).filter(f => f.endsWith(".json"));
  const countries = files.map(f => JSON.parse(fs.readFileSync(path.join(COUNTRY_DIR, f), "utf-8")));
  const world = { countries };
  fs.writeFileSync(DEST, JSON.stringify(world, null, 2));
  console.log("✅ Merged:", DEST);
}

merge();
