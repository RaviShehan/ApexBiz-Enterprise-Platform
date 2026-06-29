param(
  [string]$FrontendUrl = "http://localhost",
  [string]$BackendUrl = "http://localhost/api",
  [string]$MlServiceUrl = "http://localhost/ml"
)

function Test-Endpoint {
  param(
    [string]$Name,
    [string]$Url
  )

  Write-Host "Checking $Name: $Url"

  try {
    $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 10

    if ($response.StatusCode -ge 200 -and $response.StatusCode -lt 400) {
      Write-Host "PASS: $Name returned $($response.StatusCode)" -ForegroundColor Green
      return $true
    }

    Write-Host "FAIL: $Name returned $($response.StatusCode)" -ForegroundColor Red
    return $false
  } catch {
    Write-Host "FAIL: $Name is not reachable. $($_.Exception.Message)" -ForegroundColor Red
    return $false
  }
}

$results = @()

$results += Test-Endpoint -Name "Frontend" -Url $FrontendUrl
$results += Test-Endpoint -Name "Backend Health" -Url "$BackendUrl/health"
$results += Test-Endpoint -Name "Backend Liveness" -Url "$BackendUrl/health/liveness"
$results += Test-Endpoint -Name "Backend Readiness" -Url "$BackendUrl/health/readiness"
$results += Test-Endpoint -Name "Backend Metrics" -Url "$BackendUrl/metrics"
$results += Test-Endpoint -Name "Swagger API Docs" -Url "$BackendUrl/api-docs"
$results += Test-Endpoint -Name "ML Service Health" -Url "$MlServiceUrl/health"

$failed = $results | Where-Object { $_ -eq $false }

if ($failed.Count -gt 0) {
  Write-Host "Production verification failed." -ForegroundColor Red
  exit 1
}

Write-Host "Production verification passed." -ForegroundColor Green
exit 0
