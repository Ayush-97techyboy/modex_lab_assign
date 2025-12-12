#!/usr/bin/env pwsh
# Quick Start Script for Modex Lab Assign
# Run this in PowerShell to set up everything

Write-Host "==================================" -ForegroundColor Cyan
Write-Host "Modex Lab Assign - Quick Setup" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# Step 1: Install dependencies
Write-Host "`n[1/4] Installing root dependencies..." -ForegroundColor Yellow
npm install

Write-Host "`n[2/4] Installing server dependencies..." -ForegroundColor Yellow
npm --prefix server install

Write-Host "`n[3/4] Installing client dependencies..." -ForegroundColor Yellow
npm --prefix client install

Write-Host "`n[4/4] Setup Complete!" -ForegroundColor Green
Write-Host "`n==================================" -ForegroundColor Cyan
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan
Write-Host @"

Open TWO PowerShell terminals:

TERMINAL 1 (Server):
  cd d:\React\modex_lab_assign\server
  node index.js
  # Wait for: "Server listening on port 4000"

TERMINAL 2 (Client):
  cd d:\React\modex_lab_assign\client
  npm run dev
  # Wait for: "Local: http://localhost:5173/"

Then open your browser to:
  http://localhost:5173/

📊 Admin Dashboard: Toggle button in top-right
🚀 Load Test: In server directory, run: node load-test.js

Full docs: See README.md
Submission info: See SUBMISSION.md
"@ -ForegroundColor Green

Write-Host "`n✅ Ready to go!" -ForegroundColor Green
