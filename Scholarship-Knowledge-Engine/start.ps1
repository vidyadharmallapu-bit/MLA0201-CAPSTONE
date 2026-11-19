# Scholarship Knowledge Engine - Startup Script
Write-Host "================================" -ForegroundColor Cyan
Write-Host " Scholarship Knowledge Engine" -ForegroundColor Cyan
Write-Host "================================" -ForegroundColor Cyan

# Check Python
if (-not (Get-Command python -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Python not found. Please install Python 3.9+" -ForegroundColor Red
    exit 1
}

# Check Node
if (-not (Get-Command node -ErrorAction SilentlyContinue)) {
    Write-Host "ERROR: Node.js not found. Please install Node.js 18+" -ForegroundColor Red
    exit 1
}

# Install backend dependencies
Write-Host "`nInstalling backend dependencies..." -ForegroundColor Yellow
pip install -r backend\requirements.txt

# Install frontend dependencies
Write-Host "`nInstalling frontend dependencies..." -ForegroundColor Yellow
Set-Location frontend
npm install
Set-Location ..

# Run backend tests
Write-Host "`nRunning backend tests..." -ForegroundColor Yellow
Set-Location backend
python -m pytest ../tests/backend -v --tb=short
Set-Location ..

# Start backend in background
Write-Host "`nStarting backend on http://localhost:8000 ..." -ForegroundColor Green
Start-Process -FilePath "python" -ArgumentList "-m uvicorn app.main:app --reload --port 8000" -WorkingDirectory "backend" -WindowStyle Minimized

Start-Sleep -Seconds 2

# Start frontend
Write-Host "Starting frontend on http://localhost:5173 ..." -ForegroundColor Green
Write-Host "`nAccess the application at: http://localhost:5173" -ForegroundColor Cyan
Write-Host "API documentation at:       http://localhost:8000/docs" -ForegroundColor Cyan
Write-Host "`nPress Ctrl+C to stop the frontend." -ForegroundColor Gray
Set-Location frontend
npm run dev
