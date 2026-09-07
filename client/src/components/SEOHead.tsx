/**
 * SEO Head Component
 * Manages meta tags, Open Graph, and structured data for each page
 */

import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: "website" | "article" | "product";
  structuredData?: Record<string, any>;
}

export function useSEO({
  title,
  description,
  image = "https://horologygal-es99fpfz.manus.space/og-image.png",
  url = typeof window !== "undefined" ? window.location.href : "",
  type = "website",
  structuredData,
}: SEOProps) {
  useEffect(() => {
    // Update page title
    document.title = `${title} | Sheikh Ammar Horology Gallery`;

    // Update meta tags
    const updateMeta = (name: string, content: string) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    const updateProperty = (property: string, content: string) => {
      let meta = document.querySelector(`meta[property="${property}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("property", property);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    };

    // Standard meta tags
    updateMeta("description", description);
    updateMeta("viewport", "width=device-width, initial-scale=1.0");
    // Browser theme metadata cannot consume CSS variables; this is the canonical deep-olive secondary token.
    updateMeta("theme-color", "#2d4236");

    // Open Graph tags
    updateProperty("og:title", title);
    updateProperty("og:description", description);
    updateProperty("og:image", image);
    updateProperty("og:url", url);
    updateProperty("og:type", type);
    updateProperty("og:site_name", "Sheikh Ammar Horology Gallery");

    // Twitter Card tags
    updateMeta("twitter:card", "summary_large_image");
    updateMeta("twitter:title", title);
    updateMeta("twitter:description", description);
    updateMeta("twitter:image", image);

    // Structured data (JSON-LD)
    if (structuredData) {
      let script = document.querySelector('script[type="application/ld+json"]');
      if (!script) {
        script = document.createElement("script");
        script.setAttribute("type", "application/ld+json");
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(structuredData);
    }

    // Canonical URL
    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", url);
  }, [title, description, image, url, type, structuredData]);
}

/**
 * SEO helpers for generating structured data
 */

export const SEOStructuredData = {
  // Organization schema
  organization: {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sheikh Ammar Horology Gallery",
    description:
      "A world-class digital gallery showcasing the extraordinary watch collection of His Highness Sheikh Ammar bin Humaid Al Nuaimi",
    url: "https://horologygal-es99fpfz.manus.space",
    logo: "https://horologygal-es99fpfz.manus.space/logo.png",
    sameAs: [
      "https://www.instagram.com/sheikhammarnuaimi",
      "https://twitter.com/sheikhammarnuaimi",
    ],
  },

  // Gallery-record schema for watches. This archive does not present watches for sale.
  product: (watch: {
    brand: string;
    model: string;
    image?: string;
    description?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${watch.brand} ${watch.model}`,
    description: watch.description || `Luxury timepiece from ${watch.brand}`,
    image: watch.image,
    brand: {
      "@type": "Brand",
      name: watch.brand,
    },
  }),

  // Collection schema
  collection: {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Watch Collection",
    description: "Complete collection of luxury timepieces",
    url: "https://horologygal-es99fpfz.manus.space/collection",
  },

  // Article schema for stories
  article: (article: {
    title: string;
    description: string;
    image?: string;
    datePublished?: string;
  }) => ({
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.description,
    image: article.image,
    datePublished: article.datePublished || new Date().toISOString(),
    author: {
      "@type": "Person",
      name: "Sheikh Ammar bin Humaid Al Nuaimi",
    },
  }),

  // Breadcrumb schema
  breadcrumb: (items: { name: string; url: string }[]) => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  }),
};

/**
 * Page-specific SEO configurations
 */

export const pageSEOConfig = {
  home: {
    title: "Royal Horology Collection",
    description:
      "Explore the extraordinary watch collection of His Highness Sheikh Ammar bin Humaid Al Nuaimi. Featuring rare timepieces from the world's finest watchmakers.",
    type: "website" as const,
  },

  collection: {
    title: "Complete Watch Collection",
    description:
      "Browse our complete collection of 30+ luxury timepieces including Richard Mille, Patek Philippe, Rolex, and other prestigious brands.",
    type: "website" as const,
  },

  about: {
    title: "About Sheikh Ammar",
    description:
      "Learn about His Highness Sheikh Ammar bin Humaid Al Nuaimi and his passion for horology and rare timepieces.",
    type: "article" as const,
  },

  stories: {
    title: "Horology Stories",
    description:
      "Discover fascinating stories behind the most exceptional watches in the collection.",
    type: "article" as const,
  },

  sheikhGallery: {
    title: "Sheikh Gallery",
    description:
      "Exclusive photos of His Highness Sheikh Ammar with premium timepieces and distinguished guests.",
    type: "website" as const,
  },

  compare: {
    title: "Compare Watches",
    description:
      "Compare specifications, features, and details of watches in the collection side by side.",
    type: "website" as const,
  },

  timeline: {
    title: "Horology Timeline",
    description:
      "Explore the history and evolution of watchmaking through our curated timeline.",
    type: "article" as const,
  },

  advancedSearch: {
    title: "Advanced Watch Search",
    description:
      "Search and filter archive records by maison, reference, movement type, case material, and more.",
    type: "website" as const,
  },

  virtualTour: {
    title: "Virtual Tour",
    description:
      "Take a virtual tour of the Sheikh Ammar Horology Gallery and explore the collection in 3D.",
    type: "website" as const,
  },
};
