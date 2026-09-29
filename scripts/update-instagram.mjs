// Pulls the umcpfds Instagram account's latest post via the official
// Instagram Graph API and writes its permalink into public/landingPage.txt.
// Run by .github/workflows/update-instagram.yml on a schedule.
import { readFile, writeFile } from 'node:fs/promises';

const ACCESS_TOKEN = process.env.IG_ACCESS_TOKEN;
const USER_ID = process.env.IG_USER_ID;
const LANDING_PAGE_PATH = 'public/landingPage.txt';

if (!ACCESS_TOKEN || !USER_ID) {
  throw new Error('IG_ACCESS_TOKEN and IG_USER_ID environment variables are required');
}

const apiUrl = `https://graph.facebook.com/v21.0/${USER_ID}/media?fields=permalink,timestamp&limit=1&access_token=${ACCESS_TOKEN}`;

const res = await fetch(apiUrl);
if (!res.ok) {
  throw new Error(`Instagram Graph API request failed (${res.status}): ${await res.text()}`);
}

const { data } = await res.json();
const latest = data?.[0];
if (!latest?.permalink) {
  throw new Error('Instagram Graph API returned no media');
}

const content = await readFile(LANDING_PAGE_PATH, 'utf8');
if (!/INSTAGRAM URL/.test(content)) {
  throw new Error(`${LANDING_PAGE_PATH} has no "INSTAGRAM URL" section`);
}

const updated = content.replace(/(INSTAGRAM URL\r?\n)([^\r\n]*)/, `$1${latest.permalink}`);

if (updated === content) {
  console.log('Instagram URL already up to date:', latest.permalink);
} else {
  await writeFile(LANDING_PAGE_PATH, updated, 'utf8');
  console.log('Updated Instagram URL to:', latest.permalink);
}
