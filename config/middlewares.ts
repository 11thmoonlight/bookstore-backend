// export default [
//   "strapi::logger",
//   "strapi::errors",
//   "strapi::security",
//   "strapi::cors",
//   "strapi::poweredBy",
//   "strapi::query",
//   "strapi::body",
//   "strapi::session",
//   "strapi::favicon",
//   "strapi::public",
// ];

export default [
  "strapi::logger",
  "strapi::errors",
  "strapi::security",
  {
    name: "strapi::cors",
    config: {
      origin: ["https://hinode.vercel.app"],
      headers: ["Content-Type", "Authorization"],
      credentials: true,
    },
  },
  "strapi::poweredBy",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
