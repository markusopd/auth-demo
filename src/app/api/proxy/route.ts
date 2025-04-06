// app/api/proxy/route.ts
import { auth0 } from '@/lib/auth0';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const session = await auth0.getSession();
  console.log(session?.tokenSet.accessToken)

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  const body = await req.json();
  const { url, options } = body;

  if (!url) {
    return NextResponse.json({ error: 'Missing URL' }, { status: 400 });
  }

  const headers = new Headers(options.headers || {});
  headers.set('Authorization', `Bearer ${session?.tokenSet.accessToken}`);
  options.headers = headers

  try {
    console.log(url)
    const res = await fetch(url, options);
    const contentType = res.headers.get('content-type') || '';

    const data = contentType.includes('application/json')
      ? await res.json()
      : await res.text();

    return NextResponse.json({ data, status: res.status });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}