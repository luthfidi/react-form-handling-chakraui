import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
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
  Checkbox,
  Select,
  SimpleGrid,
  Tooltip,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { FaCode } from "react-icons/fa";
import FormPageLayout from "../../components/layout/FormPageLayout";
import CodeBlock from "../../components/ui/CodeBlock";
import {
  customValidationSchema,
  formValues,
  CustomValidationFormData,
} from "../../schemas/customValidationSchema";
import PasswordStrengthMeter from "./components/PasswordStrengthMeter";
import CreditCardInput from "./components/CreditCardInput";
import DateRangePicker from "./components/DateRangePicker";
import UsernameValidator from "./components/UsernameValidator";
import { customValidationFormSampleData } from "../../utils/SampleData";
import { MdAutoFixHigh } from "react-icons/md";

// Simple context provider for validation - replaces the missing ValidationContextProvider
const ValidationContext = React.createContext<any>(null);

const ValidationContextProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <ValidationContext.Provider value={{}}>
      {children}
    </ValidationContext.Provider>
  );
};

export default function CustomValidationForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [formData, setFormData] = useState<CustomValidationFormData | null>(
    null
  );
  const alertRef = useRef<HTMLDivElement>(null);
  const fillWithSampleData = () => {
    reset(customValidationFormSampleData as any); // Use type assertion to bypass type checking

    // Set the checkbox explicitly
    setValue("termsAccepted", true, {
      shouldValidate: true,
      shouldDirty: true,
      shouldTouch: true,
    });
  };

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
    watch,
    setValue,
    control,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CustomValidationFormData>({
    resolver: zodResolver(customValidationSchema),
    defaultValues: {
      username: "",
      password: "",
      email: "",
      website: "",
      creditCard: "",
      bio: "",
      country: "United States",
      zipCode: "",
      age: 25,
      termsAccepted: false,
      startDate: "",
      endDate: "",
      employmentType: "employed",
      companyName: "",
      yearsExperience: undefined,
      industry: "",
      educationLevel: "",
      schoolName: "",
      graduationYear: undefined,
    },
  });

  // Watch for the current employment type value
  const employmentType = watch("employmentType");

  // Update the global form values for cross-field validation
  useEffect(() => {
    formValues.country = watch("country");
  }, [watch("country")]);

  // Handle form submission
  const onSubmit = async (data: CustomValidationFormData) => {
    console.log("Form submitted:", data);
    setFormData(data);
    setIsSubmitSuccessful(true);

    // Scroll to success alert
    if (alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    // Hide success message after 8 seconds
    setTimeout(() => setIsSubmitSuccessful(false), 8000);
  };

  // Render employment fields based on selected employment type
  const renderEmploymentFields = () => {
    switch (employmentType) {
      case "employed":
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.companyName} isRequired>
              <FormLabel htmlFor="companyName" color={textColor}>
                Company Name
              </FormLabel>
              <Input
                id="companyName"
                placeholder="Enter your company name"
                {...register("companyName")}
              />
              {errors.companyName && (
                <FormErrorMessage>
                  {errors.companyName.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.yearsExperience} isRequired>
              <FormLabel htmlFor="yearsExperience" color={textColor}>
                Years of Experience
              </FormLabel>
              <Input
                id="yearsExperience"
                type="number"
                placeholder="Enter years of experience"
                {...register("yearsExperience", { valueAsNumber: true })}
              />
              {errors.yearsExperience && (
                <FormErrorMessage>
                  {errors.yearsExperience.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.industry} isRequired>
              <FormLabel htmlFor="industry" color={textColor}>
                Industry
              </FormLabel>
              <Select
                id="industry"
                placeholder="Select your industry"
                {...register("industry")}
              >
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </Select>
              {errors.industry && (
                <FormErrorMessage>{errors.industry.message}</FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        );

      case "student":
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.schoolName} isRequired>
              <FormLabel htmlFor="schoolName" color={textColor}>
                School Name
              </FormLabel>
              <Input
                id="schoolName"
                placeholder="Enter your school name"
                {...register("schoolName")}
              />
              {errors.schoolName && (
                <FormErrorMessage>{errors.schoolName.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.educationLevel} isRequired>
              <FormLabel htmlFor="educationLevel" color={textColor}>
                Education Level
              </FormLabel>
              <Select
                id="educationLevel"
                placeholder="Select your education level"
                {...register("educationLevel")}
              >
                <option value="highSchool">High School</option>
                <option value="associate">Associate's Degree</option>
                <option value="bachelor">Bachelor's Degree</option>
                <option value="master">Master's Degree</option>
                <option value="doctorate">Doctorate</option>
              </Select>
              {errors.educationLevel && (
                <FormErrorMessage>
                  {errors.educationLevel.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.graduationYear} isRequired>
              <FormLabel htmlFor="graduationYear" color={textColor}>
                Expected Graduation Year
              </FormLabel>
              <Input
                id="graduationYear"
                type="number"
                placeholder="Enter graduation year"
                {...register("graduationYear", { valueAsNumber: true })}
              />
              {errors.graduationYear && (
                <FormErrorMessage>
                  {errors.graduationYear.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        );

      case "self-employed":
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.companyName} isRequired>
              <FormLabel htmlFor="companyName" color={textColor}>
                Business Name
              </FormLabel>
              <Input
                id="companyName"
                placeholder="Enter your business name"
                {...register("companyName")}
              />
              {errors.companyName && (
                <FormErrorMessage>
                  {errors.companyName.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.industry} isRequired>
              <FormLabel htmlFor="industry" color={textColor}>
                Business Type
              </FormLabel>
              <Select
                id="industry"
                placeholder="Select your business type"
                {...register("industry")}
              >
                <option value="consulting">Consulting</option>
                <option value="retail">Retail</option>
                <option value="service">Service</option>
                <option value="manufacturing">Manufacturing</option>
                <option value="technology">Technology</option>
                <option value="other">Other</option>
              </Select>
              {errors.industry && (
                <FormErrorMessage>{errors.industry.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.yearsExperience} isRequired>
              <FormLabel htmlFor="yearsExperience" color={textColor}>
                Years in Business
              </FormLabel>
              <Input
                id="yearsExperience"
                type="number"
                placeholder="Enter years in business"
                {...register("yearsExperience", { valueAsNumber: true })}
              />
              {errors.yearsExperience && (
                <FormErrorMessage>
                  {errors.yearsExperience.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        );

      case "unemployed":
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.companyName}>
              <FormLabel htmlFor="companyName" color={textColor}>
                Previous Employer
              </FormLabel>
              <Input
                id="companyName"
                placeholder="Enter your previous employer"
                {...register("companyName")}
              />
              {errors.companyName && (
                <FormErrorMessage>
                  {errors.companyName.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.industry}>
              <FormLabel htmlFor="industry" color={textColor}>
                Industry
              </FormLabel>
              <Select
                id="industry"
                placeholder="Select your industry"
                {...register("industry")}
              >
                <option value="technology">Technology</option>
                <option value="healthcare">Healthcare</option>
                <option value="finance">Finance</option>
                <option value="education">Education</option>
                <option value="other">Other</option>
              </Select>
              {errors.industry && (
                <FormErrorMessage>{errors.industry.message}</FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        );

      case "retired":
        return (
          <VStack spacing={4} align="stretch">
            <FormControl isInvalid={!!errors.companyName}>
              <FormLabel htmlFor="companyName" color={textColor}>
                Previous Career
              </FormLabel>
              <Input
                id="companyName"
                placeholder="Describe your previous career"
                {...register("companyName")}
              />
              {errors.companyName && (
                <FormErrorMessage>
                  {errors.companyName.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.yearsExperience}>
              <FormLabel htmlFor="yearsExperience" color={textColor}>
                Years of Experience
              </FormLabel>
              <Input
                id="yearsExperience"
                type="number"
                placeholder="Enter years of experience"
                {...register("yearsExperience", { valueAsNumber: true })}
              />
              {errors.yearsExperience && (
                <FormErrorMessage>
                  {errors.yearsExperience.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </VStack>
        );

      default:
        return null;
    }
  };

  // Code examples for the documentation tab
  const customValidationSchemaCode = `import { z } from "zod";

// Store form values for cross-field validation
export let formValues = {
  country: "",
};

// Custom validation functions
function validateCreditCard(cc: string): boolean {
  // Remove non-digit characters
  const digits = cc.replace(/\\D/g, "");
  
  // Luhn algorithm implementation
  let sum = 0;
  let double = false;
  
  for (let i = digits.length - 1; i >= 0; i--) {
    let digit = parseInt(digits.charAt(i), 10);
    
    if (double) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    
    sum += digit;
    double = !double;
  }
  
  return sum % 10 === 0;
}

function validatePasswordStrength(password: string): boolean {
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[^A-Za-z0-9]/.test(password);
  
  return hasUppercase && hasLowercase && hasNumber && hasSpecial;
}

// Schema with advanced validation
export const customValidationSchema = z.object({
  username: z
    .string()
    .min(4, { message: "Username must be at least 4 characters" })
    .regex(/^[a-zA-Z0-9_-]+$/, {
      message: "Username can only contain letters, numbers, underscores, and hyphens",
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
    .refine((email) => !email.endsWith("tempmail.com"), {
      message: "Temporary email providers are not allowed",
    }),
  
  creditCard: z
    .string()
    .regex(/^\\d{16}$/, {
      message: "Credit card must be 16 digits",
    })
    .refine(validateCreditCard, {
      message: "Invalid credit card number",
    }),
    
  // Country-dependent ZIP code validation
  country: z.string().min(1, { message: "Country is required" }),
  
  zipCode: z.string().refine(
    (zip) => {
      // Dynamic validation based on country
      const country = formValues.country;
      
      if (country === "United States") {
        return /^\\d{5}(-\\d{4})?$/.test(zip);
      } else if (country === "Canada") {
        return /^[A-Za-z]\\d[A-Za-z] \\d[A-Za-z]\\d$/.test(zip);
      } else if (country === "United Kingdom") {
        return /^[A-Z]{1,2}\\d[A-Z\\d]? \\d[A-Z]{2}$/.test(zip);
      }
      
      // Default check
      return zip.length > 0;
    },
    {
      message: "Please enter a valid postal/zip code for your country",
    }
  ),
  
  // More fields and validations...
});`;

  const customValidationExampleCode = `// Component with custom validation
const UsernameValidator = ({ name, control, error }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  
  // Use React Hook Form's controller
  const { field: { value, onChange } } = useController({
    name,
    control,
  });
  
  // Check username availability (simulated)
  const checkAvailability = async (username: string) => {
    if (!username || username.length < 3) return null;
    
    setIsChecking(true);
    
    try {
      // Simulate API call with delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Check against a list of existing usernames
      const isUsernameTaken = EXISTING_USERNAMES.includes(
        username.toLowerCase()
      );
      
      setIsAvailable(!isUsernameTaken);
      return !isUsernameTaken;
    } finally {
      setIsChecking(false);
    }
  };
  
  // Use debounce to avoid excessive API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value && value.length >= 3) {
        checkAvailability(value);
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [value]);
  
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel>{label}</FormLabel>
      <InputGroup>
        <Input
          value={value || ""}
          onChange={onChange}
        />
        <InputRightElement>
          {isChecking ? (
            <Spinner size="sm" />
          ) : isAvailable === true ? (
            <CheckIcon color="green.500" />
          ) : isAvailable === false ? (
            <CloseIcon color="red.500" />
          ) : null}
        </InputRightElement>
      </InputGroup>
      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};`;

  const creditCardValidationCode = `// Credit card validation with Luhn algorithm
const validateCreditCard = (cardNumber: string): boolean => {
  // Remove spaces and non-digit characters
  const digits = cardNumber.replace(/\\D/g, "");
  
  if (!/^\\d{16}$/.test(digits)) return false;
  
  // Luhn algorithm implementation
  let sum = 0;
  let double = false;
  
  // Starting from the right
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
};

// React Hook Form and Zod implementation
const schema = z.object({
  creditCard: z
    .string()
    .regex(/^\\d{16}$/, {
      message: "Credit card must be 16 digits",
    })
    .refine(validateCreditCard, {
      message: "Invalid credit card number",
    }),
})

// In your form component
const CreditCardInput = () => {
  const { register, formState: { errors } } = useForm({
    resolver: zodResolver(schema)
  });
  
  return (
    <FormControl isInvalid={!!errors.creditCard}>
      <FormLabel>Credit Card Number</FormLabel>
      <Input
        {...register("creditCard")}
        placeholder="1234 5678 9012 3456"
        onChange={(e) => {
          // Format card number as user types
          e.target.value = formatCardNumber(e.target.value);
        }}
      />
      {errors.creditCard && (
        <FormErrorMessage>{errors.creditCard.message}</FormErrorMessage>
      )}
    </FormControl>
  );
};`;

  return (
    <ValidationContextProvider>
      <FormPageLayout
        title="Custom Validation Rules"
        description="Create sophisticated custom validation logic beyond what schema validation provides out of the box."
        icon={FaCode}
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
                    ref={alertRef}
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
                      Form Submitted Successfully!
                    </AlertTitle>
                    <AlertDescription maxWidth="sm" color={textColor}>
                      Your form with custom validation rules has been submitted
                      successfully.
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
                  <VStack spacing={4} align="stretch">
                    <Flex alignItems="center" mb={4}>
                      <Heading size="md" color={textColor} mr={2}>
                        Custom Validation Form
                      </Heading>
                      <Tooltip label="Fill with sample data" placement="top">
                        <IconButton
                          aria-label="Fill with sample data"
                          icon={<MdAutoFixHigh />}
                          size="sm"
                          onClick={fillWithSampleData}
                          colorScheme="blue"
                          variant="ghost"
                        />
                      </Tooltip>
                    </Flex>

                    <Text color={mutedTextColor}>
                      This form demonstrates advanced validation techniques with
                      real-time feedback.
                    </Text>

                    <Divider />

                    {/* Account Information Section */}
                    <Box>
                      <Text
                        fontSize="xl"
                        fontWeight="medium"
                        mb={4}
                        color={textColor}
                      >
                        Account Information
                      </Text>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        {/* Username with availability check */}
                        <UsernameValidator
                          ref={useRef<any>(null)}
                          id="username"
                          name="username"
                          label="Username"
                          register={register}
                          control={control}
                          error={errors.username}
                          isRequired={true}
                          blacklist={["admin", "root", "system", "moderator"]}
                          onAvailabilityCheck={() => {}}
                          showStrengthMeter={true}
                          placeholder="Choose a unique username"
                          helperText="Must be 4-20 characters with only letters, numbers, and underscores"
                        />

                        <FormControl isInvalid={!!errors.email} isRequired>
                          <FormLabel htmlFor="email" color={textColor}>
                            Email Address
                          </FormLabel>
                          <Input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            bg={cardBg}
                            {...register("email")}
                          />
                          <Text fontSize="xs" color={mutedTextColor} mt={1}>
                            We don't accept temporary email addresses
                          </Text>
                          {errors.email && (
                            <FormErrorMessage>
                              {errors.email.message}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      </SimpleGrid>

                      <Box mt={6}>
                        <FormControl isInvalid={!!errors.password} isRequired>
                          <FormLabel htmlFor="password" color={textColor}>
                            Password
                          </FormLabel>
                          <Input
                            id="password"
                            type="password"
                            placeholder="Create a strong password"
                            bg={cardBg}
                            {...register("password")}
                          />

                          {/* Password strength meter */}
                          {watch("password") && (
                            <PasswordStrengthMeter
                              password={watch("password")}
                              showChecklist={true}
                            />
                          )}

                          {errors.password && (
                            <FormErrorMessage>
                              {errors.password.message}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      </Box>
                    </Box>

                    <Divider />

                    {/* Personal Details Section */}
                    <Box>
                      <Text
                        fontSize="xl"
                        fontWeight="medium"
                        mb={4}
                        color={textColor}
                      >
                        Personal Details
                      </Text>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <FormControl isInvalid={!!errors.age} isRequired>
                          <FormLabel htmlFor="age" color={textColor}>
                            Age
                          </FormLabel>
                          <Input
                            id="age"
                            type="number"
                            placeholder="Enter your age"
                            bg={cardBg}
                            {...register("age", { valueAsNumber: true })}
                          />
                          <Text fontSize="xs" color={mutedTextColor} mt={1}>
                            Must be at least 18 years old
                          </Text>
                          {errors.age && (
                            <FormErrorMessage>
                              {errors.age.message}
                            </FormErrorMessage>
                          )}
                        </FormControl>

                        <FormControl isInvalid={!!errors.website}>
                          <FormLabel htmlFor="website" color={textColor}>
                            Website
                          </FormLabel>
                          <Input
                            id="website"
                            placeholder="https://example.com"
                            bg={cardBg}
                            {...register("website")}
                          />
                          <Text fontSize="xs" color={mutedTextColor} mt={1}>
                            Must use HTTPS protocol if provided
                          </Text>
                          {errors.website && (
                            <FormErrorMessage>
                              {errors.website.message}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      </SimpleGrid>

                      <Box mt={6}>
                        <FormControl isInvalid={!!errors.bio}>
                          <FormLabel htmlFor="bio" color={textColor}>
                            Bio
                          </FormLabel>
                          <Input
                            as="textarea"
                            id="bio"
                            placeholder="Tell us about yourself"
                            bg={cardBg}
                            height="100px"
                            py={2}
                            {...register("bio")}
                          />
                          <Text fontSize="xs" color={mutedTextColor} mt={1}>
                            Max 200 characters, appropriate content only
                          </Text>
                          {errors.bio && (
                            <FormErrorMessage>
                              {errors.bio.message}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      </Box>
                    </Box>

                    <Divider />

                    {/* Payment Information */}
                    <Box>
                      <Text
                        fontSize="xl"
                        fontWeight="medium"
                        mb={4}
                        color={textColor}
                      >
                        Payment Information
                      </Text>

                      <CreditCardInput
                        ref={useRef<any>(null)}
                        id="creditCard"
                        name="creditCard"
                        label="Credit Card Number"
                        register={register}
                        control={control}
                        error={errors.creditCard}
                        isRequired={true}
                        helperText="Must be a valid credit card number (validated with Luhn algorithm)"
                      />
                    </Box>

                    <Divider />

                    {/* Location Information */}
                    <Box>
                      <Text
                        fontSize="xl"
                        fontWeight="medium"
                        mb={4}
                        color={textColor}
                      >
                        Location Information
                      </Text>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        <FormControl isInvalid={!!errors.country} isRequired>
                          <FormLabel htmlFor="country" color={textColor}>
                            Country
                          </FormLabel>
                          <Select
                            id="country"
                            bg={cardBg}
                            {...register("country")}
                          >
                            <option value="United States">United States</option>
                            <option value="Canada">Canada</option>
                            <option value="United Kingdom">
                              United Kingdom
                            </option>
                            <option value="Australia">Australia</option>
                            <option value="Germany">Germany</option>
                            <option value="Other">Other</option>
                          </Select>
                          {errors.country && (
                            <FormErrorMessage>
                              {errors.country.message}
                            </FormErrorMessage>
                          )}
                        </FormControl>

                        <FormControl isInvalid={!!errors.zipCode} isRequired>
                          <FormLabel htmlFor="zipCode" color={textColor}>
                            {watch("country") === "United States"
                              ? "ZIP Code"
                              : watch("country") === "United Kingdom"
                              ? "Postal Code"
                              : "Postal/ZIP Code"}
                          </FormLabel>
                          <Input
                            id="zipCode"
                            placeholder={
                              watch("country") === "United States"
                                ? "e.g. 12345"
                                : watch("country") === "Canada"
                                ? "e.g. A1A 1A1"
                                : "Postal/ZIP Code"
                            }
                            bg={cardBg}
                            {...register("zipCode")}
                          />
                          <Text fontSize="xs" color={mutedTextColor} mt={1}>
                            Format changes based on selected country
                          </Text>
                          {errors.zipCode && (
                            <FormErrorMessage>
                              {errors.zipCode.message}
                            </FormErrorMessage>
                          )}
                        </FormControl>
                      </SimpleGrid>
                    </Box>

                    <Divider />

                    {/* Date Range Section */}
                    <Box>
                      <Text
                        fontSize="xl"
                        fontWeight="medium"
                        mb={4}
                        color={textColor}
                      >
                        Date Range
                      </Text>

                      <DateRangePicker
                        startDateName="startDate"
                        endDateName="endDate"
                        label="Select a date range"
                        control={control}
                        register={register}
                        startDateError={errors.startDate}
                        endDateError={errors.endDate}
                        rangeError={undefined}
                        minDays={7}
                        maxDays={90}
                        onChange={() => {}}
                        isRequired={true}
                        excludeWeekends={false}
                      />
                    </Box>

                    <Divider />

                    {/* Employment Section with Conditional Fields */}
                    <Box>
                      <Text
                        fontSize="xl"
                        fontWeight="medium"
                        mb={4}
                        color={textColor}
                      >
                        Employment Information
                      </Text>

                      <FormControl
                        isInvalid={!!errors.employmentType}
                        isRequired
                        mb={6}
                      >
                        <FormLabel htmlFor="employmentType" color={textColor}>
                          Employment Status
                        </FormLabel>
                        <Select
                          id="employmentType"
                          bg={cardBg}
                          {...register("employmentType")}
                        >
                          <option value="employed">Employed</option>
                          <option value="self-employed">Self-Employed</option>
                          <option value="student">Student</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="retired">Retired</option>
                        </Select>
                        {errors.employmentType && (
                          <FormErrorMessage>
                            {errors.employmentType.message}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                      {/* Render conditional fields based on employment type */}
                      <Box
                        p={4}
                        bg={sectionBg}
                        borderRadius="md"
                        borderWidth="1px"
                        borderColor={cardBorder}
                      >
                        {renderEmploymentFields()}
                      </Box>
                    </Box>

                    <Divider />

                    <FormControl isInvalid={!!errors.termsAccepted} isRequired>
                      <Checkbox
                        id="termsAccepted"
                        colorScheme="brand"
                        isChecked={watch("termsAccepted")}
                        onChange={(e) =>
                          setValue("termsAccepted", e.target.checked)
                        }
                      >
                        <Text fontSize="sm" color={textColor}>
                          I accept the terms and conditions
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
                      loadingText="Validating..."
                    >
                      Submit
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>
            <TabPanel>
              {/* Code example tab content */}
              <VStack spacing={6} align="stretch" py={5}>
                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    1. Advanced Validation Schema with Zod
                  </Heading>
                  <Text mb={4} color={mutedTextColor}>
                    Create sophisticated validation rules using Zod's refine and
                    custom validation functions.
                  </Text>
                  <Box
                    borderWidth="1px"
                    borderColor={cardBorder}
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <CodeBlock
                      code={customValidationSchemaCode}
                      language="typescript"
                      showLineNumbers={true}
                    />
                  </Box>
                </Box>

                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    2. Real-time Validation with API Calls
                  </Heading>
                  <Text mb={4} color={mutedTextColor}>
                    Create form components that provide real-time feedback to
                    users, such as username availability checking.
                  </Text>
                  <Box
                    borderWidth="1px"
                    borderColor={cardBorder}
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <CodeBlock
                      code={customValidationExampleCode}
                      language="typescript"
                      showLineNumbers={true}
                    />
                  </Box>
                </Box>

                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    3. Credit Card Validation with Luhn Algorithm
                  </Heading>
                  <Text mb={4} color={mutedTextColor}>
                    Implement advanced validation like the Luhn algorithm for
                    credit card number validation.
                  </Text>
                  <Box
                    borderWidth="1px"
                    borderColor={cardBorder}
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <CodeBlock
                      code={creditCardValidationCode}
                      language="typescript"
                      showLineNumbers={true}
                    />
                  </Box>
                </Box>

                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    4. Key Validation Techniques
                  </Heading>
                  <VStack align="stretch" spacing={4} color={mutedTextColor}>
                    <Text>
                      • <strong>Cross-field validation</strong>: Validate fields
                      based on values in other fields (e.g., ZIP code format
                      based on country)
                    </Text>
                    <Text>
                      • <strong>Asynchronous validation</strong>: Check data
                      against external APIs or databases (e.g., username
                      availability)
                    </Text>
                    <Text>
                      • <strong>Complex algorithms</strong>: Implement
                      verification algorithms like Luhn for credit cards
                    </Text>
                    <Text>
                      • <strong>Conditional validation</strong>: Apply different
                      validation rules based on form state (e.g., employment
                      type)
                    </Text>
                    <Text>
                      • <strong>Real-time feedback</strong>: Provide immediate
                      validation feedback as users type
                    </Text>
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </FormPageLayout>
    </ValidationContextProvider>
  );
}
