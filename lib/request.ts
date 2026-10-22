import { AnalysisError } from "./video-url";
export async function readJson(request: Request): Promise<unknown> {
  if (
    !request.headers
      .get("content-type")
      ?.toLowerCase()
      .startsWith("application/json")
  )
    throw new AnalysisError(
      "Send a JSON request.",
      415,
      "INVALID_CONTENT_TYPE",
    );
  const reader = request.body?.getReader();
  if (!reader) throw new AnalysisError("A JSON request body is required.");
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 4096)
        throw new AnalysisError(
          "Request body is too large.",
          413,
          "BODY_TOO_LARGE",
        );
      chunks.push(value);
    }
  } finally {
    await reader.cancel();
  }
  const all = new Uint8Array(size);
  let offset = 0;
  for (const c of chunks) {
    all.set(c, offset);
    offset += c.length;
  }
  try {
    return JSON.parse(new TextDecoder().decode(all));
  } catch {
    throw new AnalysisError("Request body must be valid JSON.");
  }
}
// Process-local circuit breaker. Deploy an edge/distributed limiter before public multi-instance use.
let windowStart = 0;
let used = 0;
let active = 0;
export function acquire(now = Date.now()): (() => void) | null {
  if (now - windowStart >= 60000) {
    windowStart = now;
    used = 0;
  }
  if (used >= 60 || active >= 6) return null;
  used++;
  active++;
  let released = false;
  return () => {
    if (!released) {
      active--;
      released = true;
    }
  };
}
