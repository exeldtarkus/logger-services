#!/bin/bash

# Langkah 1: Build TypeScript
echo "🔧 Building project..."
npm run build

# Langkah 2: Pilih jenis rilis
echo ""
echo "📦 Choose version bump type:"
select VERSION in patch minor major exit; do
  case $VERSION in
    patch)
      npm version patch
      break;;
    minor)
      npm version minor
      break;;
    major)
      npm version major
      break;;
    exit)
      echo "❌ Cancelled."
      exit 1;;
    *)
      echo "Please select a valid option."
      ;;
  esac
done

# Langkah 3: Push ke GitHub
echo "🚀 Committing and pushing to GitHub..."
git push
git push --tags

# Langkah 4: Publish ke NPM
echo "📤 Publishing to NPM..."
npm publish --access public

echo "✅ Done!"
