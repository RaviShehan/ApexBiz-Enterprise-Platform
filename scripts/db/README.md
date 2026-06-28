# ApexBiz Database Scripts

## Backup Database

PowerShell:

```powershell
.\scripts\db\backup-postgres.ps1
```

This creates a SQL backup inside:

```text
backups/
```

## Restore Database

PowerShell:

```powershell
.\scripts\db\restore-postgres.ps1 -BackupFile "backups\apexbiz-db-yyyyMMdd-HHmmss.sql"
```

## Important

Use production backups carefully.

Before restoring production data:

1. Confirm the backup file.
2. Confirm the target database.
3. Stop write traffic if needed.
4. Restore.
5. Verify application health.
6. Verify audit chain integrity.
