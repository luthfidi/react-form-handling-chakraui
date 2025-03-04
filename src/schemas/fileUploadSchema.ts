import { z } from 'zod'

// Maximum file size (in bytes)
const MAX_FILE_SIZE = 5 * 1024 * 1024 // 5MB

// Allowed file types
const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg', 
  'image/jpg', 
  'image/png', 
  'image/webp',
  'image/gif'
]

const ACCEPTED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
  'text/plain'
]

// File validation schema
const fileSchema = z.object({
  name: z.string().min(1, { message: "File name is required" }),
  size: z.number().max(MAX_FILE_SIZE, { message: `File size must be less than 5MB` }),
  type: z.string().refine(
    (type) => [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES].includes(type),
    { message: "File type not supported" }
  ),
})

// Image validation schema (extending the file schema)
const imageSchema = fileSchema.extend({
  type: z.enum(ACCEPTED_IMAGE_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "Please upload a valid image file (JPEG, PNG, WebP, or GIF)" }),
  }),
  // We could add image-specific validations here, like dimensions
})

// Document validation schema (extending the file schema)
const documentSchema = fileSchema.extend({
  type: z.enum(ACCEPTED_DOCUMENT_TYPES as [string, ...string[]], {
    errorMap: () => ({ message: "Please upload a valid document file (PDF, Word, Excel, or TXT)" }),
  }),
})

// File upload form schema
export const fileUploadSchema = z.object({
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  
  // Single file uploads
  profileImage: imageSchema.optional(),
  resume: documentSchema.optional(),
  
  // Multiple file uploads
  portfolioImages: z.array(imageSchema)
    .max(5, { message: "You can upload up to 5 portfolio images" })
    .optional(),
  
  additionalDocuments: z.array(documentSchema)
    .max(3, { message: "You can upload up to 3 additional documents" })
    .optional(),
  
  // Agreement
  termsAccepted: z.boolean().refine(val => val === true, {
    message: "You must accept the terms and conditions",
  }),
})

// TypeScript Types
export type FileSchema = z.infer<typeof fileSchema>
export type ImageSchema = z.infer<typeof imageSchema>
export type DocumentSchema = z.infer<typeof documentSchema>
export type FileUploadFormData = z.infer<typeof fileUploadSchema>

// Constants for export
export const maxFileSize = MAX_FILE_SIZE
export const acceptedImageTypes = ACCEPTED_IMAGE_TYPES
export const acceptedDocumentTypes = ACCEPTED_DOCUMENT_TYPES