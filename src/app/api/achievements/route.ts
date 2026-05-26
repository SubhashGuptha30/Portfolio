import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import fallbackData from '@/data/achievements-fallback.json';

// ─── Cache Configuration ───────────────────────────────────────────────────────
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const CACHE_FILE_PATH = '/tmp/achievements-cache.json';

interface CacheEntry {
  data: any;
  timestamp: number;
}

let memoryCache: CacheEntry | null = null;

function readFileCache(): CacheEntry | null {
  try {
    if (fs.existsSync(CACHE_FILE_PATH)) {
      const raw = fs.readFileSync(CACHE_FILE_PATH, 'utf-8');
      return JSON.parse(raw) as CacheEntry;
    }
  } catch { /* ignore */ }
  return null;
}

function writeFileCache(data: any) {
  try {
    const entry: CacheEntry = { data, timestamp: Date.now() };
    fs.writeFileSync(CACHE_FILE_PATH, JSON.stringify(entry), 'utf-8');
    memoryCache = entry;
  } catch { /* ignore write failures (e.g. read-only FS) */ }
}

function isCacheFresh(entry: CacheEntry | null): boolean {
  if (!entry) return false;
  return Date.now() - entry.timestamp < CACHE_TTL_MS;
}

// ─── LeetCode Fetcher ──────────────────────────────────────────────────────────
async function fetchLeetCodeStats() {
  const query = `
    query getUserProfile($username: String!) {
      matchedUser(username: $username) {
        username
        profile { ranking userAvatar realName aboutMe }
        badges { id displayName icon creationDate }
        submitStats {
          acSubmissionNum { difficulty count submissions }
          totalSubmissionNum { difficulty count submissions }
        }
      }
      userContestRanking(username: $username) {
        attendedContestsCount rating globalRanking totalParticipants topPercentage
      }
    }
  `;

  const res = await fetch('https://leetcode.com/graphql', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'User-Agent': 'Mozilla/5.0' },
    body: JSON.stringify({ query, variables: { username: 'subhashguptha308' } }),
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`LeetCode HTTP ${res.status}`);
  const json = await res.json();
  const user = json?.data?.matchedUser;
  const contest = json?.data?.userContestRanking;
  if (!user) throw new Error('LeetCode: no matched user');

  const acStats = user.submitStats?.acSubmissionNum || [];
  const getStat = (diff: string) => acStats.find((s: any) => s.difficulty === diff)?.count || 0;

  return {
    platform: 'leetcode' as const,
    lastUpdated: new Date().toISOString(),
    profileUrl: 'https://leetcode.com/u/subhashguptha308',
    stats: {
      totalSolved: getStat('All'),
      easySolved: getStat('Easy'),
      mediumSolved: getStat('Medium'),
      hardSolved: getStat('Hard'),
      totalEasy: 880, totalMedium: 1850, totalHard: 800,
      ranking: user.profile?.ranking || null,
      acceptanceRate: 100,
      totalSubmissions: acStats.find((s: any) => s.difficulty === 'All')?.submissions || 0,
      contestRating: contest?.rating ? Math.round(contest.rating) : null,
      contestsAttended: contest?.attendedContestsCount || 0,
      globalRanking: contest?.globalRanking || null,
      topPercentage: contest?.topPercentage || null,
    },
    badges: (user.badges || []).map((b: any) => ({
      title: b.displayName,
      imageUrl: b.icon,
      date: b.creationDate,
    })),
    charts: {
      difficulty: [
        { label: 'Easy', solved: getStat('Easy'), total: 880, color: '#00b8a3' },
        { label: 'Medium', solved: getStat('Medium'), total: 1850, color: '#ffc01e' },
        { label: 'Hard', solved: getStat('Hard'), total: 800, color: '#ff375f' },
      ],
    },
  };
}

// ─── CodeChef Fetcher ──────────────────────────────────────────────────────────
async function fetchCodeChefStats() {
  const res = await fetch('https://www.codechef.com/users/subhash3008', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    signal: AbortSignal.timeout(10000),
  });

  if (!res.ok) throw new Error(`CodeChef HTTP ${res.status}`);
  const html = await res.text();

  // Parse rating
  const ratingMatch = html.match(/class="rating-number">\s*(\d+)\s*<\/div>/i);
  const currentRating = ratingMatch ? parseInt(ratingMatch[1], 10) : 1000;

  // Parse highest rating
  const highestMatch = html.match(/\(Highest Rating\s*(\d+)\)/i);
  const highestRating = highestMatch ? parseInt(highestMatch[1], 10) : currentRating;

  // Parse stars
  let stars = 1;
  const starMatch = html.match(/<div class="rating-star">([\s\S]*?)<\/div>/i);
  if (starMatch) {
    const count = (starMatch[1].match(/&#9733;/g) || []).length;
    if (count > 0) stars = count;
  }

  // Parse division
  const divMatch = html.match(/\(Div\s*(\d+)\)/i);
  const division = divMatch ? `Div ${divMatch[1]}` : null;

  // Parse ranks
  const globalRankMatch = html.match(/<a href="\/ratings\/all"[^>]*>\s*<strong>\s*([^<]+?)\s*<\/strong>\s*<\/a>\s*Global Rank/i)
    || html.match(/<strong>\s*([^<]+?)\s*<\/strong>\s*<\/a>\s*Global Rank/i);
  const globalRank = globalRankMatch ? globalRankMatch[1].trim() : 'Inactive';

  const countryRankMatch = html.match(/<a href="\/ratings\/all\?filterBy=Country[^"]*"[^>]*>\s*<strong>\s*([^<]+?)\s*<\/strong>\s*<\/a>\s*Country Rank/i)
    || html.match(/<strong>\s*([^<]+?)\s*<\/strong>\s*<\/a>\s*Country Rank/i);
  const countryRank = countryRankMatch ? countryRankMatch[1].trim() : 'Inactive';

  // Parse rating history from Drupal.settings script
  let ratingHistory: { contest: string; rating: number }[] = [];
  const settingsMatch = html.match(/date_versus_rating":\s*\{[^}]*"all":\s*(\[[\s\S]*?\])/);
  if (settingsMatch) {
    try {
      const parsed = JSON.parse(settingsMatch[1]);
      if (Array.isArray(parsed)) {
        ratingHistory = parsed.map((entry: any) => ({
          contest: entry.name || entry.code || '',
          rating: entry.rating || 0,
        }));
      }
    } catch { /* ignore parse errors */ }
  }

  return {
    platform: 'codechef' as const,
    lastUpdated: new Date().toISOString(),
    profileUrl: 'https://www.codechef.com/users/subhash3008',
    stats: {
      currentRating,
      highestRating,
      stars,
      globalRank,
      countryRank,
      division,
    },
    ratingHistory,
    charts: {
      ratingProgress: ratingHistory.map((r: any) => ({ label: r.contest, value: r.rating })),
    },
  };
}

// ─── HackerRank Fetcher ────────────────────────────────────────────────────────
async function fetchHackerRankStats() {
  const headers = { 'User-Agent': 'Mozilla/5.0' };
  const timeout = AbortSignal.timeout(10000);

  const [profileRes, badgesRes] = await Promise.all([
    fetch('https://www.hackerrank.com/rest/contests/master/hackers/subhashguptha30/profile', { headers, signal: timeout }),
    fetch('https://www.hackerrank.com/rest/hackers/subhashguptha30/badges', { headers, signal: timeout }),
  ]);

  if (!profileRes.ok) throw new Error(`HackerRank profile HTTP ${profileRes.status}`);
  if (!badgesRes.ok) throw new Error(`HackerRank badges HTTP ${badgesRes.status}`);

  const profileJson = await profileRes.json();
  const badgesJson = await badgesRes.json();

  const profile = profileJson.model || {};
  const badges = (badgesJson.models || []).map((b: any) => ({
    name: b.badge_name || b.badge_short_name || 'Unknown',
    stars: b.stars || 0,
    solved: b.solved || 0,
    totalChallenges: b.total_challenges || 0,
    categoryName: b.category_name || '',
    url: b.url || '',
  }));

  return {
    platform: 'hackerrank' as const,
    lastUpdated: new Date().toISOString(),
    profileUrl: 'https://www.hackerrank.com/profile/subhashguptha30',
    stats: {
      name: profile.name || 'Unknown',
      level: profile.level || 1,
      country: profile.country || '',
      createdAt: profile.created_at || '',
      followersCount: profile.followers_count || 0,
    },
    badges,
    charts: {
      skills: badges.map((b: any) => ({
        label: b.name,
        value: b.stars,
        max: 5,
      })),
    },
  };
}

// ─── Google Cloud Skills Boost Fetcher ──────────────────────────────────────────
async function fetchGoogleSkillsStats() {
  const profileUrl = 'https://www.skills.google/public_profiles/ebe79b94-f4fe-401f-a94c-56023709ba11';
  const res = await fetch(profileUrl, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    },
    signal: AbortSignal.timeout(15000),
  });

  if (!res.ok) throw new Error(`Google Skills HTTP ${res.status}`);
  const html = await res.text();

  // Parse name
  const nameMatch = html.match(/<h1[^>]*class='ql-display-small'[^>]*>\s*([\s\S]*?)\s*<\/h1>/i);
  const name = nameMatch ? nameMatch[1].trim() : 'Subhash Guptha Gantasala';

  // Parse member since
  const memberMatch = html.match(/Member since\s*(\d{4})/i);
  const memberSince = memberMatch ? memberMatch[1] : '2025';

  // Parse league
  const leagueMatch = html.match(/<h2[^>]*class='ql-headline-medium'[^>]*>\s*([\s\S]*?)\s*<\/h2>/i);
  const league = leagueMatch ? leagueMatch[1].trim() : 'Bronze League';

  // Parse points
  const pointsMatch = html.match(/<strong>\s*(\d+)\s*points?\s*<\/strong>/i);
  const points = pointsMatch ? parseInt(pointsMatch[1], 10) : 0;

  // Parse badges
  const badges: { title: string; date: string; imageUrl: string }[] = [];
  const badgeRegex = /<div class='profile-badge'>\s*<a[^>]*>\s*<img[^>]*src="([^"]+)"[^>]*>\s*<\/a>\s*<span class='ql-title-medium[^']*'>\s*([\s\S]*?)\s*<\/span>\s*<span class='ql-body-medium[^']*'>\s*([\s\S]*?)\s*<\/span>/gi;

  let match;
  while ((match = badgeRegex.exec(html)) !== null) {
    badges.push({
      imageUrl: match[1].trim(),
      title: match[2].trim(),
      date: match[3].replace(/Earned\s*/i, '').trim(),
    });
  }

  return {
    platform: 'google-skills' as const,
    lastUpdated: new Date().toISOString(),
    profileUrl,
    stats: {
      name,
      memberSince,
      league,
      points,
      totalBadges: badges.length || 23,
    },
    badges,
  };
}

// ─── Main Fetch Orchestrator ────────────────────────────────────────────────────
async function fetchAllPlatforms() {
  const results: Record<string, any> = {};

  const fetchers = [
    { key: 'leetcode', fn: fetchLeetCodeStats, fallback: fallbackData.leetcode },
    { key: 'codechef', fn: fetchCodeChefStats, fallback: fallbackData.codechef },
    { key: 'hackerrank', fn: fetchHackerRankStats, fallback: fallbackData.hackerrank },
    { key: 'googleSkills', fn: fetchGoogleSkillsStats, fallback: fallbackData.googleSkills },
  ];

  await Promise.all(
    fetchers.map(async ({ key, fn, fallback }) => {
      try {
        results[key] = await fn();
      } catch (err) {
        console.error(`[achievements] ${key} fetch failed:`, err instanceof Error ? err.message : err);
        results[key] = { ...fallback, lastUpdated: fallback.lastUpdated, _fallback: true };
      }
    })
  );

  return results;
}

// ─── GET Handler ────────────────────────────────────────────────────────────────
export async function GET() {
  try {
    // 1. Check memory cache
    if (isCacheFresh(memoryCache)) {
      return NextResponse.json(memoryCache!.data, {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      });
    }

    // 2. Check file cache
    const fileCache = readFileCache();
    if (isCacheFresh(fileCache)) {
      memoryCache = fileCache;
      return NextResponse.json(fileCache!.data, {
        headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
      });
    }

    // 3. Fetch fresh data
    const freshData = await fetchAllPlatforms();
    writeFileCache(freshData);

    return NextResponse.json(freshData, {
      headers: { 'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400' },
    });
  } catch (err) {
    console.error('[achievements] Critical error:', err);

    // Attempt file cache as fallback
    const fileCache = readFileCache();
    if (fileCache) {
      return NextResponse.json(fileCache.data, { status: 200 });
    }

    // Ultimate fallback: seed data
    return NextResponse.json(fallbackData, { status: 200 });
  }
}
