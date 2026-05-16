$ErrorActionPreference = "Stop"

$port = 3100
$hostName = "127.0.0.1"
$baseUrl = "http://${hostName}:${port}"
$workspace = (Resolve-Path "$PSScriptRoot\..").Path

Set-Location $workspace

corepack pnpm build
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

$serverJob = Start-Job -Name "next-e2e-server" -ScriptBlock {
  param(
    [string] $workspace,
    [int] $port,
    [string] $hostName
  )

  Set-Location $workspace
  corepack pnpm exec next start --hostname $hostName --port $port
} -ArgumentList $workspace, $port, $hostName

try {
  $deadline = (Get-Date).AddSeconds(60)

  do {
    if ($serverJob.State -eq "Failed") {
      Receive-Job $serverJob
      throw "Next.js e2e server failed to start."
    }

    try {
      $response = Invoke-WebRequest -UseBasicParsing -Uri $baseUrl -TimeoutSec 2

      if ($response.StatusCode -eq 200) {
        break
      }
    } catch {
      Start-Sleep -Milliseconds 500
    }
  } while ((Get-Date) -lt $deadline)

  if ((Get-Date) -ge $deadline) {
    Receive-Job $serverJob
    throw "Next.js e2e server did not become ready at $baseUrl."
  }

  corepack pnpm exec playwright test
  $testExitCode = $LASTEXITCODE
} finally {
  Stop-Job $serverJob -ErrorAction SilentlyContinue
  Remove-Job $serverJob -Force -ErrorAction SilentlyContinue
}

exit $testExitCode
