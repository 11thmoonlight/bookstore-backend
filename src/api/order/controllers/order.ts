const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    try {
      const { data } = ctx.request.body;
      const user = ctx.state.user;

      if (!user) {
        return ctx.unauthorized("You must be logged in to place an order.");
      }

      const cart = await strapi.db.query("api::cart.cart").findOne({
        where: { users_permissions_user: user.id },
        populate: ["cart_items", "cart_items.product", "products"],
      });

      if (!cart || !cart.cart_items.length) {
        return ctx.badRequest("Your cart is empty.");
      }

      const payAmount = cart.cart_items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0
      );

      const order = await strapi.entityService.create("api::order.order", {
        data: {
          users_permissions_user: ctx.state.user.id,
          address: data.address,
          phoneNumber: data.phoneNumber,
          postalCode: data.postalCode,
          emailAddress: data.emailAddress,
          stripePaymentId: data.stripePaymentId,
          payAmount: payAmount,
          orderStatus: "order placed",
          cart_items: {
            connect: cart.cart_items.map((item) => ({ id: item.id })),
          },
        },
      });

      await Promise.all(
        cart.cart_items.map(async (item) => {
          const product = item.product;
          const updatedStock = product.stock - item.quantity;

          if (updatedStock < 0) {
            throw new Error(`Not enough stock for product: ${product.name}`);
          }

          await strapi.db.query("api::product.product").update({
            where: { id: product.id },
            data: { stock: updatedStock },
          });
        })
      );

      await strapi.entityService.update("api::cart.cart", cart.id, {
        data: {
          cart_items: [],
          products: [],
        },
      });

      return ctx.send({ message: "Order placed successfully!", order });
    } catch (error) {
      console.error("Order creation error:", error);
      return ctx.internalServerError("Something went wrong.");
    }
  },
}));
