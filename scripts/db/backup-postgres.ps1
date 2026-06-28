param(
  [string]$ContainerName = "apexbiz-postgres-prod",
  [string]$DatabaseName = "apexbiz_db",
  [string]$DatabaseUser = "apexbiz_user",
  [string]$BackupDir = "backups"
)

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
New-Item -ItemType Directory -Force $BackupDir | Out-Null

$backupFile = Join-Path $BackupDir "apexbiz-db-$timestamp.sql"

Write-Host "Creating PostgreSQL backup..."
Write-Host "Container: $ContainerName"
Write-Host "Database: $DatabaseName"
Write-Host "Output: $backupFile"

docker exec $ContainerName pg_dump -U $DatabaseUser $DatabaseName | Set-Content -Path $backupFile

Write-Host "Backup completed: $backupFile"
