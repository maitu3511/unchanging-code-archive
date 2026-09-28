import { createFileRoute } from "@tanstack/react-router";
import SiteApp from "../SiteApp";
import revealAsset from "../assets/images/agency-cursor-reveal.jpg.asset.json";
import {
  SERVICES_SCHEMA,
  PORTFOLIO_ITEM_LIST_SCHEMA,
  FAQ_SCHEMA,
  getBreadcrumbSchema,
} from "../data/seoData";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      {
        title: "DigiBasera | Top Digital Marketing Agency & Web Development in Rajkot, Gujarat",
      },
      {
        name: "description",
        content:
          "DigiBasera is a premier digital marketing & web technology agency in Rajkot, Gujarat. SEO, Google Ads PPC, custom web design, e-commerce and social media marketing.",
      },
      {
        name: "keywords",
        content:
          "Digital Marketing Agency Rajkot, Best SEO Company Gujarat, Web Development Agency Rajkot, Social Media Marketing Gujarat, Google Ads PPC Management",
      },
      {
        property: "og:title",
        content: "DigiBasera | Premier Digital Marketing Agency & Custom Web Development",
      },
      {
        property: "og:description",
        content:
          "Commercial portfolio & live client showcase: live websites, high-converting social media creatives, and verified ROI case studies.",
      },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://digibasera.com/" },
      { name: "twitter:card", content: "summary_large_image" },
      {
        name: "twitter:title",
        content: "DigiBasera | Premier Digital Marketing & Web Agency",
      },
      {
        name: "twitter:description",
        content:
          "Explore live client websites, high-engagement social media campaigns, and verified SEO results from DigiBasera in Rajkot, Gujarat.",
      },
      { name: "geo.region", content: "IN-GJ" },
      { name: "geo.placename", content: "Rajkot, Gujarat, India" },
      { name: "geo.position", content: "22.3039;70.8022" },
    ],
    links: [
      { rel: "canonical", href: "https://digibasera.com/" },
      { rel: "preload", as: "image", href: `https://project--${revealAsset.project_id}.lovable.app${revealAsset.url}` },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: JSON.stringify(SERVICES_SCHEMA),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(PORTFOLIO_ITEM_LIST_SCHEMA),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(FAQ_SCHEMA),
      },
      {
        type: "application/ld+json",
        children: JSON.stringify(getBreadcrumbSchema("Home", "https://digibasera.com/")),
      },
    ],
  }),
  component: Index,
});

function Index() {
  return <SiteApp />;
}
