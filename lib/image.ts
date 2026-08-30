import fs from "fs";
import path from "path";
import { cache } from "react";
import sharp from "sharp";

const publicDirectory = path.join(process.cwd(), "public");

/** next.config.ts의 deviceSizes와 맞춘다 */
export const IMAGE_WIDTHS = [640, 828, 1080, 1200, 1920, 2048] as const;
export const IMAGE_QUALITY = 75;

export interface ImageMeta {
  width: number;
  height: number;
  /** 12px 썸네일 data URI (약 300바이트) */
  blurDataURL: string;
}

/** `/images/...` 형태의 public 경로를 실제 파일 경로로 바꾼다. */
function resolvePublicPath(src: string): string | null {
  if (!src.startsWith("/")) return null;

  const filePath = path.join(publicDirectory, decodeURIComponent(src));
  if (!filePath.startsWith(publicDirectory)) return null;

  return fs.existsSync(filePath) ? filePath : null;
}

/**
 * 빌드 타임에 이미지의 실제 크기와 블러 썸네일을 읽는다.
 * 원본을 읽어야 하므로 Server Component / 빌드 스크립트에서만 호출 가능하다.
 * 같은 이미지가 목록·상세에서 반복 등장하므로 cache()로 감싼다.
 */
export const getImageMeta = cache(
  async (src: string): Promise<ImageMeta | null> => {
    const filePath = resolvePublicPath(src);
    if (!filePath) return null;

    try {
      const image = sharp(filePath);
      const { width, height } = await image.metadata();
      if (!width || !height) return null;

      // 12px 폭이면 형태만 남고 용량은 무시할 수준이 된다.
      const buffer = await image
        .resize(12, null, { fit: "inside" })
        .webp({ quality: 40 })
        .toBuffer();

      return {
        width,
        height,
        blurDataURL: `data:image/webp;base64,${buffer.toString("base64")}`,
      };
    } catch {
      // 손상된 파일 하나 때문에 빌드가 죽지 않도록 한다.
      return null;
    }
  },
);

/**
 * Next의 이미지 최적화기는 deviceSizes/imageSizes에 있는 폭만 허용한다.
 * (임의의 값은 400을 반환한다)
 */
export function snapWidth(width: number): number {
  return (
    IMAGE_WIDTHS.find((w) => w >= width) ?? IMAGE_WIDTHS[IMAGE_WIDTHS.length - 1]
  );
}

/** next/image의 최적화 엔드포인트 URL. width는 반드시 허용된 값이어야 한다. */
export function optimizedSrc(src: string, width: number): string {
  const params = new URLSearchParams({
    url: src,
    w: String(width),
    q: String(IMAGE_QUALITY),
  });
  return `/_next/image?${params}`;
}

/** 원본보다 큰 폭은 낭비이므로 제외한다. */
export function buildSrcSet(src: string, intrinsicWidth: number): string {
  const widths = IMAGE_WIDTHS.filter((w) => w <= intrinsicWidth);
  if (widths.length === 0) widths.push(IMAGE_WIDTHS[0]);

  return widths.map((w) => `${optimizedSrc(src, w)} ${w}w`).join(", ");
}
