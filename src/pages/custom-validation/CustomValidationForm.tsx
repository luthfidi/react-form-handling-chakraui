import { useState, useRef, useEffect } from "react";
import { useForm, FieldError } from "react-hook-form";
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
  SimpleGrid,
  Checkbox,
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
import ValidationContextProvider, {
  useValidation,
} from "./components/ValidationContextProvider";
import ConditionalValidation from "./components/ConditionalValidation";

export default function CustomValidationForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [formData, setFormData] = useState<CustomValidationFormData | null>(
    null
  );
  const [ , setPasswordStrength] = useState(0);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(
    null
  );
  const [rangeError, setRangeError] = useState<string | undefined>(undefined);
  const alertRef = useRef<HTMLDivElement>(null);

  // Color modes
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const successBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const inputBg = useColorModeValue("white", "gray.700");

  const {
    register,
    handleSubmit,
    control,
    watch,
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
    },
  });

  // Watch values for conditional fields
  const watchedValues = watch();
  const employmentType = watch("employmentType");
  const password = watch("password");

  // Update the global form values for cross-field validation
  useEffect(() => {
    formValues.country = watchedValues.country;
  }, [watchedValues.country]);

  // Handle date range errors
  const handleDateRangeChange = (range: {
    startDate: string;
    endDate: string;
  }) => {
    if (range.startDate && range.endDate) {
      const start = new Date(range.startDate);
      const end = new Date(range.endDate);
      const diffTime = Math.abs(end.getTime() - start.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 7) {
        setRangeError("Date range must be at least 7 days");
      } else if (diffDays > 90) {
        setRangeError("Date range cannot exceed 90 days");
      } else {
        setRangeError(undefined);
      }
    }
  };

  // Conditional fields configuration
  const conditionalFields = [
    {
      name: "companyName",
      label: "Company Name",
      type: "text" as const,
      condition: {
        type: "equals" as const,
        field: "employmentType",
        value: "employed",
      },
      placeholder: "Enter your company name",
      isRequired: true,
      helperText: "The name of the company you work for",
    },
    {
      name: "yearsExperience",
      label: "Years of Experience",
      type: "number" as const,
      condition: {
        type: "equals" as const,
        field: "employmentType",
        value: "employed",
      },
      placeholder: "Enter years of experience",
      isRequired: true,
    },
    {
      name: "industry",
      label: "Industry",
      type: "select" as const,
      condition: [
        { type: "equals" as const, field: "employmentType", value: "employed" },
        { type: "notEquals" as const, field: "companyName", value: "" },
      ],
      options: [
        { label: "Technology", value: "technology" },
        { label: "Healthcare", value: "healthcare" },
        { label: "Finance", value: "finance" },
        { label: "Education", value: "education" },
        { label: "Other", value: "other" },
      ],
      isRequired: true,
    },
    {
      name: "educationLevel",
      label: "Education Level",
      type: "select" as const,
      condition: {
        type: "equals" as const,
        field: "employmentType",
        value: "student",
      },
      options: [
        { label: "High School", value: "highSchool" },
        { label: "Associate's Degree", value: "associate" },
        { label: "Bachelor's Degree", value: "bachelor" },
        { label: "Master's Degree", value: "master" },
        { label: "Doctorate", value: "doctorate" },
      ],
      isRequired: true,
    },
    {
      name: "schoolName",
      label: "School Name",
      type: "text" as const,
      condition: {
        type: "equals" as const,
        field: "employmentType",
        value: "student",
      },
      placeholder: "Enter your school name",
      isRequired: true,
    },
    {
      name: "graduationYear",
      label: "Expected Graduation Year",
      type: "number" as const,
      condition: [
        { type: "equals" as const, field: "employmentType", value: "student" },
        { type: "isNotEmpty" as const, field: "schoolName" },
      ],
      placeholder: "Enter graduation year",
      isRequired: true,
      defaultValue: new Date().getFullYear() + 1,
    },
  ];

  const onSubmit = (data: CustomValidationFormData) => {
    // Check custom validations not handled by Zod
    if (usernameAvailable === false) {
      return;
    }

    if (rangeError) {
      return;
    }

    const sanitizedData = {
      ...data,
      creditCard: "",
    };

    // Simulate API call
    console.log("Form submitted:", data);

    setTimeout(() => {
      setFormData(sanitizedData);
      setIsSubmitSuccessful(true);

      // Scroll to success message
      if (alertRef.current) {
        alertRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // Hide success message after 10 seconds
      setTimeout(() => setIsSubmitSuccessful(false), 10000);

      // Reset form
      reset();
      setPasswordStrength(0);
      setUsernameAvailable(null);
    }, 1500);
  };

  // Code examples for the documentation tab
  const customValidationCode = `// 1. Custom password strength validation
const passwordSchema = z.string()
  .min(8, { message: "Password must be at least 8 characters" })
  .refine(
    (password) => {
      // Custom password strength validation logic
      const hasUppercase = /[A-Z]/.test(password);
      const hasLowercase = /[a-z]/.test(password);
      const hasNumber = /[0-9]/.test(password);
      const hasSpecial = /[^A-Za-z0-9]/.test(password);
      
      return hasUppercase && hasLowercase && hasNumber && hasSpecial;
    },
    {
      message: "Password must include uppercase, lowercase, number, and special character",
    }
  );
  
// 2. Credit card validation with Luhn algorithm
const creditCardSchema = z.string()
  .regex(/^\\d{16}$/, { message: "Credit card must be 16 digits" })
  .refine(
    (cc) => {
      // Luhn algorithm implementation
      const digits = cc.split("").map(Number);
      for (let i = digits.length - 2; i >= 0; i -= 2) {
        digits[i] *= 2;
        if (digits[i] > 9) digits[i] -= 9;
      }
      const sum = digits.reduce((acc, digit) => acc + digit, 0);
      return sum % 10 === 0;
    },
    {
      message: "Invalid credit card number",
    }
  );
  
// 3. Dynamic validation based on another field's value
const postalCodeSchema = z.string()
  .refine(
    (zip, ctx) => {
      // Get the country from the form context
      const country = ctx.parent.country;
      
      if (country === "United States") {
        return /^\\d{5}(-\\d{4})?$/.test(zip);
      } else if (country === "Canada") {
        return /^[A-Za-z]\\d[A-Za-z] \\d[A-Za-z]\\d$/.test(zip);
      }
      
      // Default check
      return zip.length > 0;
    },
    {
      message: "Please enter a valid postal/zip code for your country",
    }
  );`;

  const advancedComponentsCode = `// 1. Password Strength Meter Component
const PasswordStrengthMeter = ({ password }) => {
  const strength = useMemo(() => {
    // Calculate password strength (0-5)
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const hasMinLength = password.length >= 8;
    
    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;
    
    return score;
  }, [password]);
  
  return (
    <VStack>
      <Progress value={(strength / 5) * 100} />
      <Text>Password Strength: {getStrengthLabel(strength)}</Text>
      {/* Validation checklist */}
    </VStack>
  );
};

// 2. Real-time Username Availability Check
const UsernameValidator = ({ register, name }) => {
  const [isChecking, setIsChecking] = useState(false);
  const [isAvailable, setIsAvailable] = useState(null);
  
  const checkAvailability = useCallback(debounce(async (username) => {
    setIsChecking(true);
    try {
      // API call to check username
      const result = await api.checkUsername(username);
      setIsAvailable(result.available);
    } finally {
      setIsChecking(false);
    }
  }, 500), []);
  
  return (
    <FormControl>
      <InputGroup>
        <Input {...register(name)} onChange={e => checkAvailability(e.target.value)} />
        <InputRightElement>
          {isChecking ? <Spinner /> : isAvailable ? <CheckIcon /> : <CloseIcon />}
        </InputRightElement>
      </InputGroup>
    </FormControl>
  );
};`;

  const validationContextCode = `// Create a validation context
const ValidationContext = createContext(null);

// Provider component
export const ValidationProvider = ({ children }) => {
  const [results, setResults] = useState({});
  const [pending, setPending] = useState({});
  const cache = useRef({});
  
  // Run validation with caching
  const validate = async (name, value, validator) => {
    // Check cache first
    const cacheKey = \`\${name}:\${JSON.stringify(value)}\`;
    if (cache.current[cacheKey]) {
      return cache.current[cacheKey];
    }
    
    // Mark as pending
    setPending(prev => ({ ...prev, [name]: true }));
    
    try {
      // Run validation
      const result = await validator(value);
      
      // Store result
      setResults(prev => ({ ...prev, [name]: result }));
      cache.current[cacheKey] = result;
      
      return result;
    } finally {
      // Clear pending status
      setPending(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };
  
  return (
    <ValidationContext.Provider value={{ 
      validate, 
      results, 
      isPending: name => pending[name],
      clearCache: () => { cache.current = {}; }
    }}>
      {children}
    </ValidationContext.Provider>
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
                <div ref={alertRef}>
                  {isSubmitSuccessful && (
                    <Alert
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
                        Your form with custom validation rules has been
                        submitted successfully.
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
                </div>

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
                      Custom Validation Form
                    </Heading>
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
                          id="username"
                          name="username"
                          label="Username"
                          register={register}
                          error={errors.username}
                          isRequired={true}
                          blacklist={["admin", "root", "system", "moderator"]}
                          onAvailabilityCheck={setUsernameAvailable}
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
                            bg={inputBg}
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
                            bg={inputBg}
                            {...register("password")}
                          />

                          {/* Password strength meter */}
                          {password && (
                            <PasswordStrengthMeter
                              password={password}
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
                            bg={inputBg}
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
                            bg={inputBg}
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
                            bg={inputBg}
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
                        id="creditCard"
                        name="creditCard"
                        label="Credit Card Number"
                        register={register}
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
                          <Input
                            as="select"
                            id="country"
                            bg={inputBg}
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
                          </Input>
                          {errors.country && (
                            <FormErrorMessage>
                              {errors.country.message}
                            </FormErrorMessage>
                          )}
                        </FormControl>

                        <FormControl isInvalid={!!errors.zipCode} isRequired>
                          <FormLabel htmlFor="zipCode" color={textColor}>
                            {watchedValues.country === "United States"
                              ? "ZIP Code"
                              : watchedValues.country === "United Kingdom"
                              ? "Postal Code"
                              : "Postal/ZIP Code"}
                          </FormLabel>
                          <Input
                            id="zipCode"
                            placeholder={
                              watchedValues.country === "United States"
                                ? "e.g. 12345"
                                : watchedValues.country === "Canada"
                                ? "e.g. A1A 1A1"
                                : "Postal/ZIP Code"
                            }
                            bg={inputBg}
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
                        rangeError={rangeError}
                        minDays={7}
                        maxDays={90}
                        onChange={handleDateRangeChange}
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
                        <Input
                          as="select"
                          id="employmentType"
                          bg={inputBg}
                          {...register("employmentType")}
                        >
                          <option value="employed">Employed</option>
                          <option value="self-employed">Self-Employed</option>
                          <option value="student">Student</option>
                          <option value="unemployed">Unemployed</option>
                          <option value="retired">Retired</option>
                        </Input>
                        {errors.employmentType && (
                          <FormErrorMessage>
                            {errors.employmentType.message}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                      <ConditionalValidation
                        fields={conditionalFields}
                        register={register}
                        control={control}
                        errors={
                          errors as Record<string, FieldError | undefined>
                        }
                        title="Employment Details"
                        description={`Additional information based on your employment status: ${employmentType}`}
                      />
                    </Box>

                    <Divider />

                    <FormControl isInvalid={!!errors.termsAccepted} isRequired>
                      <Checkbox
                        id="termsAccepted"
                        colorScheme="brand"
                        {...register("termsAccepted")}
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
                      isDisabled={!!rangeError}
                    >
                      Submit
                    </Button>
                  </VStack>
                </Box>
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack spacing={8} align="stretch" py={5}>
                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    1. Custom Validation with Zod
                  </Heading>
                  <Text mb={4} color={mutedTextColor}>
                    Implement powerful validation rules using Zod's refinement
                    capabilities:
                  </Text>
                  <Box
                    borderWidth="1px"
                    borderColor={cardBorder}
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <CodeBlock
                      code={customValidationCode}
                      language="typescript"
                    />
                  </Box>
                </Box>

                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    2. Advanced Validation Components
                  </Heading>
                  <Text mb={4} color={mutedTextColor}>
                    Create reusable components for specialized validation needs:
                  </Text>
                  <Box
                    borderWidth="1px"
                    borderColor={cardBorder}
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <CodeBlock
                      code={advancedComponentsCode}
                      language="typescript"
                    />
                  </Box>
                </Box>

                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    3. Validation Context for State Management
                  </Heading>
                  <Text mb={4} color={mutedTextColor}>
                    Centralize validation logic and caching for better
                    performance:
                  </Text>
                  <Box
                    borderWidth="1px"
                    borderColor={cardBorder}
                    borderRadius="md"
                    overflow="hidden"
                  >
                    <CodeBlock
                      code={validationContextCode}
                      language="typescript"
                    />
                  </Box>
                </Box>

                <Box>
                  <Heading size="md" mb={4} color={textColor}>
                    4. Implementation Considerations
                  </Heading>
                  <VStack align="stretch" spacing={4} color={mutedTextColor}>
                    <Text>
                      <strong>Performance Optimization:</strong> Use debouncing
                      for real-time validation to avoid excessive API calls and
                      re-renders.
                    </Text>
                    <Text>
                      <strong>Error Handling:</strong> Provide clear, actionable
                      error messages that guide users on how to fix issues.
                    </Text>
                    <Text>
                      <strong>Progressive Disclosure:</strong> Show validation
                      feedback progressively as users interact with the form,
                      not all at once.
                    </Text>
                    <Text>
                      <strong>Client-Server Validation:</strong> Always validate
                      on both client and server for security - client validation
                      is for UX, server validation for security.
                    </Text>
                    <Text>
                      <strong>Reusable Components:</strong> Build a library of
                      validation components for consistent behavior across your
                      application.
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
