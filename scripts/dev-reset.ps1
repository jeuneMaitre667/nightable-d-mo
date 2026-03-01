param(
  [switch]$NoStart,
  [int[]]$Ports = @(3000, 3001),
  [string]$LockPath = ".next/dev/lock"
)

$ErrorActionPreference = "SilentlyContinue"

$listeners = Get-NetTCPConnection -State Listen | Where-Object { $_.LocalPort -in $Ports }
$processIds = $listeners | Select-Object -ExpandProperty OwningProcess -Unique

foreach ($processId in $processIds) {
  Stop-Process -Id $processId -Force
}

if (Test-Path $LockPath) {
  try {
    Remove-Item $LockPath -Force
  }
  catch {
    Write-Output "Lock file already cleared or unavailable."
  }
}

if ($processIds) {
  Write-Output ("Stopped dev process ids: " + ($processIds -join ", "))
} else {
  Write-Output "No dev process found on target ports."
}

Write-Output "Dev environment reset complete."

if (-not $NoStart) {
  npm run dev
} else {
  Write-Output "Skip start enabled. Run 'npm run dev' when ready."
}
