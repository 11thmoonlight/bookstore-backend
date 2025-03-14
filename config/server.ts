module.exports = ({ env }) => ({
  host: "0.0.0.0",
  port: env.int("PORT", 1337),
  url: env("PUBLIC_URL", "https://backend-production-dd5c.up.railway.app"),
  app: {
    keys: env.array("APP_KEYS"),
  },
  admin: {
    auth: {
      secret: env("ADMIN_JWT_SECRET", "your-secret-key"),
    },
  },
});
