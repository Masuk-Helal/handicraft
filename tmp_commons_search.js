const queries = process.argv.slice(2);
const base = 'https://commons.wikimedia.org/w/api.php';

async function search(q) {
  const params = new URLSearchParams({
    action: 'query',
    format: 'json',
    generator: 'search',
    gsrsearch: `filetype:bitmap ${q}`,
    gsrnamespace: '6',
    gsrlimit: '8',
    prop: 'imageinfo',
    iiprop: 'url|size|extmetadata',
    iiurlwidth: '900',
  });
  const r = await fetch(`${base}?${params}`, { headers: { 'User-Agent': 'heritage-site/1.0 (local dev)' } });
  const j = await r.json();
  const pages = j?.query?.pages || {};
  return Object.values(pages)
    .sort((a, b) => (a.index || 99) - (b.index || 99))
    .map((p) => {
      const ii = p.imageinfo?.[0] || {};
      const md = ii.extmetadata || {};
      const lic = (md.LicenseShortName?.value || '?').replace(/<[^>]+>/g, '');
      const artist = (md.Artist?.value || '?').replace(/<[^>]+>/g, '').trim();
      return {
        title: p.title.replace('File:', ''),
        w: ii.width,
        h: ii.height,
        lic,
        artist,
        thumb: ii.thumburl,
        page: ii.descriptionurl,
      };
    });
}

(async () => {
  for (const q of queries) {
    console.log(`\n=== ${q} ===`);
    try {
      const res = await search(q);
      for (const x of res) {
        console.log(`- ${x.title} | ${x.w}x${x.h} | ${x.lic} | ${x.artist}`);
        console.log(`  ${x.thumb}`);
      }
    } catch (e) {
      console.log('ERR', e.message);
    }
  }
})();
