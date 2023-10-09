import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
// vite.config.js
import glsl from 'vite-plugin-glsl';


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), glsl()],
  assetsInclude:['**/*.JPG', '**/*.jpg', '**/*.png', '**/*.svg', '**/*.vert', '**/*.vs', '**/*.fs', '**/*.glb']
})
