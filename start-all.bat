@echo off
chcp 65001 >nul
cd /d %~dp0
where node >nul 2>nul
if errorlevel 1 (
  echo [ERROR] Node.js not found. Please install Node.js from https://nodejs.org
  pause
  exit /b 1
)
echo ============================================
echo   BookShop - one-click start script
echo ============================================
echo.
echo [0/4] Init database (book_db)...
pushd "book-server"
if not exist node_modules (
  echo       Installing backend dependencies...
  call npm install --no-audit --no-fund
)
node scripts/db-init.js
popd
echo.
echo [1/4] Backend dependencies OK
echo [2/4] Check frontend dependencies...
if not exist "book-front\node_modules" (
  echo       Installing frontend dependencies, please wait...
  pushd "book-front"
  call npm install --no-audit --no-fund
  popd
) else (
  echo       OK
)
if not exist "book-front\dist" (
  echo       Building frontend production version...
  pushd "book-front"
  call npm run build
  popd
)
echo.
echo [3/4] Starting backend service (port 3000)...
start "BookShop-Backend" cmd /k "cd /d %~dp0book-server && npm start"
timeout /t 2 /nobreak >nul
echo [4/4] Starting frontend service (port 8080)...
start "BookShop-Frontend" cmd /k "cd /d %~dp0book-front && node serve.js"
echo.
echo ============================================
echo  All services started.
echo  Website:  http://localhost:8080
echo  API:      http://localhost:3000
echo  Account:  admin / 123456
echo ============================================
echo.
pause