import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

module.exports= defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  server: {
    // host: '0.0.0.0',
    proxy: {
      "/api": {
        target: "http://localhost:8080",
        changeOrigin: true,
        secure: false,
      }
    },
    cors:false,
  }
  
})