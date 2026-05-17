# Ecommerce FE

Frontend SPA untuk E-Commerce-With-Adonis-js. Dibangun dengan **Vite + React + TypeScript**, **Redux Toolkit + Redux Saga** untuk state, **React Bootstrap + Tailwind** untuk UI, dan **Axios** untuk komunikasi HTTP.

## Stack

- React 18, TypeScript, Vite
- Redux Toolkit, Redux Saga
- React Router v7
- React Bootstrap, React Icons, Framer Motion
- Formik + Yup (form & validasi)
- Axios (HTTP client)

## Skrip

```bash
npm install
npm run dev      # development server (default: http://localhost:5173)
npm run build    # production build
npm run preview  # serve hasil build
```

## Variabel Environment

Salin `.env.example` menjadi `.env` lalu sesuaikan:

| Variabel              | Deskripsi                                                     |
| --------------------- | ------------------------------------------------------------- |
| `VITE_API_URL`        | Base URL API backend (mis. `http://localhost:3333/api`)       |
| `VITE_BACKEND_URL`    | Origin backend (untuk OAuth redirect)                         |
| `VITE_OTP_SENT`       | `true` jika backend mengirim OTP setelah login/register       |
| `VITE_ORIGIN_AREA_ID` | Area asal default untuk perhitungan ongkir (dari Biteship)    |

Akses env selalu lewat `@/config/env` — jangan baca `import.meta.env.*` langsung di komponen.

## Struktur Folder

```
src/
├── App.tsx                  # Root komponen (router & layout)
├── main.tsx                 # Entry React DOM
├── components/              # Komponen UI yang reusable
│   ├── common/              #   - Komponen lintas-halaman (CardProduct, Cart, Modal, dll)
│   ├── home/                #   - Section khusus halaman Home
│   └── layout/              #   - Navbar, Footer, MainLayout, AdminLayout
├── config/                  # Konfigurasi runtime (env, dll)
├── constants/               # Konstanta (storage keys, magic strings)
├── data/                    # Data statis (FAQ, kategori, dll — bukan mock API)
├── features/                # Slice + saga + service per domain
│   ├── auth/                #   <feature>/<feature>Slice.ts
│   ├── cart/                #                 <feature>Saga.ts
│   ├── categories/          #                 <feature>Service.ts
│   ├── checkout/            #                 <feature>.types.ts
│   ├── orders/
│   ├── products/
│   ├── selectors/areas/
│   └── wishlist/
├── hooks/                   # Custom hooks (typed redux, dll)
├── lib/                     # Library wrappers (httpClient, errorMessage)
├── mappers/                 # API <-> UI mappers
├── pages/                   # Halaman (route targets)
├── routes/                  # Route guards (PrivateRoute, GuestRoute, AdminRoute)
├── store/                   # Konfigurasi Redux store & rootSaga
├── styles/                  # Global CSS
├── types/                   # Type domain global (User, Category, Product UI/API)
└── utils/                   # Utilitas pure (formatRupiah, dll)
```

### Konvensi

- **Tipe**: file tipe diakhiri `.types.ts` (`order.types.ts`, `cart.types.ts`).
- **Halaman**: PascalCase (`CheckoutPage.tsx`, `ProfilePage.tsx`), bukan `Index.tsx` atau `shipping.tsx`.
- **Route guard**: nama file = nama export (`PrivateRoute.tsx` mengexport `PrivateRoute`).
- **Import**: gunakan alias `@/...`, hindari `../../...`.
- **Redux**: gunakan `useAppDispatch` & `useAppSelector` dari `@/hooks/redux`, bukan hook mentah.
- **HTTP**: import `httpClient` dari `@/lib/httpClient`.
- **Error**: ekstrak pesan error dengan `getErrorMessage` dari `@/lib/errorMessage`.

### Pola Feature

Setiap fitur (`features/<name>/`) terdiri dari:

```
<name>Slice.ts     # createSlice + actions
<name>Saga.ts      # watcher saga + handler
<name>Service.ts   # axios calls (1:1 dengan endpoint backend)
<name>.types.ts    # TypeScript types lokal feature
```

Slice hanya boleh mendefinisikan state UI, tidak boleh memanggil network. Side-effect ada di saga; saga delegasikan request ke service.
