# Admin API Verification Script
# Tests all admin endpoints to ensure they're working with Redis

$baseUrl = "http://localhost:3000"

Write-Host "=== Testing Admin API Endpoints ===" -ForegroundColor Cyan
Write-Host ""

# Test function
function Test-AdminEndpoint {
    param(
        [string]$Name,
        [string]$Endpoint
    )
    
    Write-Host "Testing $Name..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "$baseUrl$Endpoint" -Method GET -UseBasicParsing -ErrorAction Stop
        if ($response.StatusCode -eq 200) {
            $data = $response.Content | ConvertFrom-Json
            $count = if ($data -is [array]) { $data.Count } else { 1 }
            Write-Host " [OK] ($count items)" -ForegroundColor Green
            return $true
        }
    } catch {
        Write-Host " [FAILED]" -ForegroundColor Red
        Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
        return $false
    }
    return $false
}

# Test all endpoints
$results = @{
    "Programs" = Test-AdminEndpoint -Name "Programs API" -Endpoint "/api/admin/programs"
    "Research" = Test-AdminEndpoint -Name "Research API" -Endpoint "/api/admin/research"
    "Testimonials" = Test-AdminEndpoint -Name "Testimonials API" -Endpoint "/api/admin/testimonials"
    "Gallery" = Test-AdminEndpoint -Name "Gallery API" -Endpoint "/api/admin/gallery"
    "Careers" = Test-AdminEndpoint -Name "Careers API" -Endpoint "/api/admin/careers"
}

Write-Host ""
Write-Host "=== Testing Migration API ===" -ForegroundColor Cyan
Write-Host "Running migration..." -NoNewline
try {
    $response = Invoke-WebRequest -Uri "$baseUrl/api/admin/migrate" -Method POST -UseBasicParsing -ErrorAction Stop
    if ($response.StatusCode -eq 200) {
        $data = $response.Content | ConvertFrom-Json
        Write-Host " [OK]" -ForegroundColor Green
        Write-Host ""
        Write-Host "Migration Results:" -ForegroundColor Yellow
        Write-Host "  Programs: $($data.migrated.programs)"
        Write-Host "  Research: $($data.migrated.research)"
        Write-Host "  Testimonials: $($data.migrated.testimonials)"
        Write-Host "  Gallery: $($data.migrated.gallery)"
        Write-Host "  Careers: $($data.migrated.careers)"
        $results["Migration"] = $true
    }
} catch {
    Write-Host " [FAILED]" -ForegroundColor Red
    Write-Host "  Error: $($_.Exception.Message)" -ForegroundColor Red
    $results["Migration"] = $false
}

Write-Host ""
Write-Host "=== Summary ===" -ForegroundColor Cyan
$passed = ($results.Values | Where-Object { $_ -eq $true }).Count
$total = $results.Count
Write-Host "Passed: $passed/$total tests" -ForegroundColor $(if ($passed -eq $total) { "Green" } else { "Yellow" })

if ($passed -eq $total) {
    Write-Host ""
    Write-Host "All admin sections are working correctly with Redis!" -ForegroundColor Green
} else {
    Write-Host ""
    Write-Host "Some tests failed. Please check the errors above." -ForegroundColor Red
}
