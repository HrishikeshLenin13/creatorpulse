export async function POST() {
  return Response.json(
    {
      ok: false,
      code: "AUTH_NOT_CONFIGURED",
      message:
        "Cloud accounts are not configured. Use the public workspace; no password is collected.",
    },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
