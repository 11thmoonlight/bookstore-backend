// const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController("api::order.order", ({ strapi }) => ({
//   async create(ctx) {
//     const { data } = ctx.request.body;

//     if (!ctx.state.user) {
//       return ctx.unauthorized("User not authenticated");
//     }

//     const orderData = {
//       ...data,
//       users_permissions_user: ctx.state.user.id,
//     };

//     try {
//       const order = await strapi.entityService.create("api::order.order", {
//         data: orderData,
//       });

//       return order;
//     } catch (error) {
//       return ctx.internalServerError("Failed to create order", error);
//     }
//   },
// }));

// module.exports = {
//   async placeOrder(ctx) {
//     try {
//       const { data } = ctx.request.body;
//       const user = ctx.state.user;

//       console.log("user data", user);

//       const cart = await strapi.db.query("api::cart.cart").findOne({
//         where: { users_permissions_user: user.id },
//         populate: ["cart_items", "cart_items.product"],
//       });

//       if (!cart) {
//         return ctx.badRequest("سبد خرید خالی است.");
//       }
//       console.log("cart item", cart.cart_items);

//       const order = await strapi.db.query("api::order.order").create({
//         data: {
//           users_permissions_user: user.id,
//           ...data,
//         },
//       });

//       console.log("order", order);

//       for (const item of cart.cart_items) {
//         console.log("Creating Order Item for:", item.product);
//         await strapi.db.query("api::order-item.order-item").create({
//           data: {
//             order: order.id,
//             product: item.product.id,
//             quantity: item.quantity,
//             price: item.product.price,
//           },
//         });
//       }

//       await strapi.db.query("api::cart.cart").update({
//         where: { id: cart.id },
//         data: { cart_items: [] },
//       });

//       return order;
//     } catch (error) {
//       console.error("Error placing order:", error);
//       return ctx.internalServerError("خطایی در ثبت سفارش رخ داد.");
//     }
//   },
// };

module.exports = {
  async placeOrder(ctx) {
    try {
      const { data } = ctx.request.body;
      const user = ctx.state.user;

      console.log("user data", user);

      const cart = await strapi.db.query("api::cart.cart").findOne({
        where: { users_permissions_user: user.id },
        populate: ["cart_items", "cart_items.product"],
      });

      if (!cart || cart.cart_items.length === 0) {
        return ctx.badRequest("سبد خرید خالی است.");
      }

      console.log("cart item", cart.cart_items);
      console.log("cart", cart);

      const order = await strapi.db.query("api::order.order").create({
        data: {
          users_permissions_user: user.id,
          ...data,
        },
      });

      console.log("order", order);

      // ثبت آیتم‌های سفارش
      for (const item of cart.cart_items) {
        console.log("Creating Order Item for:", item.product);
        await strapi.db.query("api::order-item.order-item").create({
          data: {
            order: order.id,
            product: item.product.id,
            quantity: item.quantity,
            price: item.product.price,
          },
        });
      }

      // بعد از اضافه کردن آیتم‌ها، سبد خرید را پاک کن
      await strapi.db.query("api::cart.cart").update({
        where: { id: cart.id },
        data: { cart_items: [] },
      });

      return order;
    } catch (error) {
      console.error("Error placing order:", error);
      return ctx.internalServerError("خطایی در ثبت سفارش رخ داد.");
    }
  },
};
