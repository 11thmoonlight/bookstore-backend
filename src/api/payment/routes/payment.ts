module.exports = {
  routes: [
    {
      method: "POST",
      path: "/create-payment-intent",
      handler: "payment.createPaymentIntent",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/create-checkout-session",
      handler: "payment.createCheckoutSession",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
