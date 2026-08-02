# 🚀 PLAN.md: Migrasi kaelPOS ke Cloudflare Infrastructure

Dokumen ini berisi panduan teknis & *roadmap* migrasi **kaelPOS** dari local SQLite (`.db` file) & hosting konvensional ke arsitektur Serverless Fullstack di **Cloudflare (Pages, D1 Database, R2 Storage)**.

---

## 🎯 Target Arsitektur

* **Frontend & Backend (SSR/API):** Next.js App Router di-deploy ke **Cloudflare Pages** via Edge Runtime.
* **Database:** **Cloudflare D1** (Serverless SQLite) dikelola dengan **Drizzle ORM**.
* **Object Storage:** **Cloudflare R2** untuk penyimpanan gambar produk & aset media.
* **Authentication:** Better Auth (terintegrasi dengan D1).

---

## 📋 Checklist Migrasi

- [ ] **Phase 1: Setup Tooling & Dependencies**
- [ ] **Phase 2: Konfigurasi Database D1 & Drizzle ORM**
- [ ] **Phase 3: Konfigurasi Cloudflare R2 untuk Gambar Produk**
- [ ] **Phase 4: Penyesuaian Codebase Next.js (Edge Runtime)**
- [ ] **Phase 5: Testing Local dengan Cloudflare Bindings**
- [ ] **Phase 6: Deployment & Environment Setup di Cloudflare Pages**

---

## 🛠️ Langkah-Langkah Eksekusi

### Phase 1: Setup Tooling & Dependencies

1. **Install adapter Cloudflare & Wrangler CLI:**
   ```bash
   npm install -D @cloudflare/next-on-pages wrangler
   npm install @cloudflare/workers-types
   ```
2. **Login ke Cloudflare via CLI:**
   ```bash
   npx wrangler login
   ```

### Phase 2: Konfigurasi Database D1 & Drizzle ORM

1. **Buat file `wrangler.toml` di root project:**
   ```toml
   name = "pos-kaelcafe"
   compatibility_date = "2024-09-23"
   compatibility_flags = ["nodejs_compat"]
   pages_build_output_dir = ".vercel/output/static"

   [[d1_databases]]
   binding = "DB"
   database_name = "kael-cafe-db"
   database_id = "<DATABASE_ID>"

   [[r2_buckets]]
   binding = "POS_BUCKET"
   bucket_name = "kael-pos-assets"
   ```

2. **Update Setup Connection Drizzle (`src/lib/db.js`):**
   Gunakan D1 adapter Drizzle dan `getRequestContext().env.DB`.

### Phase 3: Konfigurasi Cloudflare R2 untuk Gambar Produk

1. **Update `src/app/api/upload/route.js`:**
   Implementasikan fungsi upload yang menggunakan binding `env.POS_BUCKET.put()` dari Cloudflare R2.
2. Hindari `fs/promises` karena Edge runtime tidak mendukung filesystem asli.

### Phase 4: Penyesuaian Codebase Next.js (Edge Runtime)

1. **Tambahkan Export Runtime:**
   Di setiap `page.js`, `route.js`, atau Actions, pastikan berjalan di Edge jika di-require.
2. **Penyesuaian Better Auth:**
   Pastikan Better Auth menggunakan adapter yang kompatibel di Edge/D1.

### Phase 5: Testing Local dengan Cloudflare Bindings

1. Update package.json scripts untuk dev.
2. Verifikasi upload R2 & DB D1 di environment lokal.

### Phase 6: Deployment ke Cloudflare Pages

1. Push ke Git.
2. Connect di Cloudflare Dashboard.
3. Setup variables dan binding.
