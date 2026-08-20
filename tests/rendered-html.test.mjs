import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const distRoot = new URL("../dist/", import.meta.url);

test("produces a portable static site", async () => {
  const html = await readFile(new URL("index.html", distRoot), "utf8");
  assert.match(html, /<title>What Is an API\? — API, plainly<\/title>/);
  assert.match(html, /<div id="root"><\/div>/);
  assert.doesNotMatch(html, /cloudflare|vinext|_next/i);

  const assets = await readdir(new URL("assets/", distRoot));
  assert.ok(assets.some((name) => name.endsWith(".js")));
  assert.ok(assets.some((name) => name.endsWith(".css")));
});

test("copies the public brand assets", async () => {
  await Promise.all([
    access(new URL("favicon.svg", distRoot)),
    access(new URL("og.png", distRoot)),
  ]);
});
