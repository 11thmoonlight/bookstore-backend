"use strict";
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async createPaymentIntent(ctx) {
    try {
      const { amount, currency } = ctx.request.body;

      if (!amount || !currency) {
        return ctx.badRequest("Amount and currency are required.");
      }

      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency,
      });

      return ctx.send({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      return ctx.internalServerError("Failed to create payment intent.");
    }
  },

  async createCheckoutSession(ctx) {
    try {
      const { amount } = ctx.request.body;

      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: { name: "Sample Product" },
              unit_amount: amount,
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: "http://localhost:3000/profile",
        cancel_url: "http://localhost:3000/profile",
      });

      return ctx.send({ id: session.id });
    } catch (error) {
      console.error("Error creating checkout session:", error);
      return ctx.internalServerError("Failed to create checkout session.");
    }
  },
};
