
"use client";

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
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input id="name" value="Pedro Duarte" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="card" className="text-right">
              Card Number
            </Label>
            <Input id="card" type="number" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="expiry" className="text-right">
              Expiry
            </Label>
            <Input id="expiry" placeholder="MM/YY" className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cvc" className="text-right">
              CVC
            </Label>
            <Input id="cvc" type="number" className="col-span-3" />
          </div>
        </div>
        <Button type="submit">Pay</Button>
      </DialogContent>
    </Dialog>
  );
}

