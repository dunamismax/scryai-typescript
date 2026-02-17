// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

interface SocialLink {
  href: string;
  label: string;
}

interface Site {
  website: string;
  author: string;
  profile: string;
  desc: string;
  title: string;
  ogImage: string;
  lightAndDarkMode: boolean;
  postPerIndex: number;
  postPerPage: number;
  scheduledPostMargin: number;
  showArchives: boolean;
  showBackButton: boolean;
  editPost: {
    enabled: boolean;
    text: string;
    url: string;
  };
  dynamicOgImage: boolean;
  lang: string;
  timezone: string;
}

// Site configuration
export const SITE: Site = {
  website: "https://example.com/",
  author: "Your Name",
  profile: "https://example.com/about",
  desc: "astro-blog-template: a clean, fast, and highly customizable Astro blog starter.",
  title: "astro-blog-template",
  ogImage: "template-avatar.svg",
  lightAndDarkMode: true,
  postPerIndex: 10,
  postPerPage: 10,
  scheduledPostMargin: 15 * 60 * 1000,
  showArchives: true,
  showBackButton: false,
  editPost: {
    enabled: false,
    text: "Edit on GitHub",
    url: "https://github.com/your-handle/your-blog/edit/main/",
  },
  dynamicOgImage: true,
  lang: "en",
  timezone: "UTC",
};

export const SITE_TITLE = SITE.title;
export const SITE_DESCRIPTION = SITE.desc;

// Navigation links
export const NAV_LINKS: SocialLink[] = [
  {
    href: "/",
    label: "Blog",
  },
  {
    href: "/about",
    label: "About",
  },
];

// Social media links
export const SOCIAL_LINKS: SocialLink[] = [
  {
    href: "https://github.com/your-handle",
    label: "GitHub",
  },
  {
    href: "https://x.com/your-handle",
    label: "Twitter",
  },
  {
    href: "https://www.linkedin.com/in/your-handle/",
    label: "LinkedIn",
  },
  {
    href: "mailto:you@example.com",
    label: "Email",
  },
  {
    href: "https://bsky.app/profile/your-handle.bsky.social",
    label: "BlueSky",
  },
  {
    href: "/rss.xml",
    label: "RSS",
  },
];

// Icon map for social media
export const ICON_MAP: Record<string, string> = {
  GitHub: "github",
  Twitter: "twitter",
  LinkedIn: "linkedin",
  Email: "mail",
  BlueSky: "bsky",
  RSS: "rss",
};
