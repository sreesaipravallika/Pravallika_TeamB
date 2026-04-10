# Download H2 Database
$h2Version = "2.2.224"
$h2Url = "https://github.com/h2database/h2database/releases/download/version-$h2Version/h2-2023-09-17.zip"
$zipFile = "h2.zip"
$h2Dir = "h2"

Write-Host "Downloading H2 Database version $h2Version..." -ForegroundColor Green

try {
    # Download H2
    Invoke-WebRequest -Uri $h2Url -OutFile $zipFile
    Write-Host "Download complete!" -ForegroundColor Green
    
    # Extract
    Write-Host "Extracting..." -ForegroundColor Green
    Expand-Archive -Path $zipFile -DestinationPath "." -Force
    
    # Clean up
    Remove-Item $zipFile
    
    Write-Host "H2 Database installed successfully!" -ForegroundColor Green
    Write-Host "H2 JAR location: $h2Dir\bin\h2*.jar" -ForegroundColor Cyan
} catch {
    Write-Host "Error: $_" -ForegroundColor Red
    Write-Host "`nAlternative: Download manually from https://www.h2database.com/html/download.html" -ForegroundColor Yellow
}
