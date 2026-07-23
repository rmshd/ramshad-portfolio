param([string]$Source = ".\incoming-media")
$ErrorActionPreference = "Stop"

# Static site media only. Portfolio works are uploaded later through /admin to Supabase.
$map = @{
  "ramshad portfolio.png" = "public\assets\images\branding\ramshad-portfolio.png"
  "profile.png" = "public\assets\images\profile\profile.png"
  "graphic design.png" = "public\assets\images\services\graphic design.png"
  "Motion Graphics.png" = "public\assets\images\services\Motion Graphics.png"
  "3d.png" = "public\assets\images\services\3d.png"
  "AI Visuals.png" = "public\assets\images\services\AI Visuals.png"
  "Video Editing.png" = "public\assets\images\services\Video Editing.png"
  "Brand Identity.png" = "public\assets\images\services\Brand Identity.png"
}

foreach ($name in $map.Keys) {
  $from = Join-Path $Source $name
  $to = Join-Path $PSScriptRoot $map[$name]
  if (Test-Path $from) {
    New-Item -ItemType Directory -Force -Path (Split-Path $to) | Out-Null
    Copy-Item -Force $from $to
    Write-Host "Copied: $name -> $($map[$name])" -ForegroundColor Green
  } else {
    Write-Warning "Missing: $from"
  }
}

Write-Host ""
Write-Host "Static media organization finished." -ForegroundColor Cyan
Write-Host "Portfolio images/videos must be uploaded from /admin after deployment." -ForegroundColor Cyan
