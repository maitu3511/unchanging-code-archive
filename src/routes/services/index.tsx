import { createFileRoute } from "@tanstack/react-router";
import SiteApp from "../../SiteApp";
import { SERVICES_SCHEMA, getBreadcrumbSchema } from "../../data/seoData";

export const Route = createFileRoute("/services/")({
  head: () => ({
    meta: [
      { title: "Digital Marketing & Web Development Services in Rajkot | DigiBasera" },
      {
        name: "description",
        content:
          "Explore DigiBasera's SEO, digital marketing, Google Ads, web development, social media marketing and Shopify services for businesses in Rajkot, Gujarat and India.",
      },
      {
        name: "keywords",
        content:
          "digital marketing services Rajkot, SEO services Rajkot, web development Rajkot, Google Ads agency Rajkot, social media marketing Rajkot, Shopify development Rajkot",
      },
      {
        property: "og:title",
        content: "Digital Marketing & Web Development Services in Rajkot | DigiBasera",
      },
      {
        property: "og:description",
        content:
          "Explore DigiBasera's SEO, digital marketing, Google Ads, web development, social media marketing and Shopify services for businesses in Rajkot, Gujarat and India.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digibasera.com/services" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "Digital Marketing & Web Development Services in Rajkot | DigiBasera",
      },
      {
        name: "twitter:description",
        content:
          "Explore DigiBasera's SEO, digital marketing, Google Ads, web development, social media marketing and Shopify services in Rajkot, Gujarat.",
      },
    ],
    links: [{ rel: "canonical", href: "https://digibasera.com/services" }],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(SERVICES_SCHEMA),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(
          getBreadcrumbSchema("Services", "https://digibasera.com/services"),
        ),
      },
    ],
  }),
  component: ServicesIndexRoute,
});

function ServicesIndexRoute() {
  return <SiteApp initialPage="services" />;
}
