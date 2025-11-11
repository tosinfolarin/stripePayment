
import { NextResponse, type NextRequest } from "next/server";
import Stripe from 'stripe';

// We will define therapist data on the server to securely get the price
const therapists = [
  { id: 1, name: "Dr. Olivia Bennett", price: 120 },
  { id: 2, name: "Dr. Benjamin Carter", price: 110 },
  { id: 3, name: "Dr. Chloe Davis", price: 130 },
];

// Ensure you have STRIPE_SECRET_KEY in your .env.local
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
  typescript: true,
});

export async function POST(request: NextRequest) {
  const { therapistId } = await request.json();

  const therapist = therapists.find(t => t.id === therapistId);

  if (!therapist) {
    return NextResponse.json({ error: 'Therapist not found' }, { status: 404 });
  }

  try {
    // 1. Create a customer in Stripe
    const customer = await stripe.customers.create({
      name: 'John Doe',
      email: 'john.doe@example.com', // In a real app, use the actual client's email
      description: 'Therapy Client',
    });

    // 2. Create a draft invoice for the customer
    const draftInvoice = await stripe.invoices.create({
      customer: customer.id,
      collection_method: 'send_invoice',
      days_until_due: 7,
    });

    // 3. Create an invoice item and explicitly attach it to the draft invoice
    await stripe.invoiceItems.create({
      customer: customer.id,
      amount: therapist.price * 100, // Amount in pence
      currency: 'gbp',
      description: `Therapy session with ${therapist.name}`,
      invoice: draftInvoice.id, // Explicitly attach to the draft invoice
    });

    // 4. Finalize the invoice
    const invoice = await stripe.invoices.finalizeInvoice(draftInvoice.id);

    // 5. Return the hosted invoice URL
    return NextResponse.json({ invoiceUrl: invoice.hosted_invoice_url });

  } catch (error) {
    console.error('Stripe API Error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: `Failed to create invoice: ${errorMessage}` }, { status: 500 });
  }
}
