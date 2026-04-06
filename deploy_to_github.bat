@echo off
echo Deploying payment fixes and thank you page...
git add .
git commit -m "Fix payment redirects, add thanks.html, and implement native card fields"
git push origin main
echo DONE! Please refresh your website in 1 minute.
pause
