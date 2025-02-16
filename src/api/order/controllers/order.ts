// import { factories } from "@strapi/strapi";

// export default factories.createCoreController("api::order.order");


const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { data } = ctx.request.body;

    // چک کردن اینکه یوزر لاگین کرده باشد
    if (!ctx.state.user) {
      return ctx.unauthorized("User not authenticated");
    }

    // مقداردهی خودکار user
    const orderData = {
      ...data,
      users_permissions_user: ctx.state.user.id,
    };

    try {
      const order = await strapi.entityService.create("api::order.order", {
        data: orderData,
      });

      return order;
    } catch (error) {
      return ctx.internalServerError("Failed to create order", error);
    }
  },
}));