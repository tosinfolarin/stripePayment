
import { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";

console.log(process.env.STRIPE_SECRET_KEY);

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-10-29.clover",
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const { payment_method } = req.body;

      const paymentIntent = await stripe.paymentIntents.create({
        amount: 1099, // amount determined by therapist
        currency: "gbp",
        payment_method: payment_method,
      });

      res.status(200).json({ client_secret: paymentIntent.client_secret });
    } catch (error: any) {
      res.status(500).json({ statusCode: 500, message: error.message });
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
