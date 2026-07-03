import { test, expect } from '@playwright/test';
import fs from 'node:fs';
import path from 'node:path';
import jpeg from 'jpeg-js';
import { PNG } from 'pngjs';
import pixelmatch from 'pixelmatch';

const REFERENCE = path.resolve('tests/fixtures/reference-command-center.png');
const OUTPUT_DIR = path.resolve('tests/output');
const MAX_DIFF_RATIO = 0.15;

function loadImage(filePath: string): PNG {
  const buffer = fs.readFileSync(filePath);

  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    const decoded = jpeg.decode(buffer, { useTArray: true });
    const raw = new PNG({ width: decoded.width, height: decoded.height });
    raw.data = Buffer.from(decoded.data);
    return PNG.sync.read(PNG.sync.write(raw));
  }

  return PNG.sync.read(buffer);
}

function cropImage(source: PNG, width: number, height: number): PNG {
  const target = new PNG({ width, height });
  for (let y = 0; y < height; y += 1) {
    for (let x = 0; x < width; x += 1) {
      const srcIdx = (source.width * y + x) << 2;
      const destIdx = (width * y + x) << 2;
      target.data[destIdx] = source.data[srcIdx];
      target.data[destIdx + 1] = source.data[srcIdx + 1];
      target.data[destIdx + 2] = source.data[srcIdx + 2];
      target.data[destIdx + 3] = source.data[srcIdx + 3];
    }
  }
  return target;
}

function compareImages(actualPath: string, expectedPath: string) {
  const actual = loadImage(actualPath);
  const expected = loadImage(expectedPath);

  const width = Math.min(actual.width, expected.width);
  const height = Math.min(actual.height, expected.height);
  const diff = new PNG({ width, height });

  const croppedActual = cropImage(actual, width, height);
  const croppedExpected = cropImage(expected, width, height);

  const diffPixels = pixelmatch(croppedActual.data, croppedExpected.data, diff.data, width, height, {
    threshold: 0.18,
    includeAA: true
  });

  const totalPixels = width * height;
  const diffRatio = diffPixels / totalPixels;

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUTPUT_DIR, 'diff.png'), PNG.sync.write(diff));

  return { diffPixels, totalPixels, diffRatio, width, height };
}

test('command center matches reference design', async ({ page }) => {
  await page.goto('/?static=1');
  await page.waitForSelector('[data-testid="command-center"]');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(1000);

  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  const screenshotPath = path.join(OUTPUT_DIR, 'actual-command-center.png');
  await page.screenshot({ path: screenshotPath, fullPage: false });

  expect(fs.existsSync(REFERENCE)).toBeTruthy();

  const { diffRatio, diffPixels, totalPixels, width, height } = compareImages(screenshotPath, REFERENCE);

  console.log(
    `Visual diff: ${(diffRatio * 100).toFixed(2)}% (${diffPixels}/${totalPixels} pixels) at ${width}x${height}`
  );
  console.log(`Actual screenshot: ${screenshotPath}`);
  console.log(`Diff image: ${path.join(OUTPUT_DIR, 'diff.png')}`);

  expect(diffRatio).toBeLessThanOrEqual(MAX_DIFF_RATIO);
});
