export async function GET() {
  return Response.json({
    status: "ok",
    service: "CreatorPulse",
    version: "0.2.0",
  });
}
