/**
 * velog CDN에 핫링크된 이미지를 레포로 가져온다.
 *
 * - 정지 이미지는 그대로 내려받아 next/image 최적화 경로에 태운다
 * - 애니메이션 GIF는 MP4로 변환한다. Next의 이미지 최적화기는 GIF를
 *   정지 이미지로 만들어 애니메이션을 잃고, 원본을 그대로 내보내면
 *   24MB짜리가 사용자에게 전송된다. MP4는 92% 작고 하드웨어 디코딩이 된다.
 *
 * 실행: node scripts/migrate-velog-images.mjs [--dry]
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const DRY = process.argv.includes("--dry");
const POSTS_DIR = "_posts";
const PUBLIC_DIR = "public";
const VELOG = /https:\/\/velog\.velcdn\.com[^\s)"'<>]+/g;

/** 마크다운 파일 목록 */
function listPosts() {
  const out = [];
  for (const cat of fs.readdirSync(POSTS_DIR)) {
    const dir = path.join(POSTS_DIR, cat);
    if (!fs.statSync(dir).isDirectory()) continue;
    for (const f of fs.readdirSync(dir)) {
      if (f.endsWith(".md")) out.push(path.join(dir, f));
    }
  }
  return out;
}

/**
 * 이미지를 둘 디렉터리.
 * 카테고리 이름이 _posts와 public에서 갈려 있으므로(projects vs project)
 * 추측하지 않고 coverImage가 가리키는 실제 디렉터리를 따른다.
 */
function assetDirFor(file, source) {
  const cover = source.match(/^coverImage:\s*"([^"]+)"/m)?.[1];
  if (cover) return path.join(PUBLIC_DIR, path.dirname(cover));

  const cat = path.basename(path.dirname(file));
  const slug = path.basename(file, ".md");
  return path.join(PUBLIC_DIR, "images", "posts", cat, slug);
}

function download(url, dest) {
  execFileSync("curl", ["-sSL", "--max-time", "120", url, "-o", dest]);
}

/**
 * 애니메이션 GIF인지 (프레임 2개 이상).
 * sharp의 metadata()는 비동기라 이 동기 스크립트에 맞지 않고,
 * 초대형 GIF는 픽셀 한도에 걸려 읽지도 못한다. ffprobe가 더 견고하다.
 */
function isAnimatedGif(file) {
  if (!file.endsWith(".gif")) return false;
  try {
    const frames = execFileSync("ffprobe", [
      "-v", "error", "-select_streams", "v:0",
      "-count_frames", "-show_entries", "stream=nb_read_frames",
      "-of", "csv=p=0", file,
    ]).toString().trim();
    return Number(frames) > 1;
  } catch {
    return false;
  }
}

function gifToMp4(gif, mp4) {
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", gif,
    "-movflags", "faststart",
    "-pix_fmt", "yuv420p",
    // h264는 짝수 해상도만 허용한다
    "-vf", "scale=trunc(iw/2)*2:trunc(ih/2)*2",
    "-crf", "28",
    mp4,
  ]);
}

/**
 * 첫 프레임을 poster로 뽑는다. 재생 전에도 자리와 그림이 보이도록.
 * webp 인코더가 없는 ffmpeg 빌드가 흔해서 JPEG를 쓴다.
 */
function gifToPoster(gif, poster) {
  execFileSync("ffmpeg", [
    "-y", "-loglevel", "error", "-i", gif,
    "-vframes", "1", "-q:v", "4",
    poster,
  ]);
}

function videoSize(mp4) {
  const out = execFileSync("ffprobe", [
    "-v", "error", "-select_streams", "v:0",
    "-show_entries", "stream=width,height",
    "-of", "csv=p=0", mp4,
  ]).toString().trim();
  const [w, h] = out.split(",").map(Number);
  return { width: w, height: h };
}

const summary = { posts: 0, images: 0, videos: 0, bytesBefore: 0, bytesAfter: 0 };
const tmp = fs.mkdtempSync("/tmp/velog-mig-");

for (const file of listPosts()) {
  let source = fs.readFileSync(file, "utf8");
  const urls = [...new Set(source.match(VELOG) ?? [])];
  if (urls.length === 0) continue;

  const assetDir = assetDirFor(file, source);
  if (!DRY) fs.mkdirSync(assetDir, { recursive: true });
  const publicBase = "/" + path.relative(PUBLIC_DIR, assetDir);

  let imgN = 0;
  let clipN = 0;
  console.log(`\n${file}  →  ${assetDir}  (${urls.length}개)`);

  for (const url of urls) {
    const ext = (url.split(".").pop() ?? "png").toLowerCase().replace(/[^a-z0-9]/g, "");
    const staged = path.join(tmp, `stage.${ext}`);
    download(url, staged);
    summary.bytesBefore += fs.statSync(staged).size;

    if (isAnimatedGif(staged)) {
      clipN += 1;
      const name = `clip${clipN}`;
      const mp4 = path.join(assetDir, `${name}.mp4`);
      const poster = path.join(assetDir, `${name}-poster.jpg`);

      if (!DRY) {
        gifToMp4(staged, mp4);
        gifToPoster(staged, poster);
      }
      const { width, height } = DRY ? { width: 0, height: 0 } : videoSize(mp4);
      if (!DRY) {
        summary.bytesAfter +=
          fs.statSync(mp4).size + fs.statSync(poster).size;
      }
      summary.videos += 1;

      // 마크다운/HTML 어느 쪽으로 쓰였든 <video>로 바꾼다.
      // autoplay는 muted+playsinline이 함께 있어야 모바일에서 동작한다.
      const video =
        `<video autoplay loop muted playsinline ` +
        `width="${width}" height="${height}" ` +
        `poster="${publicBase}/${name}-poster.jpg" ` +
        `class="md-video">` +
        `<source src="${publicBase}/${name}.mp4" type="video/mp4">` +
        `</video>`;

      const esc = url.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      source = source
        .replace(new RegExp(`!\\[[^\\]]*\\]\\(${esc}\\)`, "g"), video)
        .replace(new RegExp(`<img[^>]*src=["']${esc}["'][^>]*>`, "g"), video);
      console.log(`  🎬 ${name}.mp4  ${width}x${height}`);
    } else {
      imgN += 1;
      const name = `img${imgN}.${ext}`;
      const dest = path.join(assetDir, name);
      if (!DRY) {
        fs.copyFileSync(staged, dest);
        summary.bytesAfter += fs.statSync(dest).size;
      }
      summary.images += 1;

      // URL만 바꾼다. width/style 같은 저자의 의도는 그대로 둔다.
      source = source.split(url).join(`${publicBase}/${name}`);
      console.log(`  🖼  ${name}`);
    }
  }

  if (!DRY) fs.writeFileSync(file, source);
  summary.posts += 1;
}

fs.rmSync(tmp, { recursive: true, force: true });

const mb = (n) => (n / 1048576).toFixed(1);
console.log(
  `\n글 ${summary.posts}개 · 이미지 ${summary.images}개 · 영상 ${summary.videos}개` +
    `\n${mb(summary.bytesBefore)}MB → ${mb(summary.bytesAfter)}MB`,
);
