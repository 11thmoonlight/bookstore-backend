# 📚 Bookstore Backend – Strapi v5

This is the backend for a bookstore website, built with **[Strapi v5](https://strapi.io/)** and written in **TypeScript**.  
It uses **SQLite** for development and includes **Stripe** integration for payment processing.

---

## 🚀 Getting Started

Install dependencies:

```bash
yarn install
# or
npm install
```

Start the development server:

```bash
yarn develop
# or
npm run develop
```

The admin panel will be available at: [http://localhost:1337/admin](http://localhost:1337/admin)

---

## 🛠️ Scripts

| Script         | Description                          |
|----------------|--------------------------------------|
| `yarn develop` | Start the app in development mode    |
| `yarn build`   | Build the admin panel                |
| `yarn start`   | Start the app in production mode     |
| `yarn deploy`  | Deploy the app (Strapi Cloud plugin) |

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory based on the example below:

```env
# Server
HOST=0.0.0.0
PORT=1337

# Secrets
APP_KEYS=your_app_keys
API_TOKEN_SALT=your_api_token_salt
ADMIN_JWT_SECRET=your_admin_jwt
TRANSFER_TOKEN_SALT=your_transfer_token_salt
JWT_SECRET=your_jwt_secret

# Database (SQLite by default)
DATABASE_CLIENT=sqlite
DATABASE_FILENAME=.tmp/data.db

# Stripe
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_API_KEY=your_stripe_secret_key
```

> You can copy `.env.example` and rename it to `.env`.

---

## 🧩 Plugins Used

- `@strapi/plugin-users-permissions`
- `@strapi/plugin-cloud`
- `stripe`

---

## 📦 Deployment

This project is deployed on **[Railway](https://railway.app/)**. You can also deploy to other platforms following the official [Strapi deployment guide](https://docs.strapi.io/dev-docs/deployment).

---

## 📚 Learn More

- [Strapi Documentation](https://docs.strapi.io/)
- [Strapi CLI Commands](https://docs.strapi.io/dev-docs/cli)
- [Strapi Deployment Options](https://docs.strapi.io/dev-docs/deployment)
- [Stripe Documentation](https://stripe.com/docs)

---

## 🧑‍💻 Author

Made with ❤️ by [Your Name or GitHub Profile](https://github.com/yourusername)
