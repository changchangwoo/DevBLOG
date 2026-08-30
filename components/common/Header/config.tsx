export const headerConfig = {
  logo: {
    light: "/images/common/logo_light.png",
    dark: "/images/common/logo_dark.png",
    alt: "Logo",
    width: 24,
    height: 24,
  },
  siteTitle: "Changchangwoo's blog",
  navigation: {
    home: { href: "/", label: "Home" },
    about: { href: "/about", label: "About" },
    til: { href: "/til", label: "TIL" },
  },
} as const;

export type HeaderConfig = typeof headerConfig;

export const ThemeIcons = {
  sun: (
    <svg
      className="h-[2.4rem] w-[2.4rem]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
      />
    </svg>
  ),
  moon: (
    <svg
      className="h-[2.4rem] w-[2.4rem]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
      />
    </svg>
  ),
  search: (
    <svg
      className=" h-[2.4rem] w-[2.4rem] text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
      />
    </svg>
  ),
};

export const MenuIcons = {
  hamburger: (
    <svg
      className="h-[2.4rem] w-[2.4rem]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4 6h16M4 12h16M4 18h16"
      />
    </svg>
  ),
  close: (
    <svg
      className="h-[2.4rem] w-[2.4rem]"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M6 18L18 6M6 6l12 12"
      />
    </svg>
  ),
};

/**
 * 테마 토글 버튼의 아이콘.
 * 마운트 여부에 의존하지 않도록 CSS(dark: variant)만으로 전환한다.
 */
export const ThemeToggleIcon = (
  <>
    <span className="hidden dark:block">{ThemeIcons.sun}</span>
    <span className="block dark:hidden">{ThemeIcons.moon}</span>
  </>
);
