import Image from "next/image";
import IconWithLabel from "@/components/common/IconWithLabel";
import Divider from "@/components/common/Divider";
import { AUTHOR_INFO } from "@/lib/author";

export default function MainProfile() {
  const contactList = [
    ...(AUTHOR_INFO.links.github
      ? [
          {
            label: "GitHub",
            value: "GitHub",
            href: AUTHOR_INFO.links.github,
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
              </svg>
            ),
          },
        ]
      : []),
    ...(AUTHOR_INFO.links.email
      ? [
          {
            label: "Contact",
            value: "Email",
            href: AUTHOR_INFO.links.email,
            icon: (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                xmlns="http://www.w3.org/2000/svg"
              >
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="M22 7l-10 7L2 7" />
              </svg>
            ),
          },
        ]
      : []),
  ];

  return (
    <aside className="w-full ">
      <Divider label="소개" spacing="md" className="title2" />
      <div className="pt-[3rem]">
        <div className="flex flex-col gap-[1rem]">
          <div className="flex flex-col gap-[2rem] items-center">
            <Image
              width={120}
              height={120}
              src={AUTHOR_INFO.profileImage}
              alt="프로필 이미지"
              className="rounded-full"
            />
            <div className="flex flex-col items-center">
              <span className="title3 text-primary">{AUTHOR_INFO.name}</span>
              <span className="body1 text-primary">{AUTHOR_INFO.role}</span>
            </div>
          </div>
          <p className="body3 text-descript text-center">
            {AUTHOR_INFO.bio.split("\n").map((line, index) => (
              <span key={index}>
                {line}
                {index < AUTHOR_INFO.bio.split("\n").length - 1 && <br />}
              </span>
            ))}
          </p>

          <div className="rounded-[8px] flex gap-[1rem] items-center justify-center relative">
            {contactList.map((contact) => (
              <IconWithLabel
                key={contact.label}
                icon={contact.icon}
                label={contact.label}
                href={contact.href}
                target="_blank"
                rel="noopener noreferrer"
              />
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
