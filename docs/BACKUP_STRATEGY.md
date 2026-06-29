# Backup and Disaster Recovery Strategy

To ensure enterprise-grade reliability and data integrity, the following backup and recovery strategies are enforced for the CSDAC Internship Management System.

## 1. Database Backups

### Automated Point-in-Time Recovery (PITR)
If using a managed PostgreSQL provider (AWS RDS, Neon, Supabase):
- **Frequency**: Continuous.
- **Retention**: 7 to 30 days (depending on provider config).
- **Purpose**: Protects against accidental data deletion or corruption by allowing restoration to any exact minute within the retention window.

### Scheduled Logical Backups (pg_dump)
- **Frequency**: Weekly (Sunday 02:00 AM IST).
- **Format**: Custom format (`-Fc`) or plain SQL.
- **Storage**: Amazon S3 (or equivalent Object Storage) with Server-Side Encryption (AES-256).
- **Retention**: 6 months, managed via S3 Lifecycle Policies.

## 2. Application State

The application is stateless. All uploaded assets (if added in the future, e.g., profile pictures) should be stored in S3, not on the local filesystem.
- Vercel/PM2 deployments can be instantly rebuilt and spun up.

## 3. Disaster Recovery Plan (DRP)

In the event of a catastrophic failure of the primary database cluster:
1. **Assess**: Identify the timestamp immediately preceding the failure.
2. **Restore**: Trigger a PITR restore on the managed database provider to a new cluster instance.
3. **Re-route**: Update the `DATABASE_URL` environment variable in the hosting environment (Vercel/PM2) to point to the newly restored cluster.
4. **Validate**: Perform a health check via the `/api/health` endpoint and verify data integrity via the Admin Dashboard.

## 4. Migration Rollbacks
If a schema migration introduces critical errors:
- Do NOT manually edit the database schema.
- Write a downward migration or a new corrective migration using Prisma.
- Test thoroughly on a staging database before applying to production.
