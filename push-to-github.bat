@echo off
echo ============================================
echo  Pushing Calendar App to GitHub
echo ============================================
echo.
echo Repository: Claude-Calendar-app-vs
echo URL: https://github.com/hariprasad-sonti/Claude-Calendar-app-vs
echo.
echo IMPORTANT: Create the repository on GitHub first!
echo 1. Go to: https://github.com/new
echo 2. Name: Claude-Calendar-app-vs
echo 3. Visibility: Public
echo 4. Do NOT initialize with README
echo 5. Click "Create repository"
echo.
pause
echo.
echo Now pushing to GitHub...
echo You may be prompted for authentication.
echo.
git push -u origin main
echo.
echo ============================================
echo  Push Complete!
echo ============================================
echo.
echo View your repository at:
echo https://github.com/hariprasad-sonti/Claude-Calendar-app-vs
echo.
pause
