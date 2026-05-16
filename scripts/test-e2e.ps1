$ErrorActionPreference = "Stop"

$port = 3100
$hostName = "127.0.0.1"
$baseUrl = "http://${hostName}:${port}"
$readyUrl = "${baseUrl}/sign-in"
$workspace = (Resolve-Path "$PSScriptRoot\..").Path
$nextBin = Join-Path $workspace "node_modules\.bin\next.cmd"

Set-Location $workspace

corepack pnpm build
if ($LASTEXITCODE -ne 0) {
  exit $LASTEXITCODE
}

$serverJob = Start-Job -Name "next-e2e-server" -ScriptBlock {
  param(
    [string] $workspace,
    [string] $nextBin,
    [int] $port,
    [string] $hostName
  )

  Set-Location $workspace
  & $nextBin start --hostname $hostName --port $port
} -ArgumentList $workspace, $nextBin, $port, $hostName

try {
  $deadline = (Get-Date).AddSeconds(60)

  do {
    if ($serverJob.State -eq "Failed") {
      Receive-Job $serverJob
      throw "Next.js e2e server failed to start."
    }

    try {
      $response = Invoke-WebRequest `
        -UseBasicParsing `
        -Uri $readyUrl `
        -TimeoutSec 2 `
        -MaximumRedirection 0

      if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
        break
      }
    } catch {
      Start-Sleep -Milliseconds 500
    }
  } while ((Get-Date) -lt $deadline)

  if ((Get-Date) -ge $deadline) {
    Receive-Job $serverJob
    throw "Next.js e2e server did not become ready at $readyUrl."
  }

  corepack pnpm exec playwright test
  $testExitCode = $LASTEXITCODE
} finally {
  Stop-Job $serverJob -ErrorAction SilentlyContinue
  Remove-Job $serverJob -Force -ErrorAction SilentlyContinue
}

exit $testExitCode
