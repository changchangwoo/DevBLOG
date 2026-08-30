/**
 * 원본 이미지를 "실제로 필요한 최대 크기"까지만 줄인다.
 *
 * 서빙 용량은 이미 /_next/image가 해결한다. 여기서 줄이는 건 레포 무게와
 * 빌드 비용이다. 8K 원본은 매 빌드마다 sharp가 디코딩하고, .git은 그 무게를
 * 영원히 안고 간다.
 *
 * 상한은 srcset이 실제로 요청할 수 있는 최대 폭에서 나온다.
 *   커버   슬롯 800px  · DPR2 → 1600 → 1920 버킷
 *   본문   srcset 상한이 1200 (lib/rehype-image.ts) · 여유를 둬 1600
 *   공용   로고·프로필 등 작게 쓰이는 것들
 *
 * 실행: node scripts/optimize-source-images.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const DRY = process.argv.includes("--dry");
const ROOT = "public/images";

function capFor(file) {
  const base = path.basename(file);
  if (file.includes(`${path.sep}common${path.sep}`)) return 1200;
  if (/^(cover|.*-poster)\./i.test(base)) return 1920;
  return 1600;
}

function listImages(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) listImages(p, out);
    else if (/\.(png|jpe?g|webp)$/i.test(e.name)) out.push(p);
  }
  return out;
}

/**
 * 포맷은 그대로 둔다. 확장자가 바뀌면 마크다운·frontmatter의 참조를
 * 전부 고쳐야 하는데, 얻는 것에 비해 깨질 구석이 많다.
 */
function encoder(pipeline, ext) {
  if (ext === ".png") {
    return pipeline.png({ compressionLevel: 9, effort: 10 });
  }
  if (ext === ".webp") {
    return pipeline.webp({ quality: 82, effort: 6 });
  }
  return pipeline.jpeg({ quality: 82, mozjpeg: true, progressive: true });
}

const results = [];

for (const file of listImages(ROOT)) {
  const ext = path.extname(file).toLowerCase();
  const before = fs.statSync(file).size;

  let meta;
  try {
    meta = await sharp(file, { limitInputPixels: false }).metadata();
  } catch (error) {
    console.log(`  ⚠ 건너뜀 (읽기 실패): ${file}  ${error.message.slice(0, 50)}`);
    continue;
  }

  const cap = capFor(file);
  const needsResize = (meta.width ?? 0) > cap;

  const pipeline = sharp(file, { limitInputPixels: false }).rotate();
  const sized = needsResize
    ? pipeline.resize({ width: cap, withoutEnlargement: true })
    : pipeline;

  let buffer;
  try {
    buffer = await encoder(sized, ext).toBuffer();
  } catch (error) {
    console.log(`  ⚠ 건너뜀 (변환 실패): ${file}  ${error.message.slice(0, 50)}`);
    continue;
  }

  // 재압축이 오히려 커지는 경우가 있다. 그럴 땐 원본을 지킨다.
  if (buffer.length >= before) {
    results.push({ file, before, after: before, resized: false, kept: true });
    continue;
  }

  if (!DRY) fs.writeFileSync(file, buffer);
  results.push({
    file,
    before,
    after: buffer.length,
    resized: needsResize,
    from: `${meta.width}x${meta.height}`,
    kept: false,
  });
}

const sum = (k) => results.reduce((s, r) => s + r[k], 0);
const changed = results.filter((r) => !r.kept);
const mb = (n) => (n / 1048576).toFixed(1);

console.log(`\n=== ${DRY ? "예상" : "적용"} 결과 ===`);
changed
  .sort((a, b) => b.before - b.after - (a.before - a.after))
  .slice(0, 12)
  .forEach((r) =>
    console.log(
      `  ${mb(r.before).padStart(5)}MB → ${mb(r.after).padStart(5)}MB  ` +
        `${r.resized ? r.from.padEnd(10) : "재압축만".padEnd(10)}  ` +
        r.file.replace("public/images/", ""),
    ),
  );

console.log(
  `\n  대상 ${results.length}개 중 ${changed.length}개 축소` +
    `\n  ${mb(sum("before"))}MB → ${mb(sum("after"))}MB` +
    ` (${(((sum("before") - sum("after")) / sum("before")) * 100).toFixed(0)}% 감소)`,
);
