import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // run the vite server on host: app.local and port 80
  server: {
    host: "app.local",
    port: 80
  }
});
