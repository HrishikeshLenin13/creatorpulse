import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const body = (await request.json()) as { email?: string; password?: string; name?: string };

  const email = body.email ?? 'ava@creatorpulse.io';
  const password = body.password ?? 'creator123';

  if (!email || !password) {
    return NextResponse.json({ ok: false, message: 'Email and password are required.' }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    token: 'mock-token-creatorpulse-123',
    user: {
      id: 'u_1042',
      name: body.name ?? 'Ava Chen',
      email,
      plan: 'Growth',
      workspace: 'creator-dashboard',
    },
  });
}
