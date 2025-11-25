#!/usr/bin/env pwsh
<#
.SYNOPSIS
    Assistive Platform - Setup and Run Script for Windows
.DESCRIPTION
    This script sets up and runs both frontend and backend servers.
.EXAMPLE
    .\setup.ps1 -mode setup   # First time setup
    .\setup.ps1 -mode run     # Run both servers
    .\setup.ps1 -mode frontend # Run only frontend
    .\setup.ps1 -mode backend  # Run only backend
#>

param(
    [ValidateSet("setup", "run", "frontend", "backend")]
    [string]$mode = "run"
)

function Setup-Frontend {
    Write-Host "📦 Setting up Frontend..." -ForegroundColor Cyan
    Set-Location "frontend"
    npm install
    Set-Location ".."
    Write-Host "✅ Frontend ready" -ForegroundColor Green
}

function Setup-Backend {
    Write-Host "📦 Setting up Backend..." -ForegroundColor Cyan
    Set-Location "backend"
    python -m venv venv
    .\venv\Scripts\Activate.ps1
    pip install -r requirements.txt
    Set-Location ".."
    Write-Host "✅ Backend ready" -ForegroundColor Green
}

function Run-Frontend {
    Write-Host "🚀 Starting Frontend (http://localhost:5173)..." -ForegroundColor Cyan
    Set-Location "frontend"
    npm run dev
}

function Run-Backend {
    Write-Host "🚀 Starting Backend (http://localhost:5000)..." -ForegroundColor Cyan
    Set-Location "backend"
    .\venv\Scripts\Activate.ps1
    python app.py
}

# Main logic
switch ($mode) {
    "setup" {
        Write-Host "🛠️  Setting up Assistive Platform..." -ForegroundColor Yellow
        Setup-Frontend
        Setup-Backend
        Write-Host "`n✅ Setup complete! Run '.\setup.ps1 -mode run' to start both servers" -ForegroundColor Green
    }
    "run" {
        Write-Host "⚠️  Note: This will run frontend. Open another terminal for backend!" -ForegroundColor Yellow
        Write-Host "    Terminal 1: .\setup.ps1 -mode run" -ForegroundColor Gray
        Write-Host "    Terminal 2: .\setup.ps1 -mode backend" -ForegroundColor Gray
        Run-Frontend
    }
    "frontend" {
        Run-Frontend
    }
    "backend" {
        Run-Backend
    }
}
