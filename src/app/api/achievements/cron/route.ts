import { NextResponse } from 'next/server';
import * as fs from 'fs';

const CACHE_FILE_PATH = '/tmp/achievements-cache.json';
const CRON_SECRET = process.env.CRON_SECRET || '';

export async function GET(request: Request) {
  // Optional: protect with a secret token for Cloud Scheduler
  const url = new URL(request.url);
  const token = url.searchParams.get('token');

  if (CRON_SECRET && token !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    // Invalidate the file cache
    if (fs.existsSync(CACHE_FILE_PATH)) {
      fs.unlinkSync(CACHE_FILE_PATH);
    }

    // Trigger a fresh fetch by calling the main endpoint
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL
      || process.env.VERCEL_URL
      || 'http://localhost:3000';

    const protocol = baseUrl.startsWith('http') ? '' : 'https://';
    const fullUrl = `${protocol}${baseUrl}/api/achievements`;

    const res = await fetch(fullUrl, {
      headers: { 'User-Agent': 'CronRefresh/1.0' },
      signal: AbortSignal.timeout(30000),
    });

    if (!res.ok) {
      throw new Error(`Refresh failed with HTTP ${res.status}`);
    }

    return NextResponse.json({
      success: true,
      message: 'Cache invalidated and refreshed',
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    console.error('[cron] Refresh error:', err);
    return NextResponse.json({
      success: false,
      error: err instanceof Error ? err.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
