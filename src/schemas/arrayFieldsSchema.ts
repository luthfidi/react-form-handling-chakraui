import { z } from "zod";

// Experience Item Schema
const experienceItemSchema = z.object({
  company: z
    .string()
    .min(1, { message: "Company name is required" })
    .max(100, { message: "Company name must not exceed 100 characters" }),
  position: z
    .string()
    .min(1, { message: "Position is required" })
    .max(100, { message: "Position must not exceed 100 characters" }),
  startDate: z.string().min(1, { message: "Start date is required" }),
  endDate: z.string().nullable().optional(),
  current: z.boolean().default(false),
  description: z
    .string()
    .max(500, { message: "Description must not exceed 500 characters" })
    .optional(),
});

// Education Item Schema
const educationItemSchema = z.object({
  institution: z
    .string()
    .min(1, { message: "Institution name is required" })
    .max(100, { message: "Institution name must not exceed 100 characters" }),
  degree: z
    .string()
    .min(1, { message: "Degree is required" })
    .max(100, { message: "Degree must not exceed 100 characters" }),
  fieldOfStudy: z
    .string()
    .min(1, { message: "Field of study is required" })
    .max(100, { message: "Field of study must not exceed 100 characters" }),
  graduationDate: z.string().min(1, { message: "Graduation date is required" }),
});

// Skill Item Schema
const skillItemSchema = z.object({
  name: z
    .string()
    .min(1, { message: "Skill name is required" })
    .max(50, { message: "Skill name must not exceed 50 characters" }),
  level: z.enum(["beginner", "intermediate", "advanced", "expert"], {
    errorMap: () => ({ message: "Please select a valid skill level" }),
  }),
});

// Main Resume Schema
export const arrayFieldsSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: "First name is required" })
    .max(50, { message: "First name must not exceed 50 characters" }),
  lastName: z
    .string()
    .min(1, { message: "Last name is required" })
    .max(50, { message: "Last name must not exceed 50 characters" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z
    .string()
    .min(10, { message: "Please enter a valid phone number" })
    .max(20, { message: "Phone number must not exceed 20 characters" }),

  // Arrays of items
  experience: z
    .array(experienceItemSchema)
    .min(1, { message: "Please add at least one work experience" }),

  education: z
    .array(educationItemSchema)
    .min(1, { message: "Please add at least one education entry" }),

  skills: z
    .array(skillItemSchema)
    .max(10, { message: "You can add up to 10 skills" }),
});

// Types
export type ExperienceItem = z.infer<typeof experienceItemSchema>;
export type EducationItem = z.infer<typeof educationItemSchema>;
export type SkillItem = z.infer<typeof skillItemSchema>;
export type ArrayFieldsFormData = z.infer<typeof arrayFieldsSchema>;

// Default empty items for new entries
export const emptyExperience: ExperienceItem = {
  company: "",
  position: "",
  startDate: "",
  endDate: "",
  current: false,
  description: "",
};

export const emptyEducation: EducationItem = {
  institution: "",
  degree: "",
  fieldOfStudy: "",
  graduationDate: "",
};

export const emptySkill: SkillItem = {
  name: "",
  level: "intermediate",
};
