import { mkdir, readFile, writeFile } from "node:fs/promises";

await mkdir(new URL("../dist/api-basics/", import.meta.url), { recursive: true });
const hubHtml = await readFile(new URL("../dist/index.html", import.meta.url), "utf8");
const courseHtml = hubHtml
  .replaceAll("Tech Enablement Learning Hub", "What Is an API? — Tech Enablement")
  .replaceAll(
    "Short, interactive technical lessons in plain English, with practical labs, knowledge checks and badges.",
    "Learn API basics through a plain-English walkthrough, an interactive request lab, and a quick knowledge check.",
  );
await writeFile(new URL("../dist/api-basics/index.html", import.meta.url), courseHtml);
