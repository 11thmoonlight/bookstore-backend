module.exports = {
  routes: [
    {
      method: "POST",
      path: "/payment",
      handler: "payment.createSession",
      config: {
        auth: false,
      },
    },
  ],
};