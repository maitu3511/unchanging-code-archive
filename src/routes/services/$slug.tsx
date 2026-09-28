import { createFileRoute, notFound } from "@tanstack/react-router";
import SiteApp from "../../SiteApp";
import {
  getServiceRoute,
  getServiceCanonical,
  getServiceSchema,
  getServiceBreadcrumbSchema,
} from "../../data/serviceRoutes";

export const Route = createFileRoute("/services/$slug")({
  loader: ({ params }) => {
    const service = getServiceRoute(params.slug);
    if (!service) throw notFound();
    return { service };
  },
  head: ({ loaderData }) => {
    const service = loaderData?.service;
    if (!service) return {};
    const canonical = getServiceCanonical(service.slug);
    const serviceSchema = getServiceSchema(service);
    const breadcrumbSchema = getServiceBreadcrumbSchema(service);

    const scripts = [];
    if (serviceSchema) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(serviceSchema),
      });
    }
    if (breadcrumbSchema) {
      scripts.push({
        type: "application/ld+json",
        children: JSON.stringify(breadcrumbSchema),
      });
    }

    return {
      meta: [
        { title: service.title },
        { name: "description", content: service.description },
        { name: "keywords", content: service.keywords },
        { property: "og:type", content: "website" },
        { property: "og:title", content: service.title },
        { property: "og:description", content: service.description },
        { property: "og:url", content: canonical },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:title", content: service.title },
        { name: "twitter:description", content: service.description },
      ],
      links: [{ rel: "canonical", href: canonical }],
      scripts,
    };
  },
  component: ServiceRoute,
});

function ServiceRoute() {
  const { slug } = Route.useParams();
  return <SiteApp initialPage="services" initialCategorySlug={slug} serviceRouteSlug={slug} />;
}
