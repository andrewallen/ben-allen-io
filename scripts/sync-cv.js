import { readFile, writeFile, mkdir, readdir, lstat, cp } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { imageSize } from 'image-size';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = `${__dirname}/..`;

const src = `${root}/cv.md`;
const out = `${root}/src/pages/cv.md`;
const photosSrc = `${root}/photos`;
const photosOut = `${root}/public/photos`;
const photosManifest = `${root}/src/data/photos.json`;
const heroOut = `${root}/src/images/hero.png`;

const frontmatter = `---\nlayout: ../layouts/CV.astro\ntitle: Ben Allen — CV\ndescription: Full CV for Ben Allen.\n---\n`;

try {
  const md = await readFile(src, 'utf8');
  await mkdir(dirname(out), { recursive: true });
  await writeFile(out, frontmatter + md, 'utf8');
  console.log(`Synced CV → ${out}`);
} catch (err) {
  console.error('Failed to sync cv.md:', err.message);
  process.exit(0); // do not fail the build if local file is missing
}

// Copy photos/ to public/photos and generate a manifest for the site
try {
  const entries = await readdir(photosSrc);
  const images = [];
  const meta = [];
  await mkdir(photosOut, { recursive: true });
  const photosRoot = resolve(photosSrc) + '/';
  const SIZE_LIMIT_BYTES = 20 * 1024 * 1024; // 20MB per image
  for (const name of entries) {
    const srcPath = join(photosSrc, name);
    // Resolve and enforce that the file stays within photos/
    const resolved = resolve(srcPath);
    if (!resolved.startsWith(photosRoot)) {
      console.warn(`Skipping unsafe path outside photos/: ${name}`);
      continue;
    }
    let st;
    try {
      st = await lstat(srcPath);
    } catch (e) {
      console.warn(`Skipping unreadable entry: ${name} — ${e.message}`);
      continue;
    }
    // Disallow symlinks to avoid traversal/leakage
    if (st.isSymbolicLink()) {
      console.warn(`Skipping symlink: ${name}`);
      continue;
    }
    if (!st.isFile()) continue;
    const lower = name.toLowerCase();
    if (!(/\.(png|jpe?g|webp|gif)$/i.test(lower))) continue;
    if (st.size > SIZE_LIMIT_BYTES) {
      console.warn(`Skipping oversized image (>20MB): ${name}`);
      continue;
    }
    const destPath = join(photosOut, name);
    try {
      // Do not dereference symlinks (belt-and-braces) and overwrite existing
      await cp(srcPath, destPath, { force: true, dereference: false });
    } catch (e) {
      console.warn(`Copy failed for ${name}: ${e.message}`);
      continue;
    }
    images.push(name);
    try {
      const dim = imageSize(srcPath);
      if (dim && dim.width && dim.height) {
        meta.push({ name, width: dim.width, height: dim.height, type: dim.type });
      }
    } catch (e) {
      console.warn(`Dims failed for ${name}: ${e.message}`);
    }
  }
  images.sort((a,b) => a.localeCompare(b));
  meta.sort((a,b) => a.name.localeCompare(b.name));
  await mkdir(dirname(photosManifest), { recursive: true });
  await writeFile(photosManifest, JSON.stringify({ images, meta }, null, 2), 'utf8');
  console.log(`Synced ${images.length} photo(s) → ${photosOut}`);

  // Prepare hero image for astro:assets optimization (static import path)
  try {
    const preferred = images.find(n => /computer|portrait|supermarket|barman|barista/i.test(n)) || images[0];
    if (preferred) {
      await mkdir(dirname(heroOut), { recursive: true });
      await cp(join(photosOut, preferred), heroOut, { force: true });
      console.log(`Prepared hero image → ${heroOut} (from ${preferred})`);
    }
  } catch (e) {
    console.warn('Hero image prep skipped:', e.message);
  }
} catch (err) {
  console.warn('No photos synced (optional):', err.message);
}
