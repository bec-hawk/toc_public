#!/bin/bash

# Build the production version
echo "🔨 Building production version..."
npm run build

echo ""
echo "✅ Build complete!"
echo ""
echo "📦 Built files are in the dist/ folder"
echo ""
echo "To test in your browser:"
echo "1. Download the entire 'dist' folder from your file explorer"
echo "2. Open dist/index.html in your web browser"
echo ""
echo "All assets are bundled and ready to use!"
