#!/usr/bin/env node
// Run once locally: npm install sharp  →  node scripts/convert-images.js
// Outputs WebP files alongside the originals. Commit them, then push.

const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const THUMB_DIR = path.join(__dirname, '..', 'images', 'thumbs');
const PROFILE_SRC = path.join(__dirname, '..', 'images', 'profile-image-02.jpg');
const PROFILE_DEST = path.join(__dirname, '..', 'images', 'profile-image-02.webp');

// Thumbnails: resize to 900px wide (covers mobile 1x + desktop 2x retina)
const THUMB_WIDTH = 900;
const WEBP_QUALITY = 82;

// Profile avatar: resize to 600px (displayed at max 288px, covers 2x retina)
const AVATAR_SIZE = 600;

const thumbFiles = [
  'tba.jpeg',
  'elevate.jpeg',
  'psbraces.jpeg',
  'theurerortho.jpeg',
  'implantclub.jpeg',
  'greco.jpeg',
  'myyonkersorthodontist.jpeg',
  'nelson.jpeg',
  'assabet.jpeg',
  'aces.jpeg',
  'goldenberg.jpeg',
  'bayareaortho.jpeg',
];

async function convertThumbs() {
  for (const file of thumbFiles) {
    const src = path.join(THUMB_DIR, file);
    const dest = path.join(THUMB_DIR, file.replace(/\.(jpe?g|png)$/i, '.webp'));

    if (!fs.existsSync(src)) {
      console.warn(`  SKIP  ${file} (not found)`);
      continue;
    }

    await sharp(src)
      .resize({ width: THUMB_WIDTH, withoutEnlargement: true })
      .webp({ quality: WEBP_QUALITY })
      .toFile(dest);

    const srcKB = Math.round(fs.statSync(src).size / 1024);
    const destKB = Math.round(fs.statSync(dest).size / 1024);
    console.log(`  OK    ${file} → ${path.basename(dest)}  (${srcKB} KB → ${destKB} KB)`);
  }
}

async function convertProfile() {
  await sharp(PROFILE_SRC)
    .resize({ width: AVATAR_SIZE, height: AVATAR_SIZE, fit: 'cover', position: 'top' })
    .webp({ quality: WEBP_QUALITY })
    .toFile(PROFILE_DEST);

  const srcKB = Math.round(fs.statSync(PROFILE_SRC).size / 1024);
  const destKB = Math.round(fs.statSync(PROFILE_DEST).size / 1024);
  console.log(`  OK    profile-image-02.jpg → profile-image-02.webp  (${srcKB} KB → ${destKB} KB)`);
}

(async () => {
  console.log('Converting images to WebP…\n');
  await convertThumbs();
  await convertProfile();
  console.log('\nDone. Commit the new .webp files and push.');
})();
