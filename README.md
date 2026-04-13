# 🛒 E-Commerce With AdonisJS & React TS

Project ini adalah aplikasi **Web E-Commerce sederhana** yang dibangun menggunakan:

- ⚙️ Backend: AdonisJS (Node.js Framework)
- 🎨 Frontend: React + TypeScript (Vite)
- 🔐 Authentication: Email & Google OAuth (SSO)
- 🛍️ Features: Product, Cart, Checkout (basic flow)

---

## 📌 Deskripsi Project

Aplikasi ini dibuat untuk mensimulasikan sistem e-commerce sederhana dengan fitur utama:

- Menampilkan daftar produk
- Menambahkan produk ke keranjang (cart)
- Login & register user
- Login menggunakan Google (OAuth)
- Checkout flow sederhana
- Authentication menggunakan token (cookie-based)
- Payment Gateway menggunakan Xendit

Project ini cocok untuk:

- Belajar fullstack (React + AdonisJS)
- Implementasi authentication modern (SSO + JWT / token)
- Studi kasus e-commerce dasar

---

## 🚀 Tech Stack

### Backend

- AdonisJS v6
- PostgreSQL
- Xendit Node (Payment Gateway)
- Lucid ORM
- Ally (Google OAuth)

### Frontend

- React
- TypeScript
- Vite
- Axios / Fetch API

---

## 📂 Struktur Project

```
root/
│
├── ecommerce-api/      # Backend (AdonisJS)
│   ├── app/
│   ├── config/
│   ├── database/
│   └── start/
│
├── ecommerce-fe/       # Frontend (React TS)
│   ├── src/
|   |   ├── component/
|   |   ├── pages/
|   |   ├── features/
|   |   ├── store/
|   |   ├── layout/
└── README.md
```

---

## ⚙️ Cara Menjalankan Project

### 1. Clone Repository

```bash
git clone https://github.com/KangAziz0/E-Commerce-With-Adonis-js.git
cd E-Commerce-With-Adonis-js
```

### 2. Setup Backend (Adonis Js)

```bash
cd ecommerce-api
npm install
```

### 3. Setup Env Backend

```bash
PORT=3333
HOST=localhost
NODE_ENV=development
APP_KEY=your_app_key

DB_HOST=127.0.0.1
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=postgres
DB_DATABASE=ecommerce_db

GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

XENDIT_SECRET_KEY=your_secret_key
XENDIT_WEBHOOK_TOKEN=xxxx
XENDIT_SUCCESS_REDIRECT_URL=http://localhost:5173/payment/success
XENDIT_FAILURE_REDIRECT_URL=http://localhost:5173/payment/failed

FRONTEND_URL=http://localhost:5173
```

### 4. Jalankan Migration

```bash
node ace migration:run
```

### 5. Jalankan Seeder

```bash
node ace db:seed
```

### 6. Jalankan Server Backend

```bash
node ace serve --watch
```

#### Backend berjalan di:

```bash
http://localhost:3333
```

### 7. Setup Frontend (React)

```bash
cd ecommerce-fe
npm install
npm run dev
```

#### Frontend berjalan di:

```bash
http://localhost:5173
```

MIT License

Copyright (c) 2026 Muhamad Aziz

Permission is hereby granted, free of charge, to any person obtaining a copy

# PENUTUP

Project ini dibuat sebagai pembelajaran dan eksplorasi dalam membangun aplikasi e-commerce fullstack menggunakan teknologi modern 🚀
