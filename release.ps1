Write-Host "🔧 Building project..."
npm run build

Write-Host ""
Write-Host "📦 Choose version bump type:"
Write-Host "1) patch"
Write-Host "2) minor"
Write-Host "3) major"
Write-Host "4) exit"
$choice = Read-Host "Choose option"

switch ($choice) {
    "1" { npm version patch }
    "2" { npm version minor }
    "3" { npm version major }
    "4" { Write-Host "Cancelled."; exit }
    default { Write-Host "Invalid option."; exit }
}

Write-Host "🚀 Committing and pushing to GitHub..."
git push
git push --tags

Write-Host "📤 Publishing to NPM..."
npm publish --access public

Write-Host "[✓] Done!"
