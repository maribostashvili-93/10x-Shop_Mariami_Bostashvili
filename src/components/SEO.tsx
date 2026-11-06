import { useEffect } from "react";

export const SITE_URL = "https://10x-shop-mariami-bostashvili-mt61.vercel.app";

type SEOProps = { title: string; description: string; path?: string; noIndex?: boolean; structuredData?: Record<string, unknown> };

function setMeta(name: string, content: string, attribute = "name") {
  let element = document.head.querySelector(`meta[${attribute}="${name}"]`);
  if (!element) { element = document.createElement("meta"); element.setAttribute(attribute, name); document.head.appendChild(element); }
  element.setAttribute("content", content);
}

export default function SEO({ title, description, path = "/", noIndex = false, structuredData }: SEOProps) {
  useEffect(() => {
    const canonical = `${SITE_URL}${path === "/" ? "/" : path}`;
    document.title = `${title} | 10X Shop`;
    setMeta("description", description);
    setMeta("robots", noIndex ? "noindex, nofollow" : "index, follow");
    setMeta("og:title", `${title} | 10X Shop`, "property");
    setMeta("og:description", description, "property");
    setMeta("og:type", "website", "property");
    setMeta("og:url", canonical, "property");
    setMeta("twitter:card", "summary");
    setMeta("twitter:title", `${title} | 10X Shop`);
    setMeta("twitter:description", description);
    let link = document.head.querySelector<HTMLLinkElement>("link[rel=canonical]");
    if (!link) { link = document.createElement("link"); link.rel = "canonical"; document.head.appendChild(link); }
    link.href = canonical;
    document.getElementById("seo-structured-data")?.remove();
    if (structuredData) {
      const script = document.createElement("script");
      script.id = "seo-structured-data"; script.type = "application/ld+json"; script.textContent = JSON.stringify(structuredData); document.head.appendChild(script);
    }
    return () => document.getElementById("seo-structured-data")?.remove();
  }, [description, noIndex, path, structuredData, title]);
  return null;
}
