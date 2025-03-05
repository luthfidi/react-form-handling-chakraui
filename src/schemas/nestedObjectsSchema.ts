import { z } from "zod";

// Basic Information Schema
const basicInfoSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
});

// Address Schema
const addressSchema = z.object({
  street: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State/Province is required" }),
  zipCode: z.string().min(1, { message: "ZIP/Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
});

// Payment Method Schemas
const creditCardSchema = z.object({
  cardNumber: z
    .string()
    .min(1, { message: "Card number is required" })
    .regex(/^[0-9]{16}$/, {
      message: "Please enter a valid 16-digit card number",
    }),
  cardholderName: z.string().min(1, { message: "Cardholder name is required" }),
  expiryDate: z
    .string()
    .min(1, { message: "Expiry date is required" })
    .regex(/^(0[1-9]|1[0-2])\/?([0-9]{2})$/, {
      message: "Please enter a valid expiry date (MM/YY)",
    }),
  cvv: z
    .string()
    .min(1, { message: "CVV is required" })
    .regex(/^[0-9]{3,4}$/, { message: "Please enter a valid CVV" }),
  saveCard: z.boolean().default(false),
});

const paypalSchema = z.object({
  email: z
    .string()
    .email({ message: "Please enter a valid PayPal email address" }),
});

const bankTransferSchema = z.object({
  accountNumber: z.string().min(1, { message: "Account number is required" }),
  routingNumber: z.string().min(1, { message: "Routing number is required" }),
  accountName: z.string().min(1, { message: "Account name is required" }),
  bankName: z.string().min(1, { message: "Bank name is required" }),
});

// Payment Schema (with conditional fields based on payment method)
const paymentSchema = z
  .object({
    method: z.enum(["creditCard", "paypal", "bankTransfer"]),
    creditCard: creditCardSchema,
    paypal: paypalSchema,
    bankTransfer: bankTransferSchema,
  })
  .refine(
    (data) => {
      if (data.method === "creditCard") {
        return (
          data.creditCard.cardNumber &&
          data.creditCard.cardholderName &&
          data.creditCard.expiryDate &&
          data.creditCard.cvv
        );
      }
      return true;
    },
    {
      message: "Please fill in all credit card details",
      path: ["creditCard"],
    }
  )
  .refine(
    (data) => {
      if (data.method === "paypal") {
        return !!data.paypal.email;
      }
      return true;
    },
    {
      message: "PayPal email is required",
      path: ["paypal.email"],
    }
  )
  .refine(
    (data) => {
      if (data.method === "bankTransfer") {
        return (
          data.bankTransfer.accountNumber &&
          data.bankTransfer.routingNumber &&
          data.bankTransfer.accountName &&
          data.bankTransfer.bankName
        );
      }
      return true;
    },
    {
      message: "Please fill in all bank transfer details",
      path: ["bankTransfer"],
    }
  );

// Subscription Schema
const billingSchema = z.object({
  cycle: z.enum(["monthly", "quarterly", "annual"]),
  autoRenew: z.boolean().default(true),
});

const notificationsSchema = z.object({
  email: z.boolean().default(true),
  sms: z.boolean().default(false),
  promotions: z.boolean().default(false),
});

const subscriptionSchema = z.object({
  plan: z.enum(["basic", "premium", "enterprise"]),
  billing: billingSchema,
  notifications: notificationsSchema,
});

// Main Form Schema
export const nestedObjectsSchema = z.object({
  basicInfo: basicInfoSchema,
  address: addressSchema,
  payment: paymentSchema,
  subscription: subscriptionSchema,
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// TypeScript Types
export type BasicInfoType = z.infer<typeof basicInfoSchema>;
export type AddressType = z.infer<typeof addressSchema>;
export type CreditCardType = z.infer<typeof creditCardSchema>;
export type PaypalType = z.infer<typeof paypalSchema>;
export type BankTransferType = z.infer<typeof bankTransferSchema>;
export type PaymentType = z.infer<typeof paymentSchema>;
export type BillingType = z.infer<typeof billingSchema>;
export type NotificationsType = z.infer<typeof notificationsSchema>;
export type SubscriptionType = z.infer<typeof subscriptionSchema>;
export type NestedObjectsFormData = z.infer<typeof nestedObjectsSchema>;
