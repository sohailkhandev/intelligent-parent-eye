import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import { Readable } from "node:stream";
import tailwindcss from "@tailwindcss/vite";

/** Dev-only: proxy any HTTPS image URL to avoid CORS (S3 staging, user-products, etc.). */
function imageProxyPlugin() {
  return {
    name: "image-proxy",
    configureServer(server: { middlewares: { use: (fn: (req: any, res: any, next: () => void) => void) => void } }) {
      server.middlewares.use((req: any, res: any, next: () => void) => {
        const u = req.url;
        if (req.method !== "GET" || !u?.startsWith("/image-proxy?")) {
          next();
          return;
        }
        try {
          const q = new URL(u, "http://localhost").searchParams;
          const target = q.get("url");
          if (!target || !target.startsWith("https://")) {
            res.writeHead(400, { "Content-Type": "text/plain" });
            res.end("Bad image-proxy request");
            return;
          }
          fetch(target, { headers: { Accept: "image/*,*/*" } })
            .then((r) => {
              if (!r.ok) {
                res.writeHead(r.status, { "Content-Type": "text/plain" });
                res.end(`Upstream ${r.status}`);
                return;
              }
              const ct = r.headers.get("Content-Type") || "application/octet-stream";
              res.writeHead(200, { "Content-Type": ct });
              const body = r.body;
              if (body) Readable.fromWeb(body as import("stream/web").ReadableStream).pipe(res);
            })
            .catch(() => {
              res.writeHead(502, { "Content-Type": "text/plain" });
              res.end("Image proxy fetch failed");
            });
        } catch {
          res.writeHead(400, { "Content-Type": "text/plain" });
          res.end("Bad image-proxy request");
        }
      });
    },
  };
}

export default defineConfig({
  optimizeDeps: {
    include: [
      "react-is",
      "prop-types",
      "@mui/material",
      "@mui/icons-material",
      "@emotion/react",
      "@emotion/styled",
    ],
  },
  plugins: [react(), tailwindcss(), imageProxyPlugin()],
  server: {
    port: 3000,
    proxy: {
      "/s3-proxy": {
        target: "https://user-products.s3.us-east-2.amazonaws.com",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/s3-proxy/, ""),
        secure: true,
      },
    },
  },
  resolve: {
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@layouts": path.resolve(__dirname, "src/layouts/layouts.ts"),
      "@modules": path.resolve(__dirname, "src/modules/modules.ts"),
      "@components": path.resolve(__dirname, "src/components/components.ts"),
      "@constants": path.resolve(__dirname, "src/constants/constants.ts"),
      "@validations": path.resolve(__dirname, "src/validations/validations.ts"),
      "@apis": path.resolve(__dirname, "src/apis/apis.ts"),
      "@services": path.resolve(__dirname, "src/services/services.ts"),
      "@types": path.resolve(__dirname, "src/types/types.ts"),
      "@hooks": path.resolve(__dirname, "src/hooks/hooks.ts"),
      "@utils": path.resolve(__dirname, "src/utils/utils.ts"),
      "@styles": path.resolve(__dirname, "src/styles/styles.ts"),
      "@providers": path.resolve(__dirname, "src/providers/providers.ts"),
    },
  },
});
