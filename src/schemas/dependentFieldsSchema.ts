import { z } from "zod";

// Employment Type Enum
export const employmentTypeEnum = [
  "employed",
  "self-employed",
  "student",
  "unemployed",
  "retired",
] as const;

// Product Type Enum
export const productTypeEnum = ["physical", "digital", "subscription"] as const;

// Base Schema
export const dependentFieldsSchema = z
  .object({
    // Personal Information
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name must not exceed 50 characters" }),
    email: z.string().email({ message: "Please enter a valid email address" }),

    // Employment Information
    employmentType: z.enum(employmentTypeEnum, {
      errorMap: () => ({ message: "Please select a valid employment type" }),
    }),

    // Conditional fields based on employment status
    // These will be refined later based on employment type
    companyName: z.string().optional(),
    position: z.string().optional(),
    businessName: z.string().optional(),
    businessType: z.string().optional(),
    schoolName: z.string().optional(),
    degree: z.string().optional(),
    previousEmployer: z.string().optional(),

    // Product Selection
    productType: z.enum(productTypeEnum, {
      errorMap: () => ({ message: "Please select a valid product type" }),
    }),

    // Conditional fields based on product type
    // These will be refined later based on product type
    shippingAddress: z.string().optional(),
    downloadPreference: z.string().optional(),
    billingCycle: z.string().optional(),

    // Agreement
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
  })
  .refine(
    (data) => {
      // If employed, company name and position are required
      if (data.employmentType === "employed") {
        return !!data.companyName && !!data.position;
      }
      return true;
    },
    {
      message:
        "Company name and position are required for employed individuals",
      path: ["companyName"],
    }
  )
  .refine(
    (data) => {
      // If self-employed, business name and type are required
      if (data.employmentType === "self-employed") {
        return !!data.businessName && !!data.businessType;
      }
      return true;
    },
    {
      message:
        "Business name and type are required for self-employed individuals",
      path: ["businessName"],
    }
  )
  .refine(
    (data) => {
      // If student, school name and degree are required
      if (data.employmentType === "student") {
        return !!data.schoolName && !!data.degree;
      }
      return true;
    },
    {
      message: "School name and degree are required for students",
      path: ["schoolName"],
    }
  )
  .refine(
    (data) => {
      // If physical product, shipping address is required
      if (data.productType === "physical") {
        return !!data.shippingAddress;
      }
      return true;
    },
    {
      message: "Shipping address is required for physical products",
      path: ["shippingAddress"],
    }
  )
  .refine(
    (data) => {
      // If digital product, download preference is required
      if (data.productType === "digital") {
        return !!data.downloadPreference;
      }
      return true;
    },
    {
      message: "Download preference is required for digital products",
      path: ["downloadPreference"],
    }
  )
  .refine(
    (data) => {
      // If subscription, billing cycle is required
      if (data.productType === "subscription") {
        return !!data.billingCycle;
      }
      return true;
    },
    {
      message: "Billing cycle is required for subscription products",
      path: ["billingCycle"],
    }
  );

export type DependentFieldsFormData = z.infer<typeof dependentFieldsSchema>;
