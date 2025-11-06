import { PaymentForm } from "@/components/PaymentForm";
import Link from "next/link";

export default function PaymentPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center pt-24">
      <Link href="/" className="absolute top-8 left-8 text-blue-500 hover:underline">
        &larr; Back to Therapists
      </Link>
      <h1 className="text-4xl font-bold mb-8">Make a Payment</h1>
      <PaymentForm />
    </main>
  );
}
