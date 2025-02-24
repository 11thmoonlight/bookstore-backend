import { factories } from "@strapi/strapi";

export default factories.createCoreRouter("api::order.order");

// module.exports = {
//   routes: [
//     {
//       method: "POST",
//       path: "/orders/place-order",
//       handler: "order.placeOrder",
//       config: {
//         auth: false,
//       },
//     },
//   ],
// };
