import { useState, useRef, useEffect } from "react";
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
  InputGroup,
  InputRightElement,
  Spinner,
  Badge,
  SimpleGrid,
  Checkbox,
} from "@chakra-ui/react";
import { FaSync, FaCheck, FaTimes } from "react-icons/fa";
import FormPageLayout from "../../components/layout/FormPageLayout";
import CodeBlock from "../../components/ui/CodeBlock";
import { z } from "zod";

// Define the schema
const asyncValidationSchema = z.object({
  username: z
    .string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, {
      message: "Username can only contain letters, numbers, and underscores",
    }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[^A-Za-z0-9]/, {
      message: "Password must contain at least one special character",
    }),
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Form data type
type FormData = z.infer<typeof asyncValidationSchema>;

// Mock database of existing usernames
const EXISTING_USERNAMES = ["johndoe", "janedoe", "admin", "user", "test"];

export default function AsyncValidationForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const [isCheckingUsername, setIsCheckingUsername] = useState(false);
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<
    boolean | null
  >(null);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isEmailAvailable, setIsEmailAvailable] = useState<boolean | null>(
    null
  );
  const alertRef = useRef<HTMLDivElement>(null);

  // Color modes
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const successBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
    setError,
    clearErrors,
  } = useForm<FormData>({
    resolver: zodResolver(asyncValidationSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      termsAccepted: false,
    },
  });

  // Watch username and email for availability check
  const watchedUsername = watch("username");
  const watchedEmail = watch("email");

  useEffect(() => {
    if (!watchedUsername || watchedUsername.length < 3) {
      setIsUsernameAvailable(null);
      return;
    }

    const timer = setTimeout(() => {
      checkUsernameAvailability(watchedUsername);
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedUsername]);

  useEffect(() => {
    if (!watchedEmail || !watchedEmail.includes("@")) {
      setIsEmailAvailable(null);
      return;
    }

    const timer = setTimeout(() => {
      checkEmailAvailability(watchedEmail);
    }, 500);

    return () => clearTimeout(timer);
  }, [watchedEmail]);

  // Check username availability
  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) return;

    setIsCheckingUsername(true);
    setIsUsernameAvailable(null);

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const isAvailable = !EXISTING_USERNAMES.includes(username.toLowerCase());
    setIsCheckingUsername(false);
    setIsUsernameAvailable(isAvailable);

    if (!isAvailable) {
      setError("username", {
        type: "manual",
        message: "This username is already taken",
      });
    } else {
      clearErrors("username");
    }

    return isAvailable;
  };

  // Check email availability
  const checkEmailAvailability = async (email: string) => {
    if (!email || !email.includes("@")) return;

    setIsCheckingEmail(true);
    setIsEmailAvailable(null);

    // Simulate API call with delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // For demo purposes, we'll consider emails with "taken" in them as already used
    const isAvailable = !email.toLowerCase().includes("taken");
    setIsCheckingEmail(false);
    setIsEmailAvailable(isAvailable);

    if (!isAvailable) {
      setError("email", {
        type: "manual",
        message: "This email is already registered",
      });
    } else {
      clearErrors("email");
    }

    return isAvailable;
  };

  const onSubmit = async (data: FormData) => {
    // Check username availability before submitting
    const isUsernameValid = await checkUsernameAvailability(data.username);
    const isEmailValid = await checkEmailAvailability(data.email);

    if (!isUsernameValid || !isEmailValid) {
      return;
    }

    console.log("Form submitted successfully:", data);
    setFormData(data);
    setIsSubmitSuccessful(true);
    reset();

    // Scroll to top to show success message
    if (alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Hide success message after 10 seconds
    setTimeout(() => setIsSubmitSuccessful(false), 10000);
  };

  // Code examples
  const zodSchemaCode = `import { z } from 'zod';

// Basic validation schema
const asyncValidationSchema = z.object({
  username: z.string()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(20, { message: "Username must not exceed 20 characters" })
    .regex(/^[a-zA-Z0-9_]+$/, { 
      message: "Username can only contain letters, numbers, and underscores" 
    }),
  email: z.string()
    .email({ message: "Please enter a valid email address" }),
  password: z.string()
    .min(8, { message: "Password must be at least 8 characters" })
    // Additional password requirements...
});

// Zod doesn't handle async validation directly, so we'll need to implement 
// the async validation parts in our React component using React Hook Form's 
// validation API.`;

  const asyncValidationCode = `// React Hook Form setup
const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
  setError,
  clearErrors,
} = useForm<FormData>({
  resolver: zodResolver(asyncValidationSchema)
});

// Watch username for availability check
const username = watch("username");

// Check username availability
const checkUsernameAvailability = async (username: string) => {
  if (username.length < 3) return;
  
  setIsCheckingUsername(true);
  
  try {
    // Replace with actual API call
    const response = await fetch(\`/api/check-username?username=\${username}\`);
    const data = await response.json();
    
    if (!data.isAvailable) {
      setError("username", {
        type: "manual",
        message: "This username is already taken"
      });
      return false;
    } else {
      clearErrors("username");
      return true;
    }
  } catch (error) {
    console.error("Error checking username:", error);
  } finally {
    setIsCheckingUsername(false);
  }
};

// Debouncing for better user experience
useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (username) checkUsernameAvailability(username);
  }, 500);
  
  return () => clearTimeout(timeoutId);
}, [username]);

// Include validation in onSubmit
const onSubmit = async (data: FormData) => {
  // Run async validations again before submission
  const isUsernameValid = await checkUsernameAvailability(data.username);
  
  if (!isUsernameValid) {
    return;
  }
  
  // Continue with form submission...
};`;

  const usageExample = `// In your form JSX
<FormControl isInvalid={!!errors.username}>
  <FormLabel>Username</FormLabel>
  <InputGroup>
    <Input {...register("username")} />
    <InputRightElement>
      {isCheckingUsername ? (
        <Spinner size="sm" />
      ) : isUsernameAvailable === true ? (
        <Icon as={CheckIcon} color="green.500" />
      ) : isUsernameAvailable === false ? (
        <Icon as={CloseIcon} color="red.500" />
      ) : null}
    </InputRightElement>
  </InputGroup>
  {errors.username && (
    <FormErrorMessage>{errors.username.message}</FormErrorMessage>
  )}
  {isUsernameAvailable === true && (
    <Text color="green.500" fontSize="sm">Username is available</Text>
  )}
</FormControl>`;

  return (
    <FormPageLayout
      title="Async Validation Form"
      description="Implement server-side validation checks such as username availability without a real backend."
      icon={FaSync}
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
                      Registration Successful!
                    </AlertTitle>
                    <AlertDescription maxWidth="sm" color={textColor}>
                      Your account has been created successfully with the unique
                      username.
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
                maxW="500px"
                mx="auto"
                borderWidth="1px"
                borderColor={cardBorder}
              >
                <VStack spacing={8} align="stretch">
                  <Heading size="md" color={textColor} textAlign="center">
                    Create Your Account
                  </Heading>

                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    <Box fontSize="sm">
                      <AlertTitle>Try these usernames:</AlertTitle>
                      <AlertDescription>
                        <Text>Taken: "johndoe", "admin", "test"</Text>
                        <Text>
                          Use "taken" in any email to trigger a validation
                          error.
                        </Text>
                      </AlertDescription>
                    </Box>
                  </Alert>

                  <SimpleGrid columns={1} spacing={6}>
                    <FormControl isInvalid={!!errors.username} isRequired>
                      <FormLabel htmlFor="username" color={textColor}>
                        Username
                        <Badge ml={2} colorScheme="purple">
                          Checks availability
                        </Badge>
                      </FormLabel>
                      <InputGroup>
                        <Input
                          id="username"
                          placeholder="Choose a username"
                          {...register("username")}
                          onChange={(e) => {
                            register("username").onChange(e);
                            if (e.target.value.length >= 3) {
                              setTimeout(
                                () => checkUsernameAvailability(e.target.value),
                                500
                              );
                            } else {
                              setIsUsernameAvailable(null);
                            }
                          }}
                        />
                        <InputRightElement>
                          {isCheckingUsername ? (
                            <Spinner size="sm" color="blue.500" />
                          ) : isUsernameAvailable === true ? (
                            <FaCheck color="green" />
                          ) : isUsernameAvailable === false ? (
                            <FaTimes color="red" />
                          ) : null}
                        </InputRightElement>
                      </InputGroup>
                      {errors.username && (
                        <FormErrorMessage>
                          {errors.username.message}
                        </FormErrorMessage>
                      )}
                      {isUsernameAvailable === true && !errors.username && (
                        <Text color="green.500" fontSize="xs" mt={1}>
                          Username is available
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.email} isRequired>
                      <FormLabel htmlFor="email" color={textColor}>
                        Email Address
                        <Badge ml={2} colorScheme="purple">
                          Checks availability
                        </Badge>
                      </FormLabel>
                      <InputGroup>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...register("email")}
                          onChange={(e) => {
                            register("email").onChange(e);
                            if (e.target.value.includes("@")) {
                              setTimeout(
                                () => checkEmailAvailability(e.target.value),
                                500
                              );
                            } else {
                              setIsEmailAvailable(null);
                            }
                          }}
                        />
                        <InputRightElement>
                          {isCheckingEmail ? (
                            <Spinner size="sm" color="blue.500" />
                          ) : isEmailAvailable === true ? (
                            <FaCheck color="green" />
                          ) : isEmailAvailable === false ? (
                            <FaTimes color="red" />
                          ) : null}
                        </InputRightElement>
                      </InputGroup>
                      {errors.email && (
                        <FormErrorMessage>
                          {errors.email.message}
                        </FormErrorMessage>
                      )}
                      {isEmailAvailable === true && !errors.email && (
                        <Text color="green.500" fontSize="xs" mt={1}>
                          Email is available
                        </Text>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.password} isRequired>
                      <FormLabel htmlFor="password" color={textColor}>
                        Password
                      </FormLabel>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a strong password"
                        {...register("password")}
                      />
                      {errors.password && (
                        <FormErrorMessage>
                          {errors.password.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>

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
                  </SimpleGrid>

                  <Divider />

                  <Button
                    type="submit"
                    colorScheme="brand"
                    size="lg"
                    isLoading={
                      isSubmitting || isCheckingUsername || isCheckingEmail
                    }
                    loadingText="Validating"
                  >
                    Create Account
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={6} align="stretch" py={5}>
              <Box>
                <Heading size="md" mb={4} color={textColor}>
                  1. Zod Schema for Basic Validation
                </Heading>
                <Text mb={4} color={mutedTextColor}>
                  Zod provides validation for synchronous rules. For async
                  validation, we'll need to use React Hook Form's API.
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
                  2. Implementing Async Validation
                </Heading>
                <Text mb={4} color={mutedTextColor}>
                  Implement custom validation functions for checking data
                  against a server.
                </Text>
                <Box
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <CodeBlock code={asyncValidationCode} language="typescript" />
                </Box>
              </Box>

              <Box>
                <Heading size="md" mb={4} color={textColor}>
                  3. Form Component with Availability Indicators
                </Heading>
                <Text mb={4} color={mutedTextColor}>
                  Show loading spinners and visual indicators for async
                  validation state.
                </Text>
                <Box
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <CodeBlock code={usageExample} language="typescript" />
                </Box>
              </Box>

              <Box>
                <Heading size="md" mb={4} color={textColor}>
                  4. Implementation Notes
                </Heading>
                <VStack align="stretch" spacing={4} color={mutedTextColor}>
                  <Text>
                    • Debouncing is important for async validation to avoid
                    excessive API calls.
                  </Text>
                  <Text>
                    • Use React Hook Form's setError and clearErrors to manually
                    manage validation states.
                  </Text>
                  <Text>
                    • Visual feedback (spinners, check marks, error icons)
                    improves the user experience.
                  </Text>
                  <Text>
                    • Re-validate on form submission to ensure data integrity.
                  </Text>
                  <Text>
                    • Consider UX carefully - async validation should not block
                    the user from continuing to fill out the form.
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
