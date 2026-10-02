import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

export const getRouter = () => {
  const queryClient = new QueryClient();

  const router = createRouter({
    routeTree,
    context: { queryClient },
    scrollRestoration: true,
    defaultPreloadStaleTime: 0,
    // Keep trailing-slash URLs rendering instead of 307-redirecting to the
    // canonical path; the static prerenderer requests routes with a slash
    // and cannot follow redirects.
    trailingSlash: "preserve",
  });

  return router;
};
