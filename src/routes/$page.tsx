import { createFileRoute, notFound } from "@tanstack/react-router";
import SiteApp from "../SiteApp";
import {
  PAGE_SEO_CONFIG,
  ABOUT_PAGE_SCHEMA,
  PORTFOLIO_ITEM_LIST_SCHEMA,
  PRICING_CATALOG_SCHEMA,
  PROCESS_HOWTO_SCHEMA,
  TRAINING_COURSE_SCHEMA,
  CAREERS_SCHEMA,
  BLOG_SCHEMA,
  CONTACT_PAGE_SCHEMA,
  AREAS_SERVED_SCHEMA,
  FAQ_SCHEMA,
  getBreadcrumbSchema,
} from "../data/seoData";
import type { PageType } from "../types";

const contentPages = new Set([
  "about",
  "portfolio",
  "pricing",
  "process",
  "training",
  "careers",
  "blog",
  "contact",
  "areas-we-serve",
  "terms",
  "privacy",
]);

function getPageSchema(page: PageType): object[] {
  const schemas: object[] = [];
  switch (page) {
    case "about":
      schemas.push(ABOUT_PAGE_SCHEMA);
      break;
    case "portfolio":
      schemas.push(PORTFOLIO_ITEM_LIST_SCHEMA, FAQ_SCHEMA);
      break;
    case "pricing":
      schemas.push(PRICING_CATALOG_SCHEMA, FAQ_SCHEMA);
      break;
    case "process":
      schemas.push(PROCESS_HOWTO_SCHEMA);
      break;
    case "training":
      schemas.push(TRAINING_COURSE_SCHEMA);
      break;
    case "careers":
      schemas.push(CAREERS_SCHEMA);
      break;
    case "blog":
      schemas.push(BLOG_SCHEMA);
      break;
    case "contact":
      schemas.push(CONTACT_PAGE_SCHEMA, FAQ_SCHEMA);
      break;
    case "areas-we-serve":
      schemas.push(AREAS_SERVED_SCHEMA);
      break;
    default:
      break;
  }
  return schemas;
}

export const Route = createFileRoute("/$page")({
  loader: ({ params }) => {
    if (!contentPages.has(params.page)) throw notFound();
    return { page: params.page as PageType };
  },
  head: ({ loaderData }) => {
    const page = loaderData?.page;
    if (!page) return {};
    const seo = PAGE_SEO_CONFIG[page];
    const pageTitle = page.charAt(0).toUpperCase() + page.slice(1);
    const pageSchemas = getPageSchema(page);

    const scripts = [
      {
        type: "application/ld+json",
        children: JSON.stringify(getBreadcrumbSchema(pageTitle, seo.canonical)),
      },
      ...pageSchemas.map((schema) => ({
        type: "application/ld+json",
        children: JSON.stringify(schema),
      })),
    ];

    return {
      meta: [
        { title: seo.title },
        { name: "description", content: seo.description },
        { name: "keywords", content: seo.keywords },
        { property: "og:title", content: seo.title },
        { property: "og:description", content: seo.description },
        { property: "og:type", content: "website" },
        { property: "og:url", content: seo.canonical },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: seo.title },
        { name: "twitter:description", content: seo.description },
      ],
      links: [{ rel: "canonical", href: seo.canonical }],
      scripts,
    };
  },
  component: ContentRoute,
});

function ContentRoute() {
  const { page } = Route.useLoaderData();
  return <SiteApp initialPage={page} />;
}
