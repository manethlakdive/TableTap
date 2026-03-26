# TableTap - QR Restaurant Ordering System

A full-stack web application for QR-based restaurant ordering.

---

## Tech Stack
- **Frontend:** React.js + Vite
- **Backend:** Firebase (Auth + Firestore)
- **Hosting:** Firebase Hosting

---

## Setup Guide

### Step 1: Create a Firebase Project

1. Go to https://console.firebase.google.com
2. Click **"Add Project"** → Name it `tabletap`
3. Disable Google Analytics (optional) → **Create Project**

### Step 2: Enable Firebase Services

#### Authentication
1. In Firebase Console → **Authentication** → **Get Started**
2. Click **Email/Password** → Enable → Save

#### Firestore Database
1. In Firebase Console → **Firestore Database** → **Create Database**
2. Choose **Start in production mode**
3. Select your region (e.g., `asia-south1` for Sri Lanka)

#### Upload Firestore Rules
1. In Firestore → **Rules** tab
2. Copy-paste the content from `firestore.rules` file
3. Click **Publish**

### Step 3: Get Firebase Config

1. In Firebase Console → Project Settings (gear icon)
2. Scroll to **"Your apps"** → Click **"</>"** (Web)
3. Register app as `tabletap-web`
4. Copy the `firebaseConfig` values

### Step 4: Configure .env

Open `.env` file and fill in your values:

```
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=tabletap-xxxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=tabletap-xxxxx
VITE_FIREBASE_STORAGE_BUCKET=tabletap-xxxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

### Step 5: Install & Run Locally

```bash
npm install
npm run dev
```

Visit: http://localhost:5173

---

## Deploy to Firebase Hosting

### Install Firebase CLI
```bash
npm install -g firebase-tools
```

### Login & Init
```bash
firebase login
firebase init hosting
```
- Select your Firebase project
- Set public directory to: `dist`
- Configure as single-page app: **Yes**
- Don't overwrite index.html

### Build & Deploy
```bash
npm run build
firebase deploy
```

Your site will be live at: `https://tabletap-xxxxx.web.app`

---

## How to Use

### Staff (Restaurant)
1. Go to your site URL
2. **Register** with shop name, email, password
3. **Menu** → Add food items with image URL, price, category
4. **QR Codes** → Generate QR for each table, download and print
5. **Orders** → View real-time orders from customers

### Customer
1. Scan QR code at the table
2. Browse menu, add items to cart
3. Tap **View Cart** → Enter persons count + optional note
4. Place order → Staff sees it instantly

---

## File Structure

```
tabletap/
├── src/
│   ├── assets/         - Logo files
│   ├── components/     - Navbar, OrderCard, MenuCard, QRGenerator, ProtectedRoute
│   ├── pages/          - Login, Register, Dashboard, MenuManager, QRPage, CustomerMenu
│   ├── firebase/       - config.js, auth.js, firestore.js
│   ├── context/        - AuthContext.jsx
│   ├── styles/         - theme.css
│   ├── App.jsx
│   └── main.jsx
├── .env                - Firebase config (fill this in!)
├── firebase.json       - Hosting config
├── firestore.rules     - Database security rules
└── package.json
```

---

## QR Code Flow

When a customer scans a QR code, they go to:
```
https://your-site.web.app/order?shopId=SHOP_ID&table=TABLE_NUMBER
```

The system automatically:
- Identifies the restaurant
- Sets the table number
- Shows that restaurant's menu
- Submits order linked to that table
