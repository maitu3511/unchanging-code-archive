// Builds a fully static site for Hostinger/Apache: output lands in ./dist (upload its contents to public_html).
import { execSync } from "node:child_process";
import { rmSync, cpSync, existsSync } from "node:fs";
rmSync("dist", { recursive: true, force: true });
rmSync(".static-tmp", { recursive: true, force: true });
execSync("vite build", { stdio: "inherit", env: { ...process.env, STATIC_BUILD: "true" } });
if (!existsSync("dist/client/index.html")) throw new Error("Static build failed: no index.html");
cpSync("dist/client", ".static-tmp", { recursive: true });
rmSync("dist", { recursive: true, force: true });
cpSync(".static-tmp", "dist", { recursive: true });
rmSync(".static-tmp", { recursive: true, force: true });
rmSync("dist/_redirects", { force: true });
console.log("\nStatic site ready in ./dist — upload its CONTENTS to public_html.");
