import { execSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";
import tailwindcss from "@tailwindcss/vite";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function gitInfo() {
  try {
    const sha = execSync("git rev-parse --short HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    const count = execSync("git rev-list --count HEAD", { stdio: ["ignore", "pipe", "ignore"] }).toString().trim();
    return { sha, count };
  } catch {
    return { sha: "dev", count: "0" };
  }
}

const { sha, count } = gitInfo();
const buildDate = new Date().toISOString().slice(0, 10);

export default defineConfig({
  base: "/D-D-Isekai-Personality-Test/",
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
  define: {
    __APP_VERSION__: JSON.stringify(`r${count}.${sha}`),
    __BUILD_DATE__: JSON.stringify(buildDate),
  },
});
