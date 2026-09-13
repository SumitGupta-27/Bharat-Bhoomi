import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
<<<<<<< HEAD
    proxy: {
      // Forward every /api/* request to the Express backend
=======
    port: 5173,
    proxy: {
>>>>>>> 49b8a611da7d2ac4ba1421d1b6ea71a7a4f30b2d
      "/api": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },
});
