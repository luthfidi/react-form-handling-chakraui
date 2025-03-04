import { useState, useRef } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Input,
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
  SimpleGrid,
} from "@chakra-ui/react";
import { AddIcon } from "@chakra-ui/icons";
import { FaListUl } from "react-icons/fa";
import FormPageLayout from "../../components/layout/FormPageLayout";
import CodeBlock from "../../components/ui/CodeBlock";
import {
  arrayFieldsSchema,
  type ArrayFieldsFormData,
  emptyExperience,
  emptyEducation,
  emptySkill,
} from "../../schemas/arrayFieldsSchema";
import ExperienceItem from "./components/ExperienceItem";
import EducationItem from "./components/EducationItem";
import SkillItem from "./components/SkillItem";

export default function ArrayFieldsForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [formData, setFormData] = useState<ArrayFieldsFormData | null>(null);
  const successAlertRef = useRef<HTMLDivElement>(null);

  // Color modes
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const successBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const sectionBg = useColorModeValue("gray.50", "gray.700");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ArrayFieldsFormData>({
    resolver: zodResolver(arrayFieldsSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      experience: [{ ...emptyExperience }],
      education: [{ ...emptyEducation }],
      skills: [],
    },
  });

  // Field arrays for managing collections
  const {
    fields: experienceFields,
    append: appendExperience,
    remove: removeExperience,
  } = useFieldArray({
    control,
    name: "experience",
  });

  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: skillFields,
    append: appendSkill,
    remove: removeSkill,
  } = useFieldArray({
    control,
    name: "skills",
  });

  const onSubmit = (data: ArrayFieldsFormData) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Form submitted successfully:", data);
        setFormData(data);
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

// Experience Item Schema
const experienceItemSchema = z.object({
  company: z.string().min(1, { message: 'Company name is required' }),
  position: z.string().min(1, { message: 'Position is required' }),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  endDate: z.string().nullable().optional(),
  current: z.boolean().default(false),
  description: z.string().max(500).optional(),
})

// Main Resume Schema
export const arrayFieldsSchema = z.object({
  firstName: z.string().min(1, { message: 'First name is required' }),
  lastName: z.string().min(1, { message: 'Last name is required' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  // Other basic fields...
  
  // Arrays of items
  experience: z
    .array(experienceItemSchema)
    .min(1, { message: 'Please add at least one work experience' }),
  
  education: z
    .array(educationItemSchema)
    .min(1, { message: 'Please add at least one education entry' }),
  
  skills: z
    .array(skillItemSchema)
    .max(10, { message: 'You can add up to 10 skills' }),
})`;

  const reactHookFormCode = `// Setup React Hook Form with useFieldArray
const {
  register,
  handleSubmit,
  control,
  formState: { errors },
} = useForm<ArrayFieldsFormData>({
  resolver: zodResolver(arrayFieldsSchema),
  defaultValues: {
    // Default values including empty arrays or arrays with initial items
    experience: [{ ...emptyExperience }],
    education: [{ ...emptyEducation }],
    skills: [],
  },
})

// Field arrays for managing collections
const { 
  fields: experienceFields, 
  append: appendExperience, 
  remove: removeExperience 
} = useFieldArray({
  control,
  name: 'experience',
})

// In JSX:
{experienceFields.map((field, index) => (
  <ExperienceItem
    key={field.id}
    index={index}
    register={register}
    control={control}
    onRemove={() => removeExperience(index)}
    isRemoveDisabled={experienceFields.length <= 1}
  />
))}

<Button
  leftIcon={<AddIcon />}
  onClick={() => appendExperience({ ...emptyExperience })}
  size="sm"
>
  Add Experience
</Button>`;

  return (
    <FormPageLayout
      title="Array Field Management"
      description="Handle dynamic arrays of fields with add/remove functionality - perfect for managing lists of items."
      icon={FaListUl}
      difficulty="Intermediate"
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
                    Resume Submitted Successfully!
                  </AlertTitle>
                  <AlertDescription maxWidth="sm" color={textColor}>
                    Your resume information has been submitted successfully.
                  </AlertDescription>

                  {formData && (
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
                        Submitted Data:
                      </Text>
                      <CodeBlock
                        code={JSON.stringify(formData, null, 2)}
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
                    Personal Information
                  </Heading>

                  <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                    <FormControl isInvalid={!!errors.firstName} isRequired>
                      <FormLabel htmlFor="firstName" color={textColor}>
                        First Name
                      </FormLabel>
                      <Input
                        id="firstName"
                        placeholder="Enter your first name"
                        {...register("firstName")}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                        }}
                      />
                      {errors.firstName && (
                        <FormErrorMessage>
                          {errors.firstName.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.lastName} isRequired>
                      <FormLabel htmlFor="lastName" color={textColor}>
                        Last Name
                      </FormLabel>
                      <Input
                        id="lastName"
                        placeholder="Enter your last name"
                        {...register("lastName")}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                        }}
                      />
                      {errors.lastName && (
                        <FormErrorMessage>
                          {errors.lastName.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.email} isRequired>
                      <FormLabel htmlFor="email" color={textColor}>
                        Email
                      </FormLabel>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your email"
                        {...register("email")}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                        }}
                      />
                      {errors.email && (
                        <FormErrorMessage>
                          {errors.email.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.phone} isRequired>
                      <FormLabel htmlFor="phone" color={textColor}>
                        Phone
                      </FormLabel>
                      <Input
                        id="phone"
                        placeholder="Enter your phone number"
                        {...register("phone")}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                        }}
                      />
                      {errors.phone && (
                        <FormErrorMessage>
                          {errors.phone.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
                  </SimpleGrid>

                  <Divider />

                  {/* Work Experience Section */}
                  <Box>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb={4}
                    >
                      <Heading size="md" color={textColor}>
                        Work Experience
                      </Heading>
                      <Button
                        leftIcon={<AddIcon />}
                        onClick={() => appendExperience({ ...emptyExperience })}
                        size="sm"
                        colorScheme="brand"
                        variant="outline"
                      >
                        Add Experience
                      </Button>
                    </Flex>

                    {errors.experience &&
                      typeof errors.experience === "object" &&
                      "message" in errors.experience && (
                        <FormErrorMessage mb={4}>
                          {errors.experience.message as string}
                        </FormErrorMessage>
                      )}

                    <VStack spacing={4} align="stretch">
                      {experienceFields.map((field, index) => (
                        <ExperienceItem
                          key={field.id}
                          index={index}
                          register={register}
                          control={control}
                          onRemove={() => removeExperience(index)}
                          isRemoveDisabled={experienceFields.length <= 1}
                        />
                      ))}
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Education Section */}
                  <Box>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb={4}
                    >
                      <Heading size="md" color={textColor}>
                        Education
                      </Heading>
                      <Button
                        leftIcon={<AddIcon />}
                        onClick={() => appendEducation({ ...emptyEducation })}
                        size="sm"
                        colorScheme="brand"
                        variant="outline"
                      >
                        Add Education
                      </Button>
                    </Flex>

                    {errors.education &&
                      typeof errors.education === "object" &&
                      "message" in errors.education && (
                        <FormErrorMessage mb={4}>
                          {errors.education.message as string}
                        </FormErrorMessage>
                      )}

                    <VStack spacing={4} align="stretch">
                      {educationFields.map((field, index) => (
                        <EducationItem
                          key={field.id}
                          index={index}
                          register={register}
                          control={control}
                          onRemove={() => removeEducation(index)}
                          isRemoveDisabled={educationFields.length <= 1}
                        />
                      ))}
                    </VStack>
                  </Box>

                  <Divider />

                  {/* Skills Section */}
                  <Box>
                    <Flex
                      justifyContent="space-between"
                      alignItems="center"
                      mb={4}
                    >
                      <Heading size="md" color={textColor}>
                        Skills
                      </Heading>
                      <Button
                        leftIcon={<AddIcon />}
                        onClick={() => appendSkill({ ...emptySkill })}
                        size="sm"
                        colorScheme="brand"
                        variant="outline"
                        isDisabled={skillFields.length >= 10}
                      >
                        Add Skill
                      </Button>
                    </Flex>

                    {errors.skills &&
                      typeof errors.skills === "object" &&
                      "message" in errors.skills && (
                        <FormErrorMessage mb={4}>
                          {errors.skills.message as string}
                        </FormErrorMessage>
                      )}

                    {skillFields.length === 0 ? (
                      <Box
                        p={4}
                        borderRadius="md"
                        bg={sectionBg}
                        textAlign="center"
                        color={mutedTextColor}
                      >
                        No skills added yet. Click the "Add Skill" button to add
                        your skills.
                      </Box>
                    ) : (
                      <VStack spacing={4} align="stretch">
                        {skillFields.map((field, index) => (
                          <SkillItem
                            key={field.id}
                            index={index}
                            register={register}
                            control={control}
                            onRemove={() => removeSkill(index)}
                          />
                        ))}
                      </VStack>
                    )}
                  </Box>

                  <Divider />

                  <Button
                    type="submit"
                    size="lg"
                    colorScheme="brand"
                    isLoading={isSubmitting}
                    loadingText="Submitting"
                  >
                    Submit Resume
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack align="start" spacing={6}>
              <Text color={textColor}>
                This form demonstrates how to handle dynamic arrays of fields.
                The key concepts covered include:
              </Text>

              <Box as="ul" pl={5} alignSelf="stretch" color={textColor}>
                <Box as="li" mt={2}>
                  Using React Hook Form's useFieldArray for array manipulations
                </Box>
                <Box as="li" mt={2}>
                  Dynamic add/remove functionality for array items
                </Box>
                <Box as="li" mt={2}>
                  Validation for array items and minimum/maximum array length
                  requirements
                </Box>
                <Box as="li" mt={2}>
                  Creating reusable components for array items
                </Box>
                <Box as="li" mt={2}>
                  Handling nested validation errors within arrays
                </Box>
              </Box>

              <Text fontWeight="bold" mt={2} color={textColor}>
                Zod Schema:
              </Text>
              <CodeBlock
                code={zodSchemaCode}
                language="typescript"
                showLineNumbers={true}
              />

              <Text fontWeight="bold" mt={2} color={textColor}>
                React Hook Form Implementation:
              </Text>
              <CodeBlock
                code={reactHookFormCode}
                language="typescript"
                showLineNumbers={true}
              />
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </FormPageLayout>
  );
}
