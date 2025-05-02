import { useState, useRef } from "react";
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
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { FaNetworkWired } from "react-icons/fa";
import FormPageLayout from "../../components/layout/FormPageLayout";
import CodeBlock from "../../components/ui/CodeBlock";
import { z } from "zod";
import { nestedObjectsFormSampleData } from "../../utils/SampleData";
import { MdAutoFixHigh } from "react-icons/md";

// Define the schema directly in the component file for simplicity
const basicInfoSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
});

const addressSchema = z.object({
  street: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State/Province is required" }),
  zipCode: z.string().min(1, { message: "ZIP/Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
});

const paymentSchema = z.object({
  method: z.enum(["creditCard", "paypal", "bankTransfer"]),
  cardNumber: z.string().optional(),
  cardholderName: z.string().optional(),
  expiryDate: z.string().optional(),
  cvv: z.string().optional(),
  paypalEmail: z.string().optional(),
  accountNumber: z.string().optional(),
  routingNumber: z.string().optional(),
  accountName: z.string().optional(),
  bankName: z.string().optional(),
});

const subscriptionSchema = z.object({
  plan: z.enum(["basic", "premium", "enterprise"]),
  billingCycle: z.enum(["monthly", "quarterly", "annual"]),
  autoRenew: z.boolean().default(true),
  emailNotifications: z.boolean().default(true),
  smsNotifications: z.boolean().default(false),
  promoNotifications: z.boolean().default(false),
});

// Main form schema
const formSchema = z.object({
  basicInfo: basicInfoSchema,
  address: addressSchema,
  payment: paymentSchema,
  subscription: subscriptionSchema,
  termsAccepted: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions",
  }),
});

// Infer TypeScript type from the schema
type FormData = z.infer<typeof formSchema>;

export default function NestedObjectsForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  const alertRef = useRef<HTMLDivElement>(null);
  const [accordionIndexes, setAccordionIndexes] = useState<number[]>([0]);
  const fillWithSampleData = () => {
    reset(nestedObjectsFormSampleData as any); // Use type assertion to bypass type checking
  };

  // Color modes
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const successBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const sectionBg = useColorModeValue("gray.50", "gray.700");
  const accordionBg = useColorModeValue("gray.50", "gray.700");

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      basicInfo: {
        name: "",
        email: "",
        phone: "",
      },
      address: {
        street: "",
        city: "",
        state: "",
        zipCode: "",
        country: "",
      },
      payment: {
        method: "creditCard",
        cardNumber: "",
        cardholderName: "",
        expiryDate: "",
        cvv: "",
        paypalEmail: "",
        accountNumber: "",
        routingNumber: "",
        accountName: "",
        bankName: "",
      },
      subscription: {
        plan: "basic",
        billingCycle: "monthly",
        autoRenew: true,
        emailNotifications: true,
        smsNotifications: false,
        promoNotifications: false,
      },
      termsAccepted: false,
    },
  });

  // Watch payment method to conditionally render fields
  const paymentMethod = watch("payment.method");

  const onSubmit = (data: FormData) => {
    console.log("Form submitted:", data);

    // Simulate API call
    setTimeout(() => {
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
    }, 1500);
  };

  // Function to handle accordion change
  const handleAccordionChange = (expandedIndexes: number[]) => {
    setAccordionIndexes(expandedIndexes);
  };

  // Code example for the documentation tab
  const zodSchemaCode = `import { z } from 'zod'

// Basic Information Schema
const basicInfoSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  email: z.string().email({ message: "Please enter a valid email address" }),
  phone: z.string().min(10, { message: "Please enter a valid phone number" }),
})

// Address Schema
const addressSchema = z.object({
  street: z.string().min(1, { message: "Street address is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State/Province is required" }),
  zipCode: z.string().min(1, { message: "ZIP/Postal code is required" }),
  country: z.string().min(1, { message: "Country is required" }),
})

// Payment Schema
const paymentSchema = z.object({
  method: z.enum(["creditCard", "paypal", "bankTransfer"]),
  cardNumber: z.string().optional(),
  cardholderName: z.string().optional(),
  // ... other payment fields
})

// Subscription Schema
const subscriptionSchema = z.object({
  plan: z.enum(["basic", "premium", "enterprise"]),
  billingCycle: z.enum(["monthly", "quarterly", "annual"]),
  autoRenew: z.boolean().default(true),
  // ... notification preferences
})

// Main form schema
const formSchema = z.object({
  basicInfo: basicInfoSchema,
  address: addressSchema,
  payment: paymentSchema,
  subscription: subscriptionSchema,
  termsAccepted: z.boolean().refine(val => val === true, { 
    message: "You must accept the terms and conditions" 
  }),
})`;

  const reactHookFormCode = `// Setup React Hook Form with nested objects
const {
  register,
  handleSubmit,
  watch,
  formState: { errors },
} = useForm<FormData>({
  resolver: zodResolver(formSchema),
  defaultValues: {
    basicInfo: {
      name: "",
      email: "",
      // Other defaults...
    },
    // ... other nested objects with defaults
  },
})

// Watch payment method to conditionally render fields
const paymentMethod = watch("payment.method")

// Handle form submission
const onSubmit = (data: FormData) => {
  console.log("Form submitted:", data);
  // Process the data...
}

// JSX form with nested fields
<Box as="form" onSubmit={handleSubmit(onSubmit)}>
  {/* Basic Info Section */}
  <FormControl isInvalid={!!errors.basicInfo?.name} isRequired>
    <FormLabel>Full Name</FormLabel>
    <Input {...register("basicInfo.name")} />
    {errors.basicInfo?.name && (
      <FormErrorMessage>{errors.basicInfo.name.message}</FormErrorMessage>
    )}
  </FormControl>
  
  {/* Conditional rendering based on payment method */}
  {paymentMethod === "creditCard" && (
    <FormControl isInvalid={!!errors.payment?.cardNumber} isRequired>
      <FormLabel>Card Number</FormLabel>
      <Input {...register("payment.cardNumber")} />
      {errors.payment?.cardNumber && (
        <FormErrorMessage>{errors.payment.cardNumber.message}</FormErrorMessage>
      )}
    </FormControl>
  )}
  
  {/* ... other form fields ... */}
  
  <Button type="submit">Submit</Button>
</Box>`;

  return (
    <FormPageLayout
      title="Nested Object Forms"
      description="Structure complex forms with deeply nested objects while maintaining clean validation and error handling."
      icon={FaNetworkWired}
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
                      Your nested form data has been submitted successfully.
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
                  <Flex
                    justifyContent="space-between"
                    alignItems="center"
                    mb={4}
                  >
                    <Heading size="md" color={textColor}>
                      Subscription Form
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

                  <Accordion
                    allowMultiple
                    index={accordionIndexes}
                    onChange={(expandedIndexes: number[]) =>
                      handleAccordionChange(expandedIndexes)
                    }
                  >
                    {/* Basic Information Section */}
                    <AccordionItem
                      border="1px"
                      borderColor={cardBorder}
                      borderRadius="md"
                      mb={4}
                    >
                      <AccordionButton bg={accordionBg} borderRadius="md">
                        <Box flex="1" textAlign="left" fontWeight="medium">
                          1. Basic Information
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                          <FormControl
                            isInvalid={!!errors.basicInfo?.name}
                            isRequired
                          >
                            <FormLabel
                              htmlFor="basicInfo.name"
                              color={textColor}
                            >
                              Full Name
                            </FormLabel>
                            <Input
                              id="basicInfo.name"
                              placeholder="Enter your full name"
                              {...register("basicInfo.name")}
                            />
                            {errors.basicInfo?.name && (
                              <FormErrorMessage>
                                {errors.basicInfo.name.message}
                              </FormErrorMessage>
                            )}
                          </FormControl>

                          <FormControl
                            isInvalid={!!errors.basicInfo?.email}
                            isRequired
                          >
                            <FormLabel
                              htmlFor="basicInfo.email"
                              color={textColor}
                            >
                              Email Address
                            </FormLabel>
                            <Input
                              id="basicInfo.email"
                              type="email"
                              placeholder="Enter your email"
                              {...register("basicInfo.email")}
                            />
                            {errors.basicInfo?.email && (
                              <FormErrorMessage>
                                {errors.basicInfo.email.message}
                              </FormErrorMessage>
                            )}
                          </FormControl>

                          <FormControl
                            isInvalid={!!errors.basicInfo?.phone}
                            isRequired
                          >
                            <FormLabel
                              htmlFor="basicInfo.phone"
                              color={textColor}
                            >
                              Phone Number
                            </FormLabel>
                            <Input
                              id="basicInfo.phone"
                              placeholder="Enter your phone number"
                              {...register("basicInfo.phone")}
                            />
                            {errors.basicInfo?.phone && (
                              <FormErrorMessage>
                                {errors.basicInfo.phone.message}
                              </FormErrorMessage>
                            )}
                          </FormControl>
                        </SimpleGrid>
                      </AccordionPanel>
                    </AccordionItem>

                    {/* Address Section */}
                    <AccordionItem
                      border="1px"
                      borderColor={cardBorder}
                      borderRadius="md"
                      mb={4}
                    >
                      <AccordionButton bg={accordionBg} borderRadius="md">
                        <Box flex="1" textAlign="left" fontWeight="medium">
                          2. Address Information
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <VStack spacing={6}>
                          <FormControl
                            isInvalid={!!errors.address?.street}
                            isRequired
                          >
                            <FormLabel
                              htmlFor="address.street"
                              color={textColor}
                            >
                              Street Address
                            </FormLabel>
                            <Input
                              id="address.street"
                              placeholder="Enter street address"
                              {...register("address.street")}
                            />
                            {errors.address?.street && (
                              <FormErrorMessage>
                                {errors.address.street.message}
                              </FormErrorMessage>
                            )}
                          </FormControl>

                          <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            spacing={6}
                            width="100%"
                          >
                            <FormControl
                              isInvalid={!!errors.address?.city}
                              isRequired
                            >
                              <FormLabel
                                htmlFor="address.city"
                                color={textColor}
                              >
                                City
                              </FormLabel>
                              <Input
                                id="address.city"
                                placeholder="Enter city"
                                {...register("address.city")}
                              />
                              {errors.address?.city && (
                                <FormErrorMessage>
                                  {errors.address.city.message}
                                </FormErrorMessage>
                              )}
                            </FormControl>

                            <FormControl
                              isInvalid={!!errors.address?.state}
                              isRequired
                            >
                              <FormLabel
                                htmlFor="address.state"
                                color={textColor}
                              >
                                State/Province
                              </FormLabel>
                              <Input
                                id="address.state"
                                placeholder="Enter state or province"
                                {...register("address.state")}
                              />
                              {errors.address?.state && (
                                <FormErrorMessage>
                                  {errors.address.state.message}
                                </FormErrorMessage>
                              )}
                            </FormControl>
                          </SimpleGrid>

                          <SimpleGrid
                            columns={{ base: 1, md: 2 }}
                            spacing={6}
                            width="100%"
                          >
                            <FormControl
                              isInvalid={!!errors.address?.zipCode}
                              isRequired
                            >
                              <FormLabel
                                htmlFor="address.zipCode"
                                color={textColor}
                              >
                                ZIP/Postal Code
                              </FormLabel>
                              <Input
                                id="address.zipCode"
                                placeholder="Enter ZIP or postal code"
                                {...register("address.zipCode")}
                              />
                              {errors.address?.zipCode && (
                                <FormErrorMessage>
                                  {errors.address.zipCode.message}
                                </FormErrorMessage>
                              )}
                            </FormControl>

                            <FormControl
                              isInvalid={!!errors.address?.country}
                              isRequired
                            >
                              <FormLabel
                                htmlFor="address.country"
                                color={textColor}
                              >
                                Country
                              </FormLabel>
                              <Input
                                id="address.country"
                                placeholder="Enter country"
                                {...register("address.country")}
                              />
                              {errors.address?.country && (
                                <FormErrorMessage>
                                  {errors.address.country.message}
                                </FormErrorMessage>
                              )}
                            </FormControl>
                          </SimpleGrid>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>

                    {/* Payment Section */}
                    <AccordionItem
                      border="1px"
                      borderColor={cardBorder}
                      borderRadius="md"
                      mb={4}
                    >
                      <AccordionButton bg={accordionBg} borderRadius="md">
                        <Box flex="1" textAlign="left" fontWeight="medium">
                          3. Payment Details
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <VStack spacing={6} align="stretch">
                          <FormControl
                            isInvalid={!!errors.payment?.method}
                            isRequired
                          >
                            <FormLabel
                              htmlFor="payment.method"
                              color={textColor}
                            >
                              Payment Method
                            </FormLabel>
                            <Select
                              id="payment.method"
                              {...register("payment.method")}
                            >
                              <option value="creditCard">Credit Card</option>
                              <option value="paypal">PayPal</option>
                              <option value="bankTransfer">
                                Bank Transfer
                              </option>
                            </Select>
                            {errors.payment?.method && (
                              <FormErrorMessage>
                                {errors.payment.method.message}
                              </FormErrorMessage>
                            )}
                          </FormControl>

                          {/* Credit Card Fields */}
                          {paymentMethod === "creditCard" && (
                            <Box
                              p={4}
                              bg={sectionBg}
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor={cardBorder}
                            >
                              <VStack spacing={4}>
                                <FormControl
                                  isInvalid={!!errors.payment?.cardNumber}
                                  isRequired
                                >
                                  <FormLabel
                                    htmlFor="payment.cardNumber"
                                    color={textColor}
                                  >
                                    Card Number
                                  </FormLabel>
                                  <Input
                                    id="payment.cardNumber"
                                    placeholder="1234567890123456"
                                    {...register("payment.cardNumber")}
                                  />
                                  {errors.payment?.cardNumber && (
                                    <FormErrorMessage>
                                      {errors.payment.cardNumber.message}
                                    </FormErrorMessage>
                                  )}
                                </FormControl>

                                <FormControl
                                  isInvalid={!!errors.payment?.cardholderName}
                                  isRequired
                                >
                                  <FormLabel
                                    htmlFor="payment.cardholderName"
                                    color={textColor}
                                  >
                                    Cardholder Name
                                  </FormLabel>
                                  <Input
                                    id="payment.cardholderName"
                                    placeholder="John Doe"
                                    {...register("payment.cardholderName")}
                                  />
                                  {errors.payment?.cardholderName && (
                                    <FormErrorMessage>
                                      {errors.payment.cardholderName.message}
                                    </FormErrorMessage>
                                  )}
                                </FormControl>

                                <SimpleGrid
                                  columns={2}
                                  spacing={4}
                                  width="100%"
                                >
                                  <FormControl
                                    isInvalid={!!errors.payment?.expiryDate}
                                    isRequired
                                  >
                                    <FormLabel
                                      htmlFor="payment.expiryDate"
                                      color={textColor}
                                    >
                                      Expiry Date (MM/YY)
                                    </FormLabel>
                                    <Input
                                      id="payment.expiryDate"
                                      placeholder="05/24"
                                      {...register("payment.expiryDate")}
                                    />
                                    {errors.payment?.expiryDate && (
                                      <FormErrorMessage>
                                        {errors.payment.expiryDate.message}
                                      </FormErrorMessage>
                                    )}
                                  </FormControl>

                                  <FormControl
                                    isInvalid={!!errors.payment?.cvv}
                                    isRequired
                                  >
                                    <FormLabel
                                      htmlFor="payment.cvv"
                                      color={textColor}
                                    >
                                      CVV
                                    </FormLabel>
                                    <Input
                                      id="payment.cvv"
                                      placeholder="123"
                                      type="password"
                                      maxLength={4}
                                      {...register("payment.cvv")}
                                    />
                                    {errors.payment?.cvv && (
                                      <FormErrorMessage>
                                        {errors.payment.cvv.message}
                                      </FormErrorMessage>
                                    )}
                                  </FormControl>
                                </SimpleGrid>
                              </VStack>
                            </Box>
                          )}

                          {/* PayPal Fields */}
                          {paymentMethod === "paypal" && (
                            <Box
                              p={4}
                              bg={sectionBg}
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor={cardBorder}
                            >
                              <FormControl
                                isInvalid={!!errors.payment?.paypalEmail}
                                isRequired
                              >
                                <FormLabel
                                  htmlFor="payment.paypalEmail"
                                  color={textColor}
                                >
                                  PayPal Email
                                </FormLabel>
                                <Input
                                  id="payment.paypalEmail"
                                  type="email"
                                  placeholder="your-email@paypal.com"
                                  {...register("payment.paypalEmail")}
                                />
                                {errors.payment?.paypalEmail && (
                                  <FormErrorMessage>
                                    {errors.payment.paypalEmail.message}
                                  </FormErrorMessage>
                                )}
                              </FormControl>
                            </Box>
                          )}

                          {/* Bank Transfer Fields */}
                          {paymentMethod === "bankTransfer" && (
                            <Box
                              p={4}
                              bg={sectionBg}
                              borderRadius="md"
                              borderWidth="1px"
                              borderColor={cardBorder}
                            >
                              <VStack spacing={4}>
                                <SimpleGrid
                                  columns={{ base: 1, md: 2 }}
                                  spacing={4}
                                  width="100%"
                                >
                                  <FormControl
                                    isInvalid={!!errors.payment?.accountNumber}
                                    isRequired
                                  >
                                    <FormLabel
                                      htmlFor="payment.accountNumber"
                                      color={textColor}
                                    >
                                      Account Number
                                    </FormLabel>
                                    <Input
                                      id="payment.accountNumber"
                                      placeholder="Enter account number"
                                      {...register("payment.accountNumber")}
                                    />
                                    {errors.payment?.accountNumber && (
                                      <FormErrorMessage>
                                        {errors.payment.accountNumber.message}
                                      </FormErrorMessage>
                                    )}
                                  </FormControl>

                                  <FormControl
                                    isInvalid={!!errors.payment?.routingNumber}
                                    isRequired
                                  >
                                    <FormLabel
                                      htmlFor="payment.routingNumber"
                                      color={textColor}
                                    >
                                      Routing Number
                                    </FormLabel>
                                    <Input
                                      id="payment.routingNumber"
                                      placeholder="Enter routing number"
                                      {...register("payment.routingNumber")}
                                    />
                                    {errors.payment?.routingNumber && (
                                      <FormErrorMessage>
                                        {errors.payment.routingNumber.message}
                                      </FormErrorMessage>
                                    )}
                                  </FormControl>
                                </SimpleGrid>

                                <SimpleGrid
                                  columns={{ base: 1, md: 2 }}
                                  spacing={4}
                                  width="100%"
                                >
                                  <FormControl
                                    isInvalid={!!errors.payment?.accountName}
                                    isRequired
                                  >
                                    <FormLabel
                                      htmlFor="payment.accountName"
                                      color={textColor}
                                    >
                                      Account Name
                                    </FormLabel>
                                    <Input
                                      id="payment.accountName"
                                      placeholder="Enter account name"
                                      {...register("payment.accountName")}
                                    />
                                    {errors.payment?.accountName && (
                                      <FormErrorMessage>
                                        {errors.payment.accountName.message}
                                      </FormErrorMessage>
                                    )}
                                  </FormControl>

                                  <FormControl
                                    isInvalid={!!errors.payment?.bankName}
                                    isRequired
                                  >
                                    <FormLabel
                                      htmlFor="payment.bankName"
                                      color={textColor}
                                    >
                                      Bank Name
                                    </FormLabel>
                                    <Input
                                      id="payment.bankName"
                                      placeholder="Enter bank name"
                                      {...register("payment.bankName")}
                                    />
                                    {errors.payment?.bankName && (
                                      <FormErrorMessage>
                                        {errors.payment.bankName.message}
                                      </FormErrorMessage>
                                    )}
                                  </FormControl>
                                </SimpleGrid>
                              </VStack>
                            </Box>
                          )}
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>

                    {/* Subscription Section */}
                    <AccordionItem
                      border="1px"
                      borderColor={cardBorder}
                      borderRadius="md"
                      mb={4}
                    >
                      <AccordionButton bg={accordionBg} borderRadius="md">
                        <Box flex="1" textAlign="left" fontWeight="medium">
                          4. Subscription Details
                        </Box>
                        <AccordionIcon />
                      </AccordionButton>
                      <AccordionPanel pb={4}>
                        <VStack spacing={6} align="stretch">
                          <FormControl
                            isInvalid={!!errors.subscription?.plan}
                            isRequired
                          >
                            <FormLabel
                              htmlFor="subscription.plan"
                              color={textColor}
                            >
                              Subscription Plan
                            </FormLabel>
                            <Select
                              id="subscription.plan"
                              {...register("subscription.plan")}
                            >
                              <option value="basic">
                                Basic Plan ($9.99/month)
                              </option>
                              <option value="premium">
                                Premium Plan ($19.99/month)
                              </option>
                              <option value="enterprise">
                                Enterprise Plan ($49.99/month)
                              </option>
                            </Select>
                            {errors.subscription?.plan && (
                              <FormErrorMessage>
                                {errors.subscription.plan.message}
                              </FormErrorMessage>
                            )}
                          </FormControl>

                          <Box
                            p={4}
                            bg={sectionBg}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={cardBorder}
                          >
                            <Text fontWeight="medium" mb={4} color={textColor}>
                              Billing Settings
                            </Text>
                            <VStack spacing={4} align="stretch">
                              <FormControl
                                isInvalid={!!errors.subscription?.billingCycle}
                                isRequired
                              >
                                <FormLabel
                                  htmlFor="subscription.billingCycle"
                                  color={textColor}
                                >
                                  Billing Cycle
                                </FormLabel>
                                <Select
                                  id="subscription.billingCycle"
                                  {...register("subscription.billingCycle")}
                                >
                                  <option value="monthly">Monthly</option>
                                  <option value="quarterly">
                                    Quarterly (10% off)
                                  </option>
                                  <option value="annual">
                                    Annual (20% off)
                                  </option>
                                </Select>
                                {errors.subscription?.billingCycle && (
                                  <FormErrorMessage>
                                    {errors.subscription.billingCycle.message}
                                  </FormErrorMessage>
                                )}
                              </FormControl>

                              <FormControl>
                                <Checkbox
                                  id="subscription.autoRenew"
                                  colorScheme="brand"
                                  {...register("subscription.autoRenew")}
                                >
                                  <Text fontSize="sm" color={textColor}>
                                    Auto-renew subscription
                                  </Text>
                                </Checkbox>
                              </FormControl>
                            </VStack>
                          </Box>

                          <Box
                            p={4}
                            bg={sectionBg}
                            borderRadius="md"
                            borderWidth="1px"
                            borderColor={cardBorder}
                          >
                            <Text fontWeight="medium" mb={4} color={textColor}>
                              Notification Preferences
                            </Text>
                            <VStack spacing={3} align="stretch">
                              <FormControl>
                                <Checkbox
                                  id="subscription.emailNotifications"
                                  colorScheme="brand"
                                  {...register(
                                    "subscription.emailNotifications"
                                  )}
                                >
                                  <Text fontSize="sm" color={textColor}>
                                    Receive email notifications
                                  </Text>
                                </Checkbox>
                              </FormControl>

                              <FormControl>
                                <Checkbox
                                  id="subscription.smsNotifications"
                                  colorScheme="brand"
                                  {...register("subscription.smsNotifications")}
                                >
                                  <Text fontSize="sm" color={textColor}>
                                    Receive SMS notifications
                                  </Text>
                                </Checkbox>
                              </FormControl>

                              <FormControl>
                                <Checkbox
                                  id="subscription.promoNotifications"
                                  colorScheme="brand"
                                  {...register(
                                    "subscription.promoNotifications"
                                  )}
                                >
                                  <Text fontSize="sm" color={textColor}>
                                    Receive promotional offers
                                  </Text>
                                </Checkbox>
                              </FormControl>
                            </VStack>
                          </Box>
                        </VStack>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>

                  <Divider />

                  <FormControl isInvalid={!!errors.termsAccepted} isRequired>
                    <Checkbox
                      id="termsAccepted"
                      colorScheme="brand"
                      {...register("termsAccepted")}
                    >
                      <Text fontSize="sm" color={textColor}>
                        I accept the terms and conditions and acknowledge the
                        privacy policy.
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
                  >
                    Submit
                  </Button>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack spacing={6} align="stretch" py={5}>
              <Box>
                <Heading size="md" mb={4} color={textColor}>
                  1. Zod Schema for Nested Objects
                </Heading>
                <Text mb={4} color={mutedTextColor}>
                  Create a complex validation schema that handles nested objects
                  with Zod. This approach lets you organize related fields into
                  logical groups.
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
                  2. React Hook Form Implementation
                </Heading>
                <Text mb={4} color={mutedTextColor}>
                  See how to structure and manage nested form fields with React
                  Hook Form.
                </Text>
                <Box
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="md"
                  overflow="hidden"
                >
                  <CodeBlock code={reactHookFormCode} language="typescript" />
                </Box>
              </Box>

              <Box>
                <Heading size="md" mb={4} color={textColor}>
                  3. Implementation Notes
                </Heading>
                <VStack align="stretch" spacing={4} color={mutedTextColor}>
                  <Text>
                    • Nested objects provide a clean way to organize related
                    form fields, especially for complex forms.
                  </Text>
                  <Text>
                    • When accessing nested fields in React Hook Form, use dot
                    notation (e.g., "address.street").
                  </Text>
                  <Text>
                    • Error handling requires checking for the existence of
                    parent objects before accessing nested errors.
                  </Text>
                  <Text>
                    • Conditional validation with Zod's refine method allows for
                    complex rules based on field relationships.
                  </Text>
                  <Text>
                    • Default values for nested objects should mirror the
                    structure of your schema.
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
