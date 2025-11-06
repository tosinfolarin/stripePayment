
"use client";

import { useState } from "react";
import {
  CardElement,
  Elements,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const [name, setName] = useState("Pedro Duarte");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    if (!stripe || !elements) {
      return;
    }

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      return;
    }

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: "card",
      card: cardElement,
      billing_details: {
        name,
      },
    });

    if (error) {
      setError(error.message ?? "An unknown error occurred");
      setLoading(false);
      return;
    }

    // Call your Firebase Function to process the payment
    const response = await fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ payment_method: paymentMethod?.id }),
    });

    const { client_secret: clientSecret } = await response.json();

    const { error: confirmError } = await stripe.confirmCardPayment(
      clientSecret
    );

    if (confirmError) {
      setError(confirmError.message ?? "An unknown error occurred");
    } else {
      // Payment successful
      console.log("Payment successful!");
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="name" className="text-right">
            Name
          </Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="card" className="text-right">
            Card
          </Label>
          <div className="col-span-3">
            <CardElement
              options={{
                style: {
                  base: {
                    fontSize: "16px",
                    color: "#424770",
                    "::placeholder": {
                      color: "#aab7c4",
                    },
                  },
                  invalid: {
                    color: "#9e2146",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
      {error && <div className="text-red-500 text-sm mb-4">{error}</div>}
      <Button type="submit" disabled={!stripe || loading}>
        {loading ? "Processing..." : "Pay"}
      </Button>
    </form>
  );
};

export function PaymentForm() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">Make a Payment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Make a payment</DialogTitle>
          <DialogDescription>
            Enter your payment details below.
          </DialogDescription>
        </DialogHeader>
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </DialogContent>
    </Dialog>
  );
}
