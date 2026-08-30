export const SITE_URL = "https://www.changchangwoo.com";

export const PINNED_POST_SLUG = "life/2025-retrospect";

export interface CategoryInfo {
  label: string;
  colorClass: string;
}

export const CATEGORY_MAP: Record<string, CategoryInfo> = {
  activities: { label: "활동", colorClass: "bg-category-activity" },
  life: { label: "일상", colorClass: "bg-category-life" },
  projects: { label: "프로젝트", colorClass: "bg-category-project" },
  tech: { label: "기술", colorClass: "bg-category-tech" },
};

export interface AuthorInfo {
  name: string;
  role: string;
  bio: string;
  profileImage: string;
  links: {
    github?: string;
    email?: string;
  };
}

export const AUTHOR_INFO: AuthorInfo = {
  name: "이창우",
  role: "프론트엔드 개발자",
  bio: "프로젝트를 좋아하는 개발자입니다.\n부족하더라도 씩씩한 사람이 되고 싶습니다.",
  profileImage: "/images/common/profile_img.png",
  links: {
    github: "https://github.com/changchangwoo",
    email: "mailto:changchangwoo@naver.com",
  },
};

/**
 * 경력·활동 카드 한 장의 데이터.
 * `logo`가 없으면 `title`의 첫 글자를 이니셜로 그린다 (더미 단계용).
 */
export interface TimelineEntry {
  title: string;
  role?: string;
  period: string;
  description?: string;
  logo?: string;
}

// TODO: 더미 데이터 — 실제 이력으로 교체
export const CAREERS: TimelineEntry[] = [
  {
    title: "ZEP",
    role: "프론트엔드 개발자 · 정규직",
    period: "2026-08 ~ 재직중",
    logo: "/images/about/zep.png",
  },
  {
    title: "ZEP",
    role: "프론트엔드 개발자 · 인턴",
    period: "2026-02 ~ 2026-08",
    logo: "/images/about/zep.png",
  },
];

// TODO: 더미 데이터 — 실제 활동으로 교체
export const ACTIVITIES: TimelineEntry[] = [
  {
    title: "Mash-Up 16기 · Web",
    period: "2026.02 ~ 2026.09",
    logo: "/images/about/매쉬업로고.png",
  },
  {
    title: "프로그래머스 데브코스 · Web",
    period: "2024.03 ~ 2024.09",
    logo: "/images/about/devcourse.jpg",
  },
];
