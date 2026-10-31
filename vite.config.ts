import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
  plugins: [react()],
  // Vercel serves from the root; GitHub Pages serves from /portpolio/
  base: process.env.VERCEL ? '/' : '/portpolio/',
});
