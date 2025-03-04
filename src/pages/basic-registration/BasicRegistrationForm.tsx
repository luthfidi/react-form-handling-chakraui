import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Stack,
  Text,
  useColorModeValue,
  VStack,
  FormErrorMessage as ChakraFormErrorMessage,
  InputGroup,
  InputRightElement,
  IconButton,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Divider,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { FaUserPlus } from "react-icons/fa";
import {
  basicRegistrationSchema,
  type BasicRegistrationFormData,
} from "../../schemas/basicRegistrationSchema";
import FormPageLayout from "../../components/layout/FormPageLayout";
import CodeBlock from "../../components/ui/CodeBlock";

export default function BasicRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [formData, setFormData] = useState<BasicRegistrationFormData | null>(
    null
  );

  // Color modes
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const successBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<BasicRegistrationFormData>({
    resolver: zodResolver(basicRegistrationSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      terms: false,
    },
  });

  const onSubmit = (data: BasicRegistrationFormData) => {
    // Simulate API call
    return new Promise<void>((resolve) => {
      setTimeout(() => {
        console.log("Form submitted successfully:", data);
        setFormData(data);
        setIsSubmitSuccessful(true);
        reset();
        resolve();
        // Hide success message after 8 seconds
        setTimeout(() => setIsSubmitSuccessful(false), 8000);
      }, 1500);
    });
  };

  const zodSchemaCode = `import { z } from 'zod'

export const basicRegistrationSchema = z
  .object({
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
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters' })
      .regex(/[A-Z]/, { message: 'Password must contain at least one uppercase letter' })
      .regex(/[a-z]/, { message: 'Password must contain at least one lowercase letter' })
      .regex(/[0-9]/, { message: 'Password must contain at least one number' })
      .regex(/[^A-Za-z0-9]/, { message: 'Password must contain at least one special character' }),
    confirmPassword: z
      .string(),
    terms: z
      .boolean()
      .refine(val => val === true, { message: 'You must accept the terms and conditions' }),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  })`;

  const reactHookFormCode = `const {
  register,
  handleSubmit,
  formState: { errors, isSubmitting },
  reset,
} = useForm<BasicRegistrationFormData>({
  resolver: zodResolver(basicRegistrationSchema),
  defaultValues: {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    terms: false,
  },
})

const onSubmit = (data: BasicRegistrationFormData) => {
  // Handle form submission
  console.log(data);
  // API call would go here
}`;

  return (
    <FormPageLayout
      title="Basic Registration Form"
      description="Learn the fundamentals of form validation including required fields, email format, password matching, and basic submission handling."
      icon={FaUserPlus}
      difficulty="Basic"
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
                    Your account has been created successfully. You can now log
                    in with your credentials.
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
                rounded="xl"
                bg={cardBg}
                boxShadow="xl"
                p={8}
                w="full"
                maxW="md"
                mx="auto"
                borderWidth="1px"
                borderColor={cardBorder}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Stack spacing={6}>
                    <Flex gap={4} direction={{ base: "column", sm: "row" }}>
                      <FormControl isInvalid={!!errors.firstName}>
                        <FormLabel htmlFor="firstName" color={textColor}>
                          First Name
                        </FormLabel>
                        <Input
                          id="firstName"
                          type="text"
                          {...register("firstName")}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-500)",
                          }}
                        />
                        {errors.firstName && (
                          <ChakraFormErrorMessage>
                            {errors.firstName.message}
                          </ChakraFormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl isInvalid={!!errors.lastName}>
                        <FormLabel htmlFor="lastName" color={textColor}>
                          Last Name
                        </FormLabel>
                        <Input
                          id="lastName"
                          type="text"
                          {...register("lastName")}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-500)",
                          }}
                        />
                        {errors.lastName && (
                          <ChakraFormErrorMessage>
                            {errors.lastName.message}
                          </ChakraFormErrorMessage>
                        )}
                      </FormControl>
                    </Flex>

                    <FormControl isInvalid={!!errors.email}>
                      <FormLabel htmlFor="email" color={textColor}>
                        Email address
                      </FormLabel>
                      <Input
                        id="email"
                        type="email"
                        {...register("email")}
                        _focus={{
                          borderColor: "brand.500",
                          boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                        }}
                      />
                      {errors.email && (
                        <ChakraFormErrorMessage>
                          {errors.email.message}
                        </ChakraFormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.password}>
                      <FormLabel htmlFor="password" color={textColor}>
                        Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          id="password"
                          type={showPassword ? "text" : "password"}
                          {...register("password")}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-500)",
                          }}
                        />
                        <InputRightElement h="full">
                          <IconButton
                            aria-label={
                              showPassword ? "Hide password" : "Show password"
                            }
                            variant="ghost"
                            icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                            onClick={() => setShowPassword(!showPassword)}
                            color="gray.500"
                            _hover={{ color: "brand.500" }}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {errors.password && (
                        <ChakraFormErrorMessage>
                          {errors.password.message}
                        </ChakraFormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.confirmPassword}>
                      <FormLabel htmlFor="confirmPassword" color={textColor}>
                        Confirm Password
                      </FormLabel>
                      <InputGroup>
                        <Input
                          id="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          {...register("confirmPassword")}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-500)",
                          }}
                        />
                        <InputRightElement h="full">
                          <IconButton
                            aria-label={
                              showConfirmPassword
                                ? "Hide password"
                                : "Show password"
                            }
                            variant="ghost"
                            icon={
                              showConfirmPassword ? (
                                <ViewOffIcon />
                              ) : (
                                <ViewIcon />
                              )
                            }
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            color="gray.500"
                            _hover={{ color: "brand.500" }}
                          />
                        </InputRightElement>
                      </InputGroup>
                      {errors.confirmPassword && (
                        <ChakraFormErrorMessage>
                          {errors.confirmPassword.message}
                        </ChakraFormErrorMessage>
                      )}
                    </FormControl>

                    <FormControl isInvalid={!!errors.terms}>
                      <Checkbox {...register("terms")} colorScheme="brand">
                        <Text color={textColor}>
                          I agree to the Terms of Service and Privacy Policy
                        </Text>
                      </Checkbox>
                      {errors.terms && (
                        <ChakraFormErrorMessage>
                          {errors.terms.message}
                        </ChakraFormErrorMessage>
                      )}
                    </FormControl>

                    <Divider />

                    <Button
                      type="submit"
                      size="lg"
                      colorScheme="brand"
                      isLoading={isSubmitting}
                      loadingText="Submitting"
                      w="full"
                    >
                      Sign up
                    </Button>
                  </Stack>
                </form>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack align="start" spacing={6}>
              <Text color={textColor}>
                This form demonstrates the basics of form validation with React
                Hook Form and Zod. Key concepts covered include:
              </Text>

              <Box as="ul" pl={5} alignSelf="stretch" color={textColor}>
                <Box as="li" mt={2}>
                  Required field validation
                </Box>
                <Box as="li" mt={2}>
                  Email format validation
                </Box>
                <Box as="li" mt={2}>
                  Password validation with multiple rules (min length,
                  uppercase, lowercase, numbers, special chars)
                </Box>
                <Box as="li" mt={2}>
                  Password confirmation validation
                </Box>
                <Box as="li" mt={2}>
                  Checkbox validation (terms acceptance)
                </Box>
                <Box as="li" mt={2}>
                  Form submission handling
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
