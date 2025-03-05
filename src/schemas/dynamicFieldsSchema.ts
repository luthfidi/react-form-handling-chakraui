import { z } from "zod";

// Define field types available for dynamic generation
export const fieldTypeEnum = [
  "text",
  "number",
  "email",
  "tel",
  "date",
  "select",
  "checkbox",
  "textarea",
] as const;

// Define validation rules available for dynamic fields
export const validationRuleEnum = [
  "required",
  "min",
  "max",
  "email",
  "url",
  "pattern",
] as const;

// Schema for validation rule
const validationRuleSchema = z.object({
  type: z.enum(validationRuleEnum),
  value: z.union([z.string(), z.number(), z.boolean()]).optional(),
  message: z.string().optional(),
});

// Schema for select option
const selectOptionSchema = z.object({
  label: z.string(),
  value: z.string(),
});

// Schema for a dynamic field
export const dynamicFieldSchema = z.object({
  id: z.string(),
  name: z.string(),
  label: z.string(),
  type: z.enum(fieldTypeEnum),
  placeholder: z.string().optional(),
  defaultValue: z.union([z.string(), z.number(), z.boolean()]).optional(),
  options: z.array(selectOptionSchema).optional(),
  validationRules: z.array(validationRuleSchema).optional(),
});

// Schema for the form configuration
export const formConfigSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  fields: z.array(dynamicFieldSchema),
  submitButtonText: z.string().optional().default("Submit"),
});

// Type definitions
export type ValidationRule = z.infer<typeof validationRuleSchema>;
export type SelectOption = z.infer<typeof selectOptionSchema>;
export type DynamicField = z.infer<typeof dynamicFieldSchema>;
export type FormConfig = z.infer<typeof formConfigSchema>;

// Sample form configurations
export const contactFormConfig: FormConfig = {
  title: "Contact Form",
  description: "Please fill out the form below to get in touch with us.",
  fields: [
    {
      id: "name",
      name: "name",
      label: "Full Name",
      type: "text",
      placeholder: "Enter your full name",
      validationRules: [
        { type: "required", message: "Full name is required" },
        {
          type: "min",
          value: 2,
          message: "Name must be at least 2 characters",
        },
      ],
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email address",
      validationRules: [
        { type: "required", message: "Email is required" },
        { type: "email", message: "Please enter a valid email address" },
      ],
    },
    {
      id: "phone",
      name: "phone",
      label: "Phone Number",
      type: "tel",
      placeholder: "Enter your phone number",
      validationRules: [
        {
          type: "pattern",
          value: "^[0-9\\+\\-\\s]+$",
          message: "Please enter a valid phone number",
        },
      ],
    },
    {
      id: "subject",
      name: "subject",
      label: "Subject",
      type: "select",
      options: [
        { label: "General Inquiry", value: "general" },
        { label: "Support", value: "support" },
        { label: "Feedback", value: "feedback" },
        { label: "Other", value: "other" },
      ],
      validationRules: [{ type: "required", message: "Subject is required" }],
    },
    {
      id: "message",
      name: "message",
      label: "Message",
      type: "textarea",
      placeholder: "Enter your message here",
      validationRules: [
        { type: "required", message: "Message is required" },
        {
          type: "min",
          value: 10,
          message: "Message must be at least 10 characters",
        },
      ],
    },
    {
      id: "agreeToTerms",
      name: "agreeToTerms",
      label: "I agree to the terms and conditions",
      type: "checkbox",
      validationRules: [
        {
          type: "required",
          message: "You must agree to the terms and conditions",
        },
      ],
    },
  ],
  submitButtonText: "Send Message",
};

export const surveyFormConfig: FormConfig = {
  title: "Product Feedback Survey",
  description:
    "We value your feedback. Please take a moment to complete this survey.",
  fields: [
    {
      id: "customerName",
      name: "customerName",
      label: "Your Name",
      type: "text",
      placeholder: "John Doe",
      validationRules: [{ type: "required", message: "Name is required" }],
    },
    {
      id: "purchaseDate",
      name: "purchaseDate",
      label: "Date of Purchase",
      type: "date",
      validationRules: [
        { type: "required", message: "Purchase date is required" },
      ],
    },
    {
      id: "productRating",
      name: "productRating",
      label: "Product Rating",
      type: "select",
      options: [
        { label: "Excellent", value: "5" },
        { label: "Very Good", value: "4" },
        { label: "Good", value: "3" },
        { label: "Fair", value: "2" },
        { label: "Poor", value: "1" },
      ],
      validationRules: [
        { type: "required", message: "Product rating is required" },
      ],
    },
    {
      id: "wouldRecommend",
      name: "wouldRecommend",
      label: "Would you recommend this product to others?",
      type: "checkbox",
      defaultValue: false,
    },
    {
      id: "feedback",
      name: "feedback",
      label: "Additional Feedback",
      type: "textarea",
      placeholder: "Please share any additional feedback about our product",
      validationRules: [
        {
          type: "max",
          value: 500,
          message: "Feedback cannot exceed 500 characters",
        },
      ],
    },
  ],
  submitButtonText: "Submit Feedback",
};

export const eventRegistrationConfig: FormConfig = {
  title: "Event Registration",
  description: "Register for our upcoming event",
  fields: [
    {
      id: "firstName",
      name: "firstName",
      label: "First Name",
      type: "text",
      placeholder: "Enter your first name",
      validationRules: [
        { type: "required", message: "First name is required" },
      ],
    },
    {
      id: "lastName",
      name: "lastName",
      label: "Last Name",
      type: "text",
      placeholder: "Enter your last name",
      validationRules: [{ type: "required", message: "Last name is required" }],
    },
    {
      id: "email",
      name: "email",
      label: "Email Address",
      type: "email",
      placeholder: "Enter your email address",
      validationRules: [
        { type: "required", message: "Email is required" },
        { type: "email", message: "Please enter a valid email address" },
      ],
    },
    {
      id: "ticketType",
      name: "ticketType",
      label: "Ticket Type",
      type: "select",
      options: [
        { label: "General Admission", value: "general" },
        { label: "VIP", value: "vip" },
        { label: "Student", value: "student" },
      ],
      validationRules: [
        { type: "required", message: "Ticket type is required" },
      ],
    },
    {
      id: "dietaryRestrictions",
      name: "dietaryRestrictions",
      label: "Dietary Restrictions",
      type: "textarea",
      placeholder: "Please list any dietary restrictions",
    },
    {
      id: "agreeToTerms",
      name: "agreeToTerms",
      label: "I agree to the event terms and conditions",
      type: "checkbox",
      validationRules: [
        {
          type: "required",
          message: "You must agree to the terms and conditions",
        },
      ],
    },
  ],
  submitButtonText: "Register Now",
};

// Function to generate a Zod schema from dynamic field configuration
export function generateZodSchema(formConfig: FormConfig) {
  const schemaObject: Record<string, any> = {};

  formConfig.fields.forEach((field) => {
    let fieldSchema: any;

    // Start with appropriate base schema based on field type
    switch (field.type) {
      case "number":
        fieldSchema = z.number();
        break;
      case "checkbox":
        fieldSchema = z.boolean();
        break;
      default:
        fieldSchema = z.string();
    }

    // Apply validation rules
    if (field.validationRules) {
      field.validationRules.forEach((rule) => {
        switch (rule.type) {
          case "required":
            if (field.type === "checkbox") {
              fieldSchema = fieldSchema.refine((val: boolean) => val === true, {
                message: rule.message || "This field is required",
              });
            } else {
              fieldSchema = fieldSchema.min(
                1,
                rule.message || "This field is required"
              );
            }
            break;
          case "min":
            if (typeof rule.value === "number") {
              if (field.type === "number") {
                fieldSchema = fieldSchema.min(rule.value, rule.message);
              } else {
                fieldSchema = fieldSchema.min(rule.value, rule.message);
              }
            }
            break;
          case "max":
            if (typeof rule.value === "number") {
              if (field.type === "number") {
                fieldSchema = fieldSchema.max(rule.value, rule.message);
              } else {
                fieldSchema = fieldSchema.max(rule.value, rule.message);
              }
            }
            break;
          case "email":
            fieldSchema = fieldSchema.email(rule.message);
            break;
          case "url":
            fieldSchema = fieldSchema.url(rule.message);
            break;
          case "pattern":
            if (typeof rule.value === "string") {
              fieldSchema = fieldSchema.regex(
                new RegExp(rule.value),
                rule.message
              );
            }
            break;
        }
      });
    }

    // Make field optional if not required
    const isRequired = field.validationRules?.some(
      (rule) => rule.type === "required"
    );
    if (!isRequired) {
      if (field.type === "checkbox") {
        fieldSchema = fieldSchema.optional().default(false);
      } else {
        fieldSchema = fieldSchema.optional();
      }
    }

    schemaObject[field.name] = fieldSchema;
  });

  return z.object(schemaObject);
}

// Helper function to create a default values object from form config
export function createDefaultValues(formConfig: FormConfig) {
  const defaultValues: Record<string, any> = {};

  formConfig.fields.forEach((field) => {
    if (field.defaultValue !== undefined) {
      defaultValues[field.name] = field.defaultValue;
    } else {
      // Set appropriate default based on field type
      switch (field.type) {
        case "number":
          defaultValues[field.name] = null;
          break;
        case "checkbox":
          defaultValues[field.name] = false;
          break;
        case "select":
          defaultValues[field.name] =
            field.options && field.options.length > 0
              ? field.options[0].value
              : "";
          break;
        default:
          defaultValues[field.name] = "";
      }
    }
  });

  return defaultValues;
}
