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
  Heading,
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
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import {
  basicRegistrationSchema,
  type BasicRegistrationFormData,
} from "../../schemas/basicRegistrationSchema";

export default function BasicRegistrationForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);

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
        setIsSubmitSuccessful(true);
        reset();
        resolve();
        // Hide success message after 5 seconds
        setTimeout(() => setIsSubmitSuccessful(false), 5000);
      }, 1500);
    });
  };

  return (
    <Box>
      <VStack spacing={8} mx="auto" maxW="lg" py={12} px={6}>
        <VStack spacing={2} textAlign="center" w="full">
          <Heading fontSize="3xl">Create Your Account</Heading>
          <Text fontSize="lg" color="gray.500">
            to enjoy all of our features ✌️
          </Text>
        </VStack>

        {isSubmitSuccessful && (
          <Alert
            status="success"
            variant="subtle"
            flexDirection="column"
            alignItems="center"
            justifyContent="center"
            textAlign="center"
            borderRadius="md"
          >
            <AlertIcon boxSize="40px" mr={0} />
            <AlertTitle mt={4} mb={1} fontSize="lg">
              Registration Successful!
            </AlertTitle>
            <AlertDescription maxWidth="sm">
              Your account has been created successfully. You can now log in
              with your credentials.
            </AlertDescription>
            <CloseButton
              position="absolute"
              right="8px"
              top="8px"
              onClick={() => setIsSubmitSuccessful(false)}
            />
          </Alert>
        )}

        <Box
          rounded="lg"
          bg={useColorModeValue("white", "gray.700")}
          boxShadow="lg"
          p={8}
          w="full"
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={4}>
              <Flex gap={4} direction={{ base: "column", sm: "row" }}>
                <FormControl isInvalid={!!errors.firstName}>
                  <FormLabel htmlFor="firstName">First Name</FormLabel>
                  <Input
                    id="firstName"
                    type="text"
                    {...register("firstName")}
                  />
                  {errors.firstName && (
                    <ChakraFormErrorMessage>
                      {errors.firstName.message}
                    </ChakraFormErrorMessage>
                  )}
                </FormControl>

                <FormControl isInvalid={!!errors.lastName}>
                  <FormLabel htmlFor="lastName">Last Name</FormLabel>
                  <Input id="lastName" type="text" {...register("lastName")} />
                  {errors.lastName && (
                    <ChakraFormErrorMessage>
                      {errors.lastName.message}
                    </ChakraFormErrorMessage>
                  )}
                </FormControl>
              </Flex>

              <FormControl isInvalid={!!errors.email}>
                <FormLabel htmlFor="email">Email address</FormLabel>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && (
                  <ChakraFormErrorMessage>
                    {errors.email.message}
                  </ChakraFormErrorMessage>
                )}
              </FormControl>

              <FormControl isInvalid={!!errors.password}>
                <FormLabel htmlFor="password">Password</FormLabel>
                <InputGroup>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...register("password")}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={
                        showPassword ? "Hide password" : "Show password"
                      }
                      variant="ghost"
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
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
                <FormLabel htmlFor="confirmPassword">
                  Confirm Password
                </FormLabel>
                <InputGroup>
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    {...register("confirmPassword")}
                  />
                  <InputRightElement h="full">
                    <IconButton
                      aria-label={
                        showConfirmPassword ? "Hide password" : "Show password"
                      }
                      variant="ghost"
                      icon={
                        showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />
                      }
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
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
                <Checkbox {...register("terms")}>
                  I agree to the Terms of Service and Privacy Policy
                </Checkbox>
                {errors.terms && (
                  <ChakraFormErrorMessage>
                    {errors.terms.message}
                  </ChakraFormErrorMessage>
                )}
              </FormControl>

              <Stack spacing={10} pt={2}>
                <Button
                  type="submit"
                  size="lg"
                  bg="brand.500"
                  color="white"
                  _hover={{
                    bg: "brand.600",
                  }}
                  isLoading={isSubmitting}
                  loadingText="Submitting"
                >
                  Sign up
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </VStack>
    </Box>
  );
}
