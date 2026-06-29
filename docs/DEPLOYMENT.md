# Deployment Guide

The CSDAC Internship Management Portal is designed for flexible deployment across various cloud providers.

## Pre-requisites
1. Node.js 18.x or 20.x
2. PostgreSQL Database URL
3. `NEXTAUTH_SECRET` (Generate via `openssl rand -base64 32`)

## Option 1: Vercel (Recommended)
Next.js applications run natively on Vercel with zero-configuration serverless functions.
1. Connect your GitHub repository to Vercel.
2. In the deployment settings, configure the **Environment Variables**:
   - `DATABASE_URL`
   - `NEXTAUTH_URL` (Your production domain, e.g., `https://internships.cdac.in`)
   - `NEXTAUTH_SECRET`
3. Vercel automatically runs `npm run build` and optimizes cache headers.

## Option 2: Self-hosted (Ubuntu VPS / EC2)

### 1. Install Dependencies
```bash
sudo apt update
sudo apt install nodejs npm nginx
npm install -g pm2
```

### 2. Setup Application
```bash
git clone <repository_url>
cd internships-app
npm ci
```

### 3. Build & Migrate
```bash
cp .env.example .env # Configure variables
npx prisma generate
npx prisma migrate deploy
npm run build
```

### 4. Start with PM2
```bash
pm2 start ecosystem.config.js
pm2 save
pm2 startup
```

### 5. Configure Nginx Reverse Proxy
Copy the provided `nginx.conf` to `/etc/nginx/sites-available/internships`, link it to `sites-enabled`, and restart Nginx. Use `certbot` for SSL.
