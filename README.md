# Restaurant Ordering and Table Reservation System (MERN)

A complete MERN application: customers browse restaurants, add food to a cart and reserve a
table; admins manage restaurants, food, tables and reservations from a separate console.

**No payment gateway is included** — the cart is the end of the customer flow, and payment
happens at the restaurant.

---

## 1. Tech stack

| Layer | Choice |
| --- | --- |
| Frontend | React 18 (Vite), React Router 6, React Bootstrap, React Toastify |
| Backend | Node.js, Express 4 |
| Database | MongoDB with Mongoose 8 |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` password hashing |
| HTTP | Axios with a request interceptor that attaches the token |
| State | React Context API (`AuthContext`, `CartContext`) |

---

## 2. Folder structure

```
restaurant-app/
├── package.json                  # convenience scripts for both halves
├── server/
│   ├── server.js                 # express app + route mounting
│   ├── .env.example
│   ├── config/db.js              # mongoose connection
│   ├── middleware/
│   │   ├── auth.js               # protect / adminOnly / customerOnly
│   │   └── error.js              # 404 + central error handler
│   ├── models/
│   │   ├── User.js  Restaurant.js  MenuItem.js
│   │   └── Table.js  Reservation.js  Cart.js
│   ├── controllers/
│   │   ├── authController.js        restaurantController.js
│   │   ├── menuController.js        tableController.js
│   │   ├── reservationController.js cartController.js
│   │   └── statsController.js
│   ├── routes/                   # one router per resource
│   └── seed/seed.js              # demo accounts, restaurants, food, tables
└── client/
    ├── index.html  vite.config.js  .env.example
    └── src/
        ├── main.jsx  App.jsx  index.css
        ├── api/client.js         # axios instance + error helper
        ├── context/              # AuthContext.jsx, CartContext.jsx
        ├── components/           # Navbar, Footer, cards, BookingModal, guards…
        └── pages/
            ├── Home, Restaurants, RestaurantDetail, Menu, Tables
            ├── CartPage, MyReservations, CustomerDashboard, Profile
            ├── Login, Register, AdminLogin, NotFound
            └── admin/  AdminLayout, Dashboard, ManageRestaurants,
                        ManageFood, ManageTables, ManageReservations
```

---

## 3. Prerequisites

- Node.js 18 or newer
- MongoDB running locally (`mongodb://127.0.0.1:27017`) **or** a MongoDB Atlas connection string

---

## 4. Setup

### Backend

```bash
cd server
npm install
cp .env.example .env      # then edit the values
npm run seed              # loads demo data (wipes existing collections)
npm run dev               # http://localhost:5000
```

`server/.env`:

```
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/restaurant_app
JWT_SECRET=change_this_to_a_long_random_string
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

For Atlas, replace `MONGO_URI` with
`mongodb+srv://<user>:<password>@<cluster>.mongodb.net/restaurant_app`.

### Frontend

```bash
cd client
npm install
cp .env.example .env      # VITE_API_URL=http://localhost:5000/api
npm run dev               # http://localhost:5173
```

Run the two in separate terminals. From the project root you can also use
`npm run install:all`, `npm run seed`, `npm run server`, `npm run client`.

---

## 5. Demo logins (created by the seed script)

| Role | Email | Password |
| --- | --- | --- |
| Admin | `admin@restaurant.com` | `admin123` |
| Customer | `customer@example.com` | `customer123` |

Customer login is at `/login`, admin login at `/admin/login`. The two portals are separate: a
customer account is rejected at the admin login, and an admin account is rejected at the
customer login.

---

## 6. API reference

All protected routes expect `Authorization: Bearer <token>`.

### Auth
| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| POST | `/api/auth/register` | public | create a customer account |
| POST | `/api/auth/login` | public | body may carry `role` to lock the portal |
| GET | `/api/auth/profile` | logged in | current user |
| PUT | `/api/auth/profile` | logged in | update name / phone / password |

### Restaurants
| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/restaurants` | public |
| GET | `/api/restaurants/:id` | public (returns restaurant + its menu + its tables) |
| POST | `/api/restaurants` | admin |
| PUT | `/api/restaurants/:id` | admin |
| DELETE | `/api/restaurants/:id` | admin (cascades to food and tables) |

### Food
| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/menu` | public — filters: `restaurant`, `category`, `search`, `available` |
| GET | `/api/menu/:id` | public |
| POST / PUT / DELETE | `/api/menu[/:id]` | admin |

### Tables
| Method | Path | Access |
| --- | --- | --- |
| GET | `/api/tables` | public — filters: `restaurant`, `available` |
| GET | `/api/tables/:id` | public |
| POST / PUT / DELETE | `/api/tables[/:id]` | admin |

### Reservations
| Method | Path | Access |
| --- | --- | --- |
| POST | `/api/reservations` | customer |
| GET | `/api/reservations/my` | customer |
| PUT | `/api/reservations/my/:id/cancel` | customer |
| GET | `/api/reservations` | admin — filters: `status`, `restaurant` |
| PUT | `/api/reservations/:id` | admin — `{ status: Pending \| Confirmed \| Cancelled }` |

### Cart (customer only)
| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/api/cart` | cart with populated items, per-line subtotal and total |
| POST | `/api/cart` | `{ menuItemId, quantity }` |
| PUT | `/api/cart/:itemId` | `{ quantity }` — `:itemId` is the food item id |
| DELETE | `/api/cart/:itemId` | remove one line |
| DELETE | `/api/cart` | empty the cart |

### Stats
`GET /api/stats` (admin) — counts for the dashboard cards plus the five latest reservations.

---

## 7. How the rules are enforced

- **Login required for cart and reservations.** The UI shows *"Please login to continue."* and
  redirects to `/login`; independently, `protect` + `customerOnly` reject the API call, so the
  rule holds even if someone calls the API directly.
- **Role separation.** `adminOnly` guards every write route for restaurants, food and tables,
  plus the admin reservation views. `AdminRoute` keeps the console out of the customer UI.
- **Passwords** are hashed with bcrypt in a Mongoose `pre('save')` hook and never returned
  (`select: false`).
- **Double booking** is blocked: the same table cannot hold two non-cancelled reservations for
  the same date and time, guests cannot exceed the table's capacity, and past date/times are
  rejected.
- **Unavailable tables** render a disabled *Not available* button and are refused server-side.

---

## 8. Notes

- Images are referenced by URL (Unsplash links in the seed data, any URL in the admin forms).
  A broken URL falls back to a neutral placeholder instead of a broken-image icon.
- Re-running `npm run seed` clears users, restaurants, food, tables, reservations and carts.
- For production: set a strong `JWT_SECRET`, set `NODE_ENV=production`, build the client with
  `npm run build` and serve `client/dist` behind the API or from any static host.
