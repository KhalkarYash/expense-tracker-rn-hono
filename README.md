# 💰 Paysa - Expense Tracker App

A cross-platform **Expense Tracker** mobile app built using **React Native (frontend)** and **Hono + Cloudflare Workers (backend)**. This is a simplified version of a future visioned product idea, _“Paysa,”_ designed to help users track their daily expenses with ease.

> ✅ **Backend**: REST API with Hono (JS) deployed on Cloudflare Workers
> ✅ **Frontend**: React Native (Expo) app with JWT auth and async storage
> ✅ **Purpose**: Built for mastering full-stack mobile dev with real deployment

---

## 📱 Features

- User Authentication (JWT-based login/signup)
- Add, view, and delete expenses
- View total expenses summary
- Fully responsive UI
- Built for real devices (Android/iOS)

---

## 🛠️ Tech Stack

### Frontend (Mobile)

- React Native (via Expo)
- React Native Stack Navigation
- AsyncStorage
- Clerk Authentication
- StyleSheet for styling

### Backend

- Hono (Fast JavaScript Web Framework)
- Cloudflare Workers
- TiDB hosted MySQL database
- Rate Limiting (Upstash Redis)

---

## 📂 Folder Structure

```
expense-tracker-rn-hono/
├── backend/               # Hono backend API (Cloudflare Worker)
│   ├── routes/
│   ├── middleware/
│   ├── db/
│   └── index.ts
│
├── mobile/                # React Native app
│   ├── src/
│   │   ├── screens/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── utils/
│   └── App.tsx
└── README.md
```

---

## 🚀 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/khalkaryash/expense-tracker-rn-hono.git
cd expense-tracker-rn-hono
```

### 2. Backend Setup

```bash
cd backend
npm install
```

#### For local dev:

```bash
npx wrangler dev
```

#### For production deploy:

```bash
npx wrangler publish
```

### 3. Mobile Setup

```bash
cd mobile
yarn install
```

#### Start Expo server:

```bash
npx expo start
```

> 🔐 **Don't forget to add your backend URL in `.env` or `constants.js` in mobile!**

---

## 🔐 Environment Variables

### Backend

Create a `.dev.vars` file:

```env
DB_URL=your_database_url
```

### Mobile

Inside `mobile/src/constants.ts`:

```ts
export const API_URL = "https://your-backend.workers.dev";
```

---

## ✅ API Endpoints

| Method | Endpoint                            | Description                        |
| ------ | ----------------------------------- | ---------------------------------- |
| GET    | `/api/transactions/:userId`         | Get all transactions for a user    |
| POST   | `/api/transactions`                 | Add a new transaction              |
| DELETE | `/api/transactions/:id`             | Delete a transaction by ID         |
| GET    | `/api/transactions/summary/:userId` | Get transaction summary for a user |

---

## 📸 Screenshots

Great! Here’s the updated **📸 Screenshots** section of your README with embedded image paths and a link to the demo video—all neatly formatted using markdown.

---

## 📸 Screenshots

### ▶️ Demo Video

[![Watch Demo](./mobile/assets/images/1.jpg)](./mobile/assets/images/Demo.mp4)

> _Click the image above to watch the demo video_

### 📷 App Screens

| Login                              | Signup                             | Home/Summary                       |
| ---------------------------------- | ---------------------------------- | ---------------------------------- |
| ![1](./mobile/assets/images/1.jpg) | ![2](./mobile/assets/images/2.jpg) | ![3](./mobile/assets/images/3.jpg) |

| Add Transaction                    | Adding transaction details         | Transaction added confirmation     |
| ---------------------------------- | ---------------------------------- | ---------------------------------- |
| ![4](./mobile/assets/images/4.jpg) | ![5](./mobile/assets/images/5.jpg) | ![6](./mobile/assets/images/6.jpg) |

---

## 🧑‍💻 Author

Made with ❤️ by **[Yash Khalkar](https://github.com/KhalkarYash)**

---

## 📜 License

**MIT**
