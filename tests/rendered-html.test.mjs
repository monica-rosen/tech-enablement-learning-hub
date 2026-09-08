import assert from "node:assert/strict";
import { access, readFile, readdir } from "node:fs/promises";
import test from "node:test";

const distRoot = new URL("../dist/", import.meta.url);

test("produces a portable static site", async () => {
  const html = await readFile(new URL("index.html", distRoot), "utf8");
  assert.match(html, /<title>AI Enablement Learning Hub<\/title>/);
  assert.match(html, /<div id="root"><\/div>/);
  assert.doesNotMatch(html, /cloudflare|vinext|_next/i);

  const assets = await readdir(new URL("assets/", distRoot));
  assert.ok(assets.some((name) => name.endsWith(".js")));
  assert.ok(assets.some((name) => name.endsWith(".css")));
});

test("publishes the API course at its own durable path", async () => {
  const html = await readFile(new URL("api-basics/index.html", distRoot), "utf8");
  assert.match(html, /<title>What Is an API\? — AI Enablement<\/title>/);
  assert.match(html, /<div id="root"><\/div>/);
});

test("copies the public brand assets", async () => {
  await Promise.all([
    access(new URL("favicon.svg", distRoot)),
    access(new URL("og.png", distRoot)),
  ]);
});

test("includes a returning-learner soft-gate path", async () => {
  const source = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  assert.match(source, /Already registered on another device\?/);
  assert.match(source, /Continue to the course/);
  assert.match(source, /localStorage\.setItem\("learning-hub-registered", "yes"\)/);
  assert.match(source, /location\.assign\("\/api-basics\/"\)/);
});
