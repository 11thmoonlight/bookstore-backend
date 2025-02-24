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

//       if (!cart || cart.cart_items.length === 0) {
//         return ctx.badRequest("سبد خرید خالی است.");
//       }

//       console.log("cart item", cart.cart_items);
//       console.log("cart", cart);

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

// "use strict";

// /**
//  * order controller
//  */

// const { createCoreController } = require("@strapi/strapi").factories;

// module.exports = createCoreController("api::order.order", ({ strapi }) => ({
//   async placeOrder(ctx) {
//     try {
//       const { shippingInfo, sessionId, payAmount } = ctx.request.body;
//       const user = ctx.state.user; // دریافت کاربر لاگین شده

//       console.log("user", user);

//       if (!user) {
//         return ctx.unauthorized("You must be logged in to place an order.");
//       }

//       // دریافت سبد خرید کاربر
//       const cart = await strapi.db.query("api::cart.cart").findOne({
//         where: { users_permissions_user: user.id },
//         populate: ["cart_items", "cart_items.product"],
//       });

//       console.log("cart", cart);

//       if (!cart || !cart.cart_items.length) {
//         return ctx.badRequest("Your cart is empty.");
//       }

//       // ایجاد سفارش جدید
//       const order = await strapi.entityService.create("api::order.order", {
//         data: {
//           users_permissions_user: user.id,
//           address: shippingInfo.address,
//           phoneNumber: shippingInfo.phoneNumber,
//           postalCode: shippingInfo.postalCode,
//           emailAddress: shippingInfo.emailAddress,
//           stripePaymentId: sessionId,
//           payAmount,
//           orderStatus: "order placed",
//         },
//       });

//       console.log("order", order);

//       // ایجاد `order-items` برای هر آیتم سبد خرید
//       const orderItems = await Promise.all(
//         cart.cart_items.map(async (item) => {
//           const orderItem = await strapi.entityService.create(
//             "api::order-item.order-item",
//             {
//               data: {
//                 order: order.id,
//                 product: item.product.id,
//                 quantity: item.quantity,
//                 price: item.product.price,
//               },
//             }
//           );
//           console.log("created order item", orderItem);
//           return orderItem;
//         })
//       );

//       // حذف سبد خرید کاربر
//       await strapi.db.query("api::cart.cart-item").deleteMany({
//         where: { cart: cart.id },
//       });

//       return ctx.send({ message: "Order placed successfully!", order });
//     } catch (error) {
//       console.error("Order creation error:", error);
//       return ctx.internalServerError("Something went wrong.");
//     }
//   },
// }));

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const user = ctx.state.user;

      //     const orderData = {
      //       ...data,
      //       users_permissions_user: ctx.state.user.id,
      //     };

      if (!user) {
        return ctx.unauthorized("You must be logged in to place an order.");
      }

      // دریافت سبد خرید کاربر
      const cart = await strapi.db.query("api::cart.cart").findOne({
        where: { users_permissions_user: user.id },
        populate: ["cart_items", "cart_items.product", "products"],
      });

      if (!cart || !cart.cart_items.length) {
        return ctx.badRequest("Your cart is empty.");
      }

      // دریافت لیست آی‌دی محصولات از cart_items
      const productIds = cart.products.map((item) => item.id);

      console.log("products", productIds);

      // ایجاد سفارش جدید
      const order = await strapi.entityService.create("api::order.order", {
        data: {
          users_permissions_user: ctx.state.user.id,
          products: productIds, // ذخیره به عنوان ریلیشن
          data,
          orderStatus: "order placed",
        },
      });

      // حذف آیتم‌های سبد خرید کاربر
      await strapi.db.query("api::cart.cart-item").deleteMany({
        where: { cart: cart.id },
      });

      return ctx.send({ message: "Order placed successfully!", order });
    } catch (error) {
      console.error("Order creation error:", error);
      return ctx.internalServerError("Something went wrong.");
    }
  },
}));
