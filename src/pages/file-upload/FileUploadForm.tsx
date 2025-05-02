import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  VStack,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
  Heading,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Checkbox,
  SimpleGrid,
} from "@chakra-ui/react";
import { FaFileUpload } from "react-icons/fa";
import FormPageLayout from "../../components/layout/FormPageLayout";
import CodeBlock from "../../components/ui/CodeBlock";
import {
  fileUploadSchema,
  type FileUploadFormData,
  acceptedImageTypes,
  acceptedDocumentTypes,
  maxFileSize,
} from "../../schemas/fileUploadSchema";
import SingleFileUpload from "./components/SingleFileUpload";
import MultiFileUpload from "./components/MultiFileUpload";
import {
  mockFileObject,
  fileUploadFormSampleData,
} from "../../utils/SampleData";

export default function FileUploadForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [formSummary, setFormSummary] = useState<any>(null);
  const successAlertRef = useRef<HTMLDivElement>(null);
  const fillWithSampleData = () => {
    // Basic fields - as any to bypass type checking temporarily
    reset({
      title: fileUploadFormSampleData.title,
      description: fileUploadFormSampleData.description,
      termsAccepted: fileUploadFormSampleData.termsAccepted,
    } as any);

    // Special handling for files - avoid type errors with safe checks
    if (fileUploadFormSampleData.mockFiles) {
      const { mockFiles } = fileUploadFormSampleData;

      // Set profile image if available
      if (mockFiles.profileImage) {
        setValue("profileImage", mockFiles.profileImage as any);
      }

      // Set resume if available
      if (mockFiles.resume) {
        setValue("resume", mockFiles.resume as any);
      }

      // Set portfolio images if available
      if (mockFiles.portfolioImages && mockFiles.portfolioImages.length > 0) {
        setValue("portfolioImages", mockFiles.portfolioImages as any);
      }

      // Set additional documents if available
      if (
        mockFiles.additionalDocuments &&
        mockFiles.additionalDocuments.length > 0
      ) {
        setValue("additionalDocuments", mockFiles.additionalDocuments as any);
      }
    }
  };

  // Color modes
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const successBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<FileUploadFormData>({
    resolver: zodResolver(fileUploadSchema),
    defaultValues: {
      title: "",
      description: "",
      portfolioImages: [],
      additionalDocuments: [],
      termsAccepted: false,
    },
  });

  const onSubmit = (data: FileUploadFormData) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Form submitted successfully:", data);

        // Create a summary of the files
        const summary = {
          title: data.title,
          description: data.description,
          profileImage: data.profileImage
            ? {
                name: data.profileImage.name,
                size: data.profileImage.size,
                type: data.profileImage.type,
              }
            : null,
          resume: data.resume
            ? {
                name: data.resume.name,
                size: data.resume.size,
                type: data.resume.type,
              }
            : null,
          portfolioImages: data.portfolioImages
            ? data.portfolioImages.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
              }))
            : [],
          additionalDocuments: data.additionalDocuments
            ? data.additionalDocuments.map((file) => ({
                name: file.name,
                size: file.size,
                type: file.type,
              }))
            : [],
        };

        setFormSummary(summary);
        setIsSubmitSuccessful(true);
        resolve();

        // Scroll to success alert
        setTimeout(() => {
          if (successAlertRef.current) {
            successAlertRef.current.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);

        // Hide success message after 10 seconds
        setTimeout(() => setIsSubmitSuccessful(false), 10000);
      }, 1500);
    });
  };

  // Code examples as constants
  const zodSchemaCode = `import { z } from 'zod'

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
  // ... other document types
]

// File validation schema
const fileSchema = z.object({
  name: z.string().min(1, { message: "File name is required" }),
  size: z.number().max(MAX_FILE_SIZE, { message: \`File size must be less than 5MB\` }),
  type: z.string().refine(
    (type) => [...ACCEPTED_IMAGE_TYPES, ...ACCEPTED_DOCUMENT_TYPES].includes(type),
    { message: "File type not supported" }
  ),
})

// Image validation schema
const imageSchema = fileSchema.extend({
  type: z.enum(ACCEPTED_IMAGE_TYPES as [string, ...string[]]),
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
  
  termsAccepted: z.boolean().refine(val => val === true),
})`;

  const fileUploadComponentCode = `const SingleFileUpload = ({ name, control, accept, maxSize }) => {
  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
  })
  
  // Handle file selection and validation
  const handleFile = (file: File) => {
    // Check file type
    if (!accept.includes(file.type)) {
      // Invalid file type
      return
    }
    
    // Check file size
    if (file.size > maxSize) {
      // File too large
      return
    }
    
    onChange(file)
  }
  
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>Upload File</FormLabel>
      
      {!value ? (
        <Box
          border="2px dashed"
          borderRadius="md"
          textAlign="center"
          cursor="pointer"
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
        >
          <Input
            type="file"
            accept={accept}
            onChange={handleChange}
            display="none"
          />
          <Text>Drag and drop or click to browse</Text>
        </Box>
      ) : (
        <Box>
          <Text>{value.name}</Text>
          <Button onClick={() => onChange(null)}>Remove</Button>
        </Box>
      )}
      
      {error && (
        <FormErrorMessage>{error.message}</FormErrorMessage>
      )}
    </FormControl>
  )
}`;

  return (
    <FormPageLayout
      title="File Upload Validation"
      description="Implement file uploads with comprehensive validation for file type, size, and count limitations."
      icon={FaFileUpload}
      difficulty="Advanced"
    >
      <Tabs variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab fontWeight="medium">Form Demo</Tab>
          <Tab fontWeight="medium">Code Example</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <VStack spacing={8} w="full" py={5}>
              {isSubmitSuccessful && (
                <Alert
                  ref={successAlertRef}
                  status="success"
                  variant="subtle"
                  flexDirection="column"
                  alignItems="center"
                  justifyContent="center"
                  textAlign="center"
                  borderRadius="md"
                  p={6}
                  bg={successBg}
                >
                  <AlertIcon boxSize="40px" mr={0} />
                  <AlertTitle mt={4} mb={1} fontSize="lg">
                    Files Uploaded Successfully!
                  </AlertTitle>
                  <AlertDescription maxWidth="sm" color={textColor}>
                    Your files have been uploaded successfully.
                  </AlertDescription>

                  {formSummary && (
                    <Box
                      mt={4}
                      p={3}
                      bg={cardBg}
                      rounded="md"
                      width="full"
                      textAlign="left"
                      borderWidth="1px"
                      borderColor={cardBorder}
                    >
                      <Text fontWeight="bold" mb={2}>
                        Submission Summary:
                      </Text>
                      <CodeBlock
                        code={JSON.stringify(formSummary, null, 2)}
                        language="json"
                        showLineNumbers={false}
                      />
                    </Box>
                  )}

                  <CloseButton
                    position="absolute"
                    right="8px"
                    top="8px"
                    onClick={() => setIsSubmitSuccessful(false)}
                  />
                </Alert>
              )}

              <Box
                as="form"
                onSubmit={handleSubmit(onSubmit)}
                rounded="xl"
                bg={cardBg}
                boxShadow="xl"
                p={8}
                w="full"
                maxW="800px"
                mx="auto"
                borderWidth="1px"
                borderColor={cardBorder}
              >
                <VStack spacing={8} align="stretch">
                  <Heading size="md" color={textColor}>
                    Project Information
                  </Heading>

                  <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6}>
                    <FormControl isInvalid={!!errors.title} isRequired>
                      <FormLabel htmlFor="title" color={textColor}>
                        Project Title
                      </FormLabel>
                      <Input
                        id="title"
                        placeholder="Enter your project title"
                        {...register("title")}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                        }}
                      />
                      {errors.title && (
                        <FormErrorMessage>
                          {errors.title.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.description} isRequired>
                      <FormLabel htmlFor="description" color={textColor}>
                        Project Description
                      </FormLabel>
                      <Textarea
                        id="description"
                        placeholder="Describe your project"
                        rows={4}
                        {...register("description")}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                        }}
                      />
                      {errors.description && (
                        <FormErrorMessage>
                          {errors.description.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </SimpleGrid>

                  <Divider />

                  <Heading size="md" color={textColor}>
                    Profile & Resume
                  </Heading>
                  <Text fontSize="sm" color={mutedTextColor} mt="-4">
                    Upload a profile picture and your resume document
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <SingleFileUpload
                      name="profileImage"
                      label="Profile Picture"
                      accept={acceptedImageTypes.join(",")}
                      maxSize={maxFileSize}
                      control={control}
                      helperText="Upload a profile image (JPG, PNG, WebP, GIF)"
                    />

                    <SingleFileUpload
                      name="resume"
                      label="Resume / CV"
                      accept={acceptedDocumentTypes.join(",")}
                      maxSize={maxFileSize}
                      control={control}
                      helperText="Upload your resume (PDF, DOC, DOCX)"
                    />
                  </SimpleGrid>

                  <Divider />

                  <Heading size="md" color={textColor}>
                    Portfolio & Additional Documents
                  </Heading>
                  <Text fontSize="sm" color={mutedTextColor} mt="-4">
                    Upload multiple portfolio images and supporting documents
                  </Text>

                  <SimpleGrid columns={{ base: 1, md: 1 }} spacing={6}>
                    <MultiFileUpload
                      name="portfolioImages"
                      label="Portfolio Images"
                      accept={acceptedImageTypes.join(",")}
                      maxSize={maxFileSize}
                      maxFiles={5}
                      control={control}
                      helperText="Upload up to 5 portfolio images (JPG, PNG, WebP, GIF)"
                    />

                    <MultiFileUpload
                      name="additionalDocuments"
                      label="Additional Documents"
                      accept={acceptedDocumentTypes.join(",")}
                      maxSize={maxFileSize}
                      maxFiles={3}
                      control={control}
                      helperText="Upload up to 3 additional documents (PDF, DOC, DOCX, XLS, XLSX, TXT)"
                    />
                  </SimpleGrid>

                  <Divider />

                  <FormControl isInvalid={!!errors.termsAccepted} isRequired>
                    <Checkbox
                      id="termsAccepted"
                      colorScheme="brand"
                      {...register("termsAccepted")}
                    >
                      <Text fontSize="sm" color={textColor}>
                        I accept the terms and conditions and confirm that all
                        uploaded files are my own work.
                      </Text>
                    </Checkbox>
                    {errors.termsAccepted && (
                      <FormErrorMessage>
                        {errors.termsAccepted.message}
                      </FormErrorMessage>
                    )}
                  </FormControl>

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    isLoading={isSubmitting}
                    leftIcon={<FaFileUpload />}
                    mt={4}
                  >
                    Submit Files
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          <TabPanel>
            <VStack spacing={6} align="stretch" py={5}>
              <Box>
                <Heading size="md" mb={4} color={textColor}>
                  1. Zod Schema for File Validation
                </Heading>
                <Text mb={4} color={mutedTextColor}>
                  Create a robust validation schema for file uploads using Zod.
                  This schema validates file types, sizes, and counts.
                </Text>
                <Box
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <CodeBlock code={zodSchemaCode} language="typescript" />
                </Box>
              </Box>

              <Box>
                <Heading size="md" mb={4} color={textColor}>
                  2. File Upload Component
                </Heading>
                <Text mb={4} color={mutedTextColor}>
                  Create reusable file upload components that integrate with
                  React Hook Form and provide drag-and-drop functionality.
                </Text>
                <Box
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <CodeBlock
                    code={fileUploadComponentCode}
                    language="typescript"
                  />
                </Box>
              </Box>

              <Box>
                <Heading size="md" mb={4} color={textColor}>
                  3. Implementation Notes
                </Heading>
                <VStack align="stretch" spacing={4} color={mutedTextColor}>
                  <Text>
                    • File validation happens in both the UI (preventing invalid
                    uploads) and with Zod (server-side validation).
                  </Text>
                  <Text>
                    • For production, you'd use a file storage service like AWS
                    S3, Firebase Storage, or a similar solution.
                  </Text>
                  <Text>
                    • Consider adding a progress indicator for large file
                    uploads and handling network errors gracefully.
                  </Text>
                  <Text>
                    • For security, always validate files on the server as well,
                    as client-side validation can be bypassed.
                  </Text>
                  <Text>
                    • Consider adding image preview functionality for image
                    uploads.
                  </Text>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </FormPageLayout>
  );
}
