@echo off
echo Deploying changes to GitHub...
git add .
git commit -m "Update payment methods: Add Payeer, Binance and Black Credit Card styles"
git push origin main
echo Done! Please check your website.
pause
