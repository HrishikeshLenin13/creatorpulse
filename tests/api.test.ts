import { test } from "node:test";
import assert from "node:assert/strict";
import { POST, GET } from "../app/api/analytics/route";
import { POST as login } from "../app/api/auth/login/route";
import { POST as signup } from "../app/api/auth/signup/route";
const request = (body: string, headers: Record<string, string> = {}) =>
  new Request("http://localhost:3000/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json", ...headers },
    body,
  });
test("API invalid JSON returns 400, not unhandled 500", async () => {
  const r = await POST(request("{"));
  assert.equal(r.status, 400);
  assert.equal((await r.json()).code, "INVALID_URL");
});
test("API rejects oversized streamed input", async () => {
  const r = await POST(request(JSON.stringify({ url: "x".repeat(5000) })));
  assert.equal(r.status, 413);
});
test("API rejects non JSON", async () => {
  const r = await POST(request("{}", { "content-type": "text/plain" }));
  assert.equal(r.status, 415);
});
test("API requires a URL and rejects malformed destinations", async () => {
  for (const body of [{}, null, { url: "https://localhost/" }, { url: 7 }])
    assert.equal((await POST(request(JSON.stringify(body)))).status, 400);
});
test("API rejects cross-origin browser requests", async () => {
  assert.equal(
    (await POST(request("{}", { origin: "https://other.example" }))).status,
    403,
  );
});
test("auth endpoints never mint placeholder tokens or accept passwords", async () => {
  for (const route of [login, signup]) {
    const r = await route();
    assert.equal(r.status, 503);
    assert.equal((await r.json()).code, "AUTH_NOT_CONFIGURED");
  }
});
test("GET exposes only nonsecret configuration status", async () => {
  const r = await GET();
  assert.equal(r.headers.get("cache-control"), "no-store");
  const data = await r.json();
  assert.equal(typeof data.youtubeStatisticsConfigured, "boolean");
  assert.equal(data.key, undefined);
});
test("API success uses provider data and noncacheable response", async () => {
  const original = globalThis.fetch;
  globalThis.fetch = async () =>
    new Response(
      JSON.stringify({ title: "Public title", author_name: "Public creator" }),
    );
  try {
    const r = await POST(
      request(JSON.stringify({ url: "https://youtu.be/jNQXAC9IVRw" })),
    );
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.report.title, "Public title");
    assert.equal(data.report.metrics.views, null);
    assert.equal(r.headers.get("cache-control"), "no-store");
  } finally {
    globalThis.fetch = original;
  }
});
