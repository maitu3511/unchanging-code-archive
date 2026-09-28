<!-- LOVABLE:BEGIN -->

> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.

<!-- LOVABLE:END -->

- Portfolio samples are defined in `src/data/portfolioData.ts`; merge newly shipped sample IDs with stored items so existing admin changes remain intact while new work appears for returning visitors.
- Keep the home hero cursor-image reveal as a pointer-events-free layer above existing background effects and below content, so the original animations and buttons remain unchanged.
- Resolve the reveal image through its stable absolute CDN URL, because relative Lovable asset paths fail on third-party hosts.
- Keep website typography centralized in `src/app-site.css` with local Fonarto for main headings and Glacial Indifference for other text; avoid duplicate font-face definitions so every device loads the same families.

- Keep the imported DigiBasera website in its existing TanStack routes, SiteApp, and local styling/assets without redesign; this preserves the uploaded appearance and behavior.
