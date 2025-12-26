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
  bio: "프로젝트를 좋아하는 주니어 개발자입니다.\n부족하더라도 항상 씩씩한 사람이 되고 싶습니다.",
  profileImage: "/images/common/profile_img.png",
  links: {
    github: "https://github.com/changchangwoo",
    email: "mailto:changchangwoo@naver.com",
  },
};
