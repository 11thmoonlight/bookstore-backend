const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

module.exports = {
  async createSession(ctx) {
    try {
      const { totalPrice, shippingInfo } = ctx.request.body;

      if (!totalPrice || totalPrice <= 0) {
        return ctx.badRequest("مبلغ کل نامعتبر است.");
      }

      // ایجاد جلسه پرداخت در Stripe با مبلغ کل
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "usd",
              product_data: {
                name: "Order Total",
              },
              unit_amount: Math.round(totalPrice * 100), // تبدیل به سنت
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        success_url: `https://hinode.vercel.app/cart/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `https://hinode.vercel.app/cart/checkout/cancel`,
        metadata: {
          shippingInfo: JSON.stringify(shippingInfo),
        },
      });

      return ctx.send({ sessionId: session.id });
    } catch (error) {
      console.error("خطا در ایجاد جلسه پرداخت:", error);
      return ctx.badRequest("خطا در ایجاد جلسه پرداخت", { error });
    }
  },
};
