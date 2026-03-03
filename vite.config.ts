import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "node:path";
import tailwindcss from "@tailwindcss/vite";
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 3000,
  },
  resolve: {
    dedupe: ["react", "react-dom"],
    alias: {
      "@assets": path.resolve(__dirname, "src/assets"),
      "@assets/images": path.resolve(__dirname, "src/assets/images"),
      "@layouts": path.resolve(__dirname, "src/layouts/layouts.ts"),
      "@modules": path.resolve(__dirname, "src/modules/modules.ts"),
      "@components": path.resolve(__dirname, "src/components/components.ts"),
      "@constants": path.resolve(__dirname, "src/constants/constants.ts"),
      "@types": path.resolve(__dirname, "src/types/types.ts"),
      "@utils": path.resolve(__dirname, "src/utils/utils.ts"),
      "@services": path.resolve(__dirname, "src/services/services.ts"),
      "@apis": path.resolve(__dirname, "src/apis/apis.ts"),
      "@validations": path.resolve(__dirname, "src/validations/validations.ts"),
      "@providers": path.resolve(__dirname, "src/providers/providers.ts"),
      //   "@types": path.resolve(__dirname, "src/types/types.ts"),
      //   "@hooks": path.resolve(__dirname, "src/hooks/hooks.ts"),
      //   "@utils": path.resolve(__dirname, "src/utils/utils.ts"),
      "@styles": path.resolve(__dirname, "src/styles/styles.ts"),
    },
  },
});
