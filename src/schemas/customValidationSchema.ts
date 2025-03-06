import { z } from "zod";

// Helper for getting form values in validations that need context
export let formValues = {
  country: "",
};

// Custom credit card validation using Luhn algorithm
function validateCreditCard(cc: string): boolean {
  // Remove non-digit characters
  const digits = cc.replace(/\D/g, "");
  
  // Check if all digits and has valid length
  if (!/^\d{16}$/.test(digits)) return false;
  
  // Luhn algorithm
  let sum = 0;
  let double = false;
  
  // Starting from the right, double every second digit
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    double = !double;
  }
  
  // Valid if sum is divisible by 10
  return sum % 10 === 0;
}

// Password strength checker
function validatePasswordStrength(password: string): boolean {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

// Check for banned words (simplified content filter)
function containsBannedWords(text: string): boolean {
  const bannedWords = ["badword", "offensive", "inappropriate"];
  return bannedWords.some(word => text.toLowerCase().includes(word));
}

// Custom validation schema with refinements
export const customValidationSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .refine(validatePasswordStrength, {
      message: "Password must include uppercase, lowercase, number, and special character",
    }),
    
  email: z
    .string()
    .email({ message: "Please enter a valid email address" })
    .refine(
      (email) => !email.endsWith("tempmail.com"),
      {
        message: "Temporary email providers are not allowed",
      }
    ),
    
  age: z
    .number({
      required_error: "Age is required",
      invalid_type_error: "Age must be a number",
    })
    .min(18, { message: "You must be at least 18 years old" })
    .max(120, { message: "Age cannot exceed 120 years" }),
    
  website: z
    .string()
    .url({ message: "Please enter a valid URL" })
    .optional()
    .refine(
      (url) => !url || url.startsWith("https://"),
      {
        message: "URL must use HTTPS protocol",
      }
    ),
    
  creditCard: z
    .string()
    .regex(/^\d{16}$/, {
      message: "Credit card must be 16 digits",
    })
    .refine(validateCreditCard, {
      message: "Invalid credit card number",
    }),
    
  bio: z
    .string()
    .max(200, { message: "Bio cannot exceed 200 characters" })
    .refine(
      (bio) => !containsBannedWords(bio),
      {
        message: "Bio contains inappropriate content",
      }
    ),
    
  country: z.string().min(1, { message: "Country is required" }),
  
  zipCode: z
    .string()
    .refine(
      (zip) => {
        // Dynamic validation based on country
        const country = formValues.country;
        
        if (country === "United States") {
          return /^\d{5}(-\d{4})?$/.test(zip);
        } else if (country === "Canada") {
          return /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(zip);
        } else if (country === "United Kingdom") {
          return /^[A-Z]{1,2}\d[A-Z\d]? \d[A-Z]{2}$/.test(zip);
        }
        
        // Default check - just ensure it's not empty
        return zip.length > 0;
      },
      {
        message: "Please enter a valid postal/zip code for your country",
      }
    ),
    
  terms: z
    .boolean()
    .refine((val) => val === true, {
      message: "You must accept the terms and conditions",
    }),
});

// Form data type
export type CustomValidationFormData = z.infer<typeof customValidationSchema>;