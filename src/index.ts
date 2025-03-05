// import type { Core } from '@strapi/strapi';

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */

  async bootstrap({ strapi }) {
    strapi.db.lifecycles.subscribe({
      models: ["plugin::users-permissions.user"],
      async afterCreate(event) {
        const { result } = event;
        const userId = result.id;

        await strapi.db.query("api::cart.cart").create({
          data: {
            users_permissions_user: userId,
          },
        });

        await strapi.db.query("api::wishlist.wishlist").create({
          data: {
            users_permissions_user: userId,
          },
        });
      },
    });
  },
};
