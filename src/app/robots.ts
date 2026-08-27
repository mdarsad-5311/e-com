import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/checkout", "/checkout/*", "/admin", "/profile", "/orders"],
    },
    sitemap: "https://e-com-five-pink.vercel.app/sitemap.xml",
  };
}
