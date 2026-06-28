param(
  [Parameter(Mandatory=$true)]
  [string]$BackupFile,

  [string]$ContainerName = "apexbiz-postgres-prod",
  [string]$DatabaseName = "apexbiz_db",
  [string]$DatabaseUser = "apexbiz_user"
)

if (!(Test-Path $BackupFile)) {
  throw "Backup file not found: $BackupFile"
}

Write-Host "Restoring PostgreSQL backup..."
Write-Host "Container: $ContainerName"
Write-Host "Database: $DatabaseName"
Write-Host "Input: $BackupFile"

Get-Content $BackupFile | docker exec -i $ContainerName psql -U $DatabaseUser -d $DatabaseName

Write-Host "Restore completed."
