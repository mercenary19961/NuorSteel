# Cloudflare R2 Setup Guide

> Follow these steps after the client activates R2 on their Cloudflare account (adds credit card).

---

## Step 1: Create an R2 Bucket

1. Go to **Cloudflare Dashboard** → **R2 Object Storage**
2. Click **Create Bucket**
3. Bucket name: `nuorsteel`
4. Location: **Automatic** (or pick a region close to your users)
5. Click **Create Bucket**

---

## Step 2: Enable Public Access

1. Open the `nuorsteel` bucket → **Settings** tab
2. Under **Public access**, click **Allow Access**
3. Copy the public URL (e.g. `https://pub-xxxx.r2.dev`)
4. *(Optional)* Connect a custom domain like `files.nuorsteel.com` for a branded URL

---

## Step 3: Create an R2 API Token

1. Go to **Cloudflare Dashboard** → **R2** → **Manage R2 API Tokens**
2. Click **Create API Token**
3. Set permissions: **Object Read & Write**
4. Scope: restrict to the `nuorsteel` bucket only
5. Click **Create API Token**
6. **Save both values immediately** (the secret is shown only once):
   - Access Key ID
   - Secret Access Key

---

## Step 4: Find Your S3 API Endpoint

1. Open the `nuorsteel` bucket → **Settings** tab
2. Under **Bucket Details**, find the **S3 API** endpoint
3. It looks like: `https://<account-id>.r2.cloudflarestorage.com`
4. Copy this URL

---

## Step 5: Set Environment Variables on Railway

Go to your Railway service → **Variables** tab and add:

```
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=<Access Key ID from Step 3>
AWS_SECRET_ACCESS_KEY=<Secret Access Key from Step 3>
AWS_BUCKET=nuorsteel
AWS_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
AWS_URL=https://pub-xxxx.r2.dev
```

| Variable | Where to find it |
|----------|-----------------|
| `AWS_ACCESS_KEY_ID` | R2 API Token (Step 3) |
| `AWS_SECRET_ACCESS_KEY` | R2 API Token (Step 3) |
| `AWS_BUCKET` | Bucket name from Step 1 |
| `AWS_ENDPOINT` | S3 API URL from Step 4 |
| `AWS_URL` | Public access URL from Step 2 |

> **Note:** Do NOT set `AWS_DEFAULT_REGION` — it defaults to `auto` which is correct for R2.

---

## Step 6: Deploy & Verify

1. Railway will automatically redeploy when you save the new variables
2. After deploy, test by:
   - Logging into the admin panel
   - Uploading a media file via **Media Library**
   - Verifying the image displays correctly on the site
   - Uploading a certificate PDF and verifying the download works
3. Check the R2 bucket in Cloudflare dashboard to confirm files appear there

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Files upload but images don't display | Check `AWS_URL` is the public access URL, not the S3 API endpoint |
| 403 Forbidden on upload | Check API token has **Read & Write** permissions and is scoped to the correct bucket |
| "Could not connect" errors | Verify `AWS_ENDPOINT` is correct (includes `https://`) |
| Old files missing after switching | Files uploaded before R2 activation were on local storage and are expected to be gone — re-upload them through admin |

---

## R2 Pricing (Reference)

| Resource | Free Tier | Overage |
|----------|-----------|---------|
| Storage | 10 GB/month | $0.015/GB |
| Class A ops (writes) | 1M/month | $4.50/M |
| Class B ops (reads) | 10M/month | $0.36/M |
| Egress (data transfer) | **Unlimited** | **$0.00** |

For a corporate website like Nuor Steel, usage will stay well within the free tier.
