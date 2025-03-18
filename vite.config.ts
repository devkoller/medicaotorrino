import path from "path"
import react from "@vitejs/plugin-react"
import { defineConfig } from "vite"

export default defineConfig({
	plugins: [react()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
	build: {
		outDir: "./dist",
		emptyOutDir: true,
		rollupOptions: {
			output: {
				entryFileNames: "assets/index.js",
				assetFileNames: (assetInfo) => {
					if (assetInfo.name == "output.css") return "assets/index.css"
					return `assets/${assetInfo.name}`
				},
			},
		},
	},
})
