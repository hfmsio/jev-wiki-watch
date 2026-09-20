// Serves index.html and forwards /jev calls to TypeSafe with your key. Nothing else.
import { createServer } from "node:http";
import { readFile } from "node:fs/promises";

const KEY = process.env.TYPESAFE_API_KEY;
if (!KEY) throw new Error("Set TYPESAFE_API_KEY first");

createServer(async (req, res) => {
  if (req.method === "POST" && req.url === "/jev") {
    let body = "";
    for await (const chunk of req) body += chunk;
    const r = await fetch("https://api.typesafe.ai/v1/systemone", {
      method: "POST",
      headers: { Authorization: `Bearer ${KEY}`, "Content-Type": "application/json" },
      body,
    });
    res.writeHead(r.status, { "Content-Type": "application/json" });
    return res.end(await r.text());
  }
  res.writeHead(200, { "Content-Type": "text/html" });
  res.end(await readFile("index.html"));
}).listen(8000, () => console.log("open http://localhost:8000"));
