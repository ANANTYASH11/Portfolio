import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    {
      name: "api-dev-server",
      configureServer(server) {
        server.middlewares.use(async (req: any, res: any, next: any) => {
          const url: string = req?.url || "";
          if (!res.status) {
            res.status = function (code: number) {
              this.statusCode = code;
              return this;
            };
          }
          if (!res.json) {
            res.json = function (data: any) {
              this.setHeader("Content-Type", "application/json");
              return this.end(JSON.stringify(data));
            };
          }

          if (url.startsWith("/api/github")) {
            try {
              const { default: handler } = await server.ssrLoadModule("/api/github.js");
              return await handler(req, res);
            } catch (err) {
              if (typeof globalThis !== "undefined" && (globalThis as any).console) {
                (globalThis as any).console.error("[dev-api] /api/github error:", err);
              }
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              return res.end(JSON.stringify({ source: "snapshot", error: "Internal dev server error" }));
            }
          }
          if (url.startsWith("/api/leetcode")) {
            try {
              const { default: handler } = await server.ssrLoadModule("/api/leetcode.js");
              return await handler(req, res);
            } catch (err) {
              if (typeof globalThis !== "undefined" && (globalThis as any).console) {
                (globalThis as any).console.error("[dev-api] /api/leetcode error:", err);
              }
              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");
              return res.end(JSON.stringify({ source: "snapshot", error: "Internal dev server error" }));
            }
          }
          next();
        });
      },
    },
  ],
});
