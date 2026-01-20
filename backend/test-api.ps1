$baseUrl = "http://localhost:3000"
$sessionFile = "session.json"

Write-Host "🚀 Starting API Tests (PowerShell)..." -ForegroundColor Cyan

# 1. Login
Write-Host "1. Testing Login (Admin)..."
$loginBody = @{
    email = "admin@company.com"
    password = "admin123"
} | ConvertTo-Json

$loginResponse = Invoke-WebRequest -Uri "$baseUrl/auth/login" -Method Post -Body $loginBody -ContentType "application/json" -SessionVariable sess
$loginResponse.Content | ConvertFrom-Json | ConvertTo-Json
Write-Host ""

# 2. Auth Me
Write-Host "2. Testing /auth/me..."
$meResponse = Invoke-RestMethod -Uri "$baseUrl/auth/me" -WebSession $sess
$meResponse | ConvertTo-Json
Write-Host ""

# 3. Get Projects
Write-Host "3. Testing GET /projects..."
$projectsResponse = Invoke-RestMethod -Uri "$baseUrl/projects" -WebSession $sess
$projectsResponse | ConvertTo-Json
Write-Host ""

# 4. Create Check-in
Write-Host "4. Testing POST /check-ins..."
$checkinBody = @{
    status = "in_office"
    intent = "Completing the core backend infrastructure (PS Test)"
    isBlocked = $false
} | ConvertTo-Json

$checkinResponse = Invoke-RestMethod -Uri "$baseUrl/check-ins" -Method Post -Body $checkinBody -ContentType "application/json" -WebSession $sess
$checkinResponse | ConvertTo-Json
Write-Host ""

# 5. Get Dashboard Presence
Write-Host "5. Testing GET /dashboard/presence..."
$presenceResponse = Invoke-RestMethod -Uri "$baseUrl/dashboard/presence" -WebSession $sess
$presenceResponse | ConvertTo-Json
Write-Host ""

# 6. Get Dashboard Blockers
Write-Host "6. Testing GET /dashboard/blockers..."
$blockersResponse = Invoke-RestMethod -Uri "$baseUrl/dashboard/blockers" -WebSession $sess
$blockersResponse | ConvertTo-Json
Write-Host ""

Write-Host "✅ Tests Completed!" -ForegroundColor Green
