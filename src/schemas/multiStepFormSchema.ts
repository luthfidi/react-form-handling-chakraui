import { z } from 'zod'

// Step 1: Personal Information
export const personalInfoSchema = z.object({
  firstName: z
    .string()
    .min(2, { message: 'First name must be at least 2 characters' })
    .max(50, { message: 'First name must not exceed 50 characters' }),
  lastName: z
    .string()
    .min(2, { message: 'Last name must be at least 2 characters' })
    .max(50, { message: 'Last name must not exceed 50 characters' }),
  email: z
    .string()
    .email({ message: 'Please enter a valid email address' }),
  phone: z
    .string()
    .min(10, { message: 'Phone number must be at least 10 digits' })
    .regex(/^\+?[0-9\s\-()]+$/, { 
      message: 'Phone number can only contain digits, spaces, and the characters: +()-' 
    }),
})

// Step 2: Address Information
export const addressSchema = z.object({
  street: z
    .string()
    .min(5, { message: 'Street address must be at least 5 characters' })
    .max(100, { message: 'Street address must not exceed 100 characters' }),
  city: z
    .string()
    .min(2, { message: 'City must be at least 2 characters' })
    .max(50, { message: 'City must not exceed 50 characters' }),
  state: z
    .string()
    .min(2, { message: 'State must be at least 2 characters' })
    .max(50, { message: 'State must not exceed 50 characters' }),
  zipCode: z
    .string()
    .regex(/^\d{5}(-\d{4})?$/, { message: 'Please enter a valid ZIP code (e.g., 12345 or 12345-6789)' }),
  country: z
    .string()
    .min(2, { message: 'Country must be at least 2 characters' })
    .max(50, { message: 'Country must not exceed 50 characters' }),
})

// Step 3: Account Information
export const accountSchema = z.object({
  username: z
    .string()
    .min(4, { message: 'Username must be at least 4 characters' })
    .max(20, { message: 'Username must not exceed 20 characters' })
    .regex(/^[a-zA-Z0-9_]+$/, { message: 'Username can only contain letters, numbers, and underscores' }),
  password: z
    .string()
    .min(8, { message: 'Password must be at least 8 characters' })
    .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
    .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
    .regex(/[0-9]/, { message: 'Password must contain at least one number' })
    .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
  confirmPassword: z
    .string(),
  termsAccepted: z
    .boolean()
    .refine(val => val === true, { message: 'You must accept the terms and conditions' }),
})
.refine(data => data.password === data.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
})

// Complete Form Schema (combining all steps)
export const multiStepFormSchema = z.object({
  personalInfo: personalInfoSchema,
  address: addressSchema,
  account: accountSchema,
})

export type PersonalInfoData = z.infer<typeof personalInfoSchema>
export type AddressData = z.infer<typeof addressSchema>
export type AccountData = z.infer<typeof accountSchema>
export type MultiStepFormData = z.infer<typeof multiStepFormSchema>