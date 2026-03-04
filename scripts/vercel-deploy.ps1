param(
  [switch]$SkipChecks,
  [switch]$SkipDeploy,
  [switch]$ForceMain,
  [switch]$DryRun
)

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Write-Step([string]$Message) {
  Write-Host "`n=== $Message ===" -ForegroundColor Cyan
}

function Invoke-Step([string]$Message, [scriptblock]$Action) {
  Write-Step -Message $Message

  if ($DryRun) {
    Write-Host "[DRY-RUN] Étape simulée." -ForegroundColor Yellow
    return
  }

  & $Action
}

function Invoke-CommandChecked([string]$Command) {
  Write-Host "> $Command" -ForegroundColor DarkGray
  Invoke-Expression $Command
  if ($LASTEXITCODE -ne 0) {
    throw "Échec de la commande: $Command"
  }
}

Invoke-Step -Message "Validation dépôt Git" -Action {
  Invoke-CommandChecked "git rev-parse --is-inside-work-tree"
}

$currentBranch = (git branch --show-current).Trim()

if (-not $currentBranch) {
  throw "Impossible de déterminer la branche courante."
}

if ($currentBranch -ne 'main') {
  Invoke-Step -Message "Bascule de la branche '$currentBranch' vers 'main'" -Action {
    Invoke-CommandChecked "git branch -m $currentBranch main"
  }
}

Invoke-Step -Message "Récupération des refs distantes" -Action {
  Invoke-CommandChecked "git fetch origin"
}

$gitStatus = (git status --porcelain)
if ($gitStatus) {
  throw "Le dépôt contient des modifications non commit. Commit/push d'abord avant ce script."
}

if (-not $SkipChecks) {
  Invoke-Step -Message "Exécution lint" -Action {
    Invoke-CommandChecked "npm run lint"
  }

  Invoke-Step -Message "Exécution build" -Action {
    Invoke-CommandChecked "npm run build"
  }
}

Invoke-Step -Message "Push de la branche main" -Action {
  try {
    Invoke-CommandChecked "git push -u origin main"
  }
  catch {
    if (-not $ForceMain) {
      throw "Push main rejeté (historique divergent). Relancer avec -ForceMain pour utiliser --force-with-lease."
    }

    Write-Host "Push standard rejeté, tentative sécurisée en --force-with-lease..." -ForegroundColor Yellow
    Invoke-CommandChecked "git push -u origin main --force-with-lease"
  }
}

if (-not $SkipDeploy) {
  Invoke-Step -Message "Vérification CLI Vercel" -Action {
    Invoke-CommandChecked "npx vercel --version"
  }

  Invoke-Step -Message "Synchronisation config Vercel (production)" -Action {
    Invoke-CommandChecked "npx vercel pull --yes --environment=production"
  }

  Invoke-Step -Message "Déploiement Vercel en production" -Action {
    Invoke-CommandChecked "npx vercel deploy --prod --yes"
  }
}

Write-Host "`n✅ Publication terminée." -ForegroundColor Green
Write-Host "- Branche: main" -ForegroundColor Green
Write-Host "- Remote: origin/main" -ForegroundColor Green

if (-not $SkipDeploy) {
  Write-Host "- Déploiement Vercel prod déclenché" -ForegroundColor Green
}

Write-Host "`nSi le site reste privé: Vercel > Settings > Deployment Protection (désactiver pour Production)." -ForegroundColor Yellow
