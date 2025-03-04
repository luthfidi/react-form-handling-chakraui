import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormLabel,
  Input,
  Select,
  Text,
  useColorModeValue,
  VStack,
  FormErrorMessage,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  SimpleGrid,
  Divider,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
} from "@chakra-ui/react";
import { FaRandom } from "react-icons/fa";
import FormPageLayout from "../../components/layout/FormPageLayout";
import CodeBlock from "../../components/ui/CodeBlock";
import {
  dependentFieldsSchema,
  employmentTypeEnum,
  productTypeEnum,
  type DependentFieldsFormData,
} from "../../schemas/dependentFieldsSchema";

export default function DependentFieldsForm() {
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [formData, setFormData] = useState<DependentFieldsFormData | null>(
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
    watch,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<DependentFieldsFormData>({
    resolver: zodResolver(dependentFieldsSchema),
    defaultValues: {
      name: "",
      email: "",
      employmentType: "employed",
      companyName: "",
      position: "",
      businessName: "",
      businessType: "",
      schoolName: "",
      degree: "",
      previousEmployer: "",
      productType: "physical",
      shippingAddress: "",
      downloadPreference: "",
      billingCycle: "",
      termsAccepted: false,
    },
  });

  // Watch for changes to fields that determine conditional rendering
  const employmentType = watch("employmentType");
  const productType = watch("productType");

  const onSubmit = (data: DependentFieldsFormData) => {
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

  // Code examples as constants
  const zodSchemaCode = `import { z } from 'zod'

// Employment Type Enum
export const employmentTypeEnum = ['employed', 'self-employed', 'student', 'unemployed', 'retired'] as const

// Product Type Enum
export const productTypeEnum = ['physical', 'digital', 'subscription'] as const

// Base Schema
export const dependentFieldsSchema = z.object({
  // Basic fields always shown
  name: z.string().min(2),
  email: z.string().email(),
  
  // Selection field that determines which other fields to show
  employmentType: z.enum(employmentTypeEnum),
  
  // Conditional fields based on employment status
  companyName: z.string().optional(),
  position: z.string().optional(),
  businessName: z.string().optional(),
  // ...other fields...
  
  // Another dependent field group
  productType: z.enum(productTypeEnum),
  
  // Fields that depend on product type
  shippingAddress: z.string().optional(),
  downloadPreference: z.string().optional(),
  billingCycle: z.string().optional(),
  
  termsAccepted: z.boolean().refine(val => val === true),
})
.refine(
  (data) => {
    // If employed, company name and position are required
    if (data.employmentType === 'employed') {
      return !!data.companyName && !!data.position;
    }
    return true;
  },
  {
    message: "Company name and position are required for employed individuals",
    path: ["companyName"],
  }
)
// Additional refinements for other employment types...
.refine(
  (data) => {
    // If physical product, shipping address is required
    if (data.productType === 'physical') {
      return !!data.shippingAddress;
    }
    return true;
  },
  {
    message: "Shipping address is required for physical products",
    path: ["shippingAddress"],
  }
)
// Additional refinements for other product types...`;

  const reactHookFormCode = `// Hook into the form with React Hook Form
const {
  register,
  handleSubmit,
  watch, // Important: we need to watch values to conditionally render fields
  formState: { errors },
  reset,
} = useForm<DependentFieldsFormData>({
  resolver: zodResolver(dependentFieldsSchema),
  defaultValues: {
    // Default values here
  },
})

// Watch for changes to fields that determine conditional rendering
const employmentType = watch('employmentType')
const productType = watch('productType')

// In the render function, conditionally show fields based on watched values
return (
  <form onSubmit={handleSubmit(onSubmit)}>
    {/* Always visible fields */}
    <FormControl>
      <FormLabel>Employment Type</FormLabel>
      <Select {...register('employmentType')}>
        {employmentTypeEnum.map(type => (
          <option key={type} value={type}>{type}</option>
        ))}
      </Select>
    </FormControl>
    
    {/* Conditionally shown fields */}
    {employmentType === 'employed' && (
      <>
        <FormControl isInvalid={!!errors.companyName}>
          <FormLabel>Company Name</FormLabel>
          <Input {...register('companyName')} />
          {errors.companyName && (
            <FormErrorMessage>{errors.companyName.message}</FormErrorMessage>
          )}
        </FormControl>
        
        <FormControl isInvalid={!!errors.position}>
          <FormLabel>Position</FormLabel>
          <Input {...register('position')} />
          {errors.position && (
            <FormErrorMessage>{errors.position.message}</FormErrorMessage>
          )}
        </FormControl>
      </>
    )}
    
    {/* And so on for other conditional fields */}
  </form>
)`;

  const renderEmploymentFields = () => {
    switch (employmentType) {
      case "employed":
        return (
          <>
            <FormControl isInvalid={!!errors.companyName} isRequired>
              <FormLabel htmlFor="companyName" color={textColor}>
                Company Name
              </FormLabel>
              <Input
                id="companyName"
                placeholder="Enter your company name"
                {...register("companyName")}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
              {errors.companyName && (
                <FormErrorMessage>
                  {errors.companyName.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.position} isRequired>
              <FormLabel htmlFor="position" color={textColor}>
                Position / Title
              </FormLabel>
              <Input
                id="position"
                placeholder="Enter your job title"
                {...register("position")}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
              {errors.position && (
                <FormErrorMessage>{errors.position.message}</FormErrorMessage>
              )}
            </FormControl>
          </>
        );

      case "self-employed":
        return (
          <>
            <FormControl isInvalid={!!errors.businessName} isRequired>
              <FormLabel htmlFor="businessName" color={textColor}>
                Business Name
              </FormLabel>
              <Input
                id="businessName"
                placeholder="Enter your business name"
                {...register("businessName")}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
              {errors.businessName && (
                <FormErrorMessage>
                  {errors.businessName.message}
                </FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.businessType} isRequired>
              <FormLabel htmlFor="businessType" color={textColor}>
                Business Type
              </FormLabel>
              <Input
                id="businessType"
                placeholder="Type of business"
                {...register("businessType")}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
              {errors.businessType && (
                <FormErrorMessage>
                  {errors.businessType.message}
                </FormErrorMessage>
              )}
            </FormControl>
          </>
        );

      case "student":
        return (
          <>
            <FormControl isInvalid={!!errors.schoolName} isRequired>
              <FormLabel htmlFor="schoolName" color={textColor}>
                School / University
              </FormLabel>
              <Input
                id="schoolName"
                placeholder="Enter your school name"
                {...register("schoolName")}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
              {errors.schoolName && (
                <FormErrorMessage>{errors.schoolName.message}</FormErrorMessage>
              )}
            </FormControl>

            <FormControl isInvalid={!!errors.degree} isRequired>
              <FormLabel htmlFor="degree" color={textColor}>
                Degree / Field of Study
              </FormLabel>
              <Input
                id="degree"
                placeholder="What are you studying?"
                {...register("degree")}
                _focus={{
                  borderColor: "brand.500",
                  boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
                }}
              />
              {errors.degree && (
                <FormErrorMessage>{errors.degree.message}</FormErrorMessage>
              )}
            </FormControl>
          </>
        );

      case "unemployed":
        return (
          <FormControl isInvalid={!!errors.previousEmployer}>
            <FormLabel htmlFor="previousEmployer" color={textColor}>
              Previous Employer (if any)
            </FormLabel>
            <Input
              id="previousEmployer"
              placeholder="Last company you worked for"
              {...register("previousEmployer")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {errors.previousEmployer && (
              <FormErrorMessage>
                {errors.previousEmployer.message}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      case "retired":
        return (
          <FormControl isInvalid={!!errors.previousEmployer}>
            <FormLabel htmlFor="previousEmployer" color={textColor}>
              Previous Career
            </FormLabel>
            <Input
              id="previousEmployer"
              placeholder="What was your career?"
              {...register("previousEmployer")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {errors.previousEmployer && (
              <FormErrorMessage>
                {errors.previousEmployer.message}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  const renderProductFields = () => {
    switch (productType) {
      case "physical":
        return (
          <FormControl isInvalid={!!errors.shippingAddress} isRequired>
            <FormLabel htmlFor="shippingAddress" color={textColor}>
              Shipping Address
            </FormLabel>
            <Input
              id="shippingAddress"
              placeholder="Enter your shipping address"
              {...register("shippingAddress")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {errors.shippingAddress && (
              <FormErrorMessage>
                {errors.shippingAddress.message}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      case "digital":
        return (
          <FormControl isInvalid={!!errors.downloadPreference} isRequired>
            <FormLabel htmlFor="downloadPreference" color={textColor}>
              Download Preference
            </FormLabel>
            <Select
              id="downloadPreference"
              placeholder="Select download preference"
              {...register("downloadPreference")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            >
              <option value="direct">Direct Download</option>
              <option value="email">Email Link</option>
              <option value="cloud">Cloud Storage</option>
            </Select>
            {errors.downloadPreference && (
              <FormErrorMessage>
                {errors.downloadPreference.message}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      case "subscription":
        return (
          <FormControl isInvalid={!!errors.billingCycle} isRequired>
            <FormLabel htmlFor="billingCycle" color={textColor}>
              Billing Cycle
            </FormLabel>
            <Select
              id="billingCycle"
              placeholder="Select billing cycle"
              {...register("billingCycle")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            >
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
            </Select>
            {errors.billingCycle && (
              <FormErrorMessage>{errors.billingCycle.message}</FormErrorMessage>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <FormPageLayout
      title="Dependent Fields Form"
      description="Build forms with conditional fields that appear or change based on values entered in other fields."
      icon={FaRandom}
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
                    Your information has been submitted successfully.
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
                maxW="800px"
                mx="auto"
                borderWidth="1px"
                borderColor={cardBorder}
              >
                <form onSubmit={handleSubmit(onSubmit)}>
                  <VStack spacing={6} align="stretch">
                    <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                      <FormControl isInvalid={!!errors.name} isRequired>
                        <FormLabel htmlFor="name" color={textColor}>
                          Full Name
                        </FormLabel>
                        <Input
                          id="name"
                          placeholder="Enter your full name"
                          {...register("name")}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-500)",
                          }}
                        />
                        {errors.name && (
                          <FormErrorMessage>
                            {errors.name.message}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                      <FormControl isInvalid={!!errors.email} isRequired>
                        <FormLabel htmlFor="email" color={textColor}>
                          Email Address
                        </FormLabel>
                        <Input
                          id="email"
                          type="email"
                          placeholder="Enter your email"
                          {...register("email")}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-500)",
                          }}
                        />
                        {errors.email && (
                          <FormErrorMessage>
                            {errors.email.message}
                          </FormErrorMessage>
                        )}
                      </FormControl>
                    </SimpleGrid>

                    <Divider />

                    <Box>
                      <Text
                        fontWeight="medium"
                        fontSize="lg"
                        mb={4}
                        color={textColor}
                      >
                        Employment Information
                      </Text>

                      <FormControl
                        isInvalid={!!errors.employmentType}
                        mb={4}
                        isRequired
                      >
                        <FormLabel htmlFor="employmentType" color={textColor}>
                          Employment Status
                        </FormLabel>
                        <Select
                          id="employmentType"
                          {...register("employmentType")}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-500)",
                          }}
                        >
                          {employmentTypeEnum.map((type) => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() +
                                type.slice(1).replace("-", " ")}
                            </option>
                          ))}
                        </Select>
                        {errors.employmentType && (
                          <FormErrorMessage>
                            {errors.employmentType.message}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                      <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
                        {renderEmploymentFields()}
                      </SimpleGrid>
                    </Box>

                    <Divider />

                    <Box>
                      <Text
                        fontWeight="medium"
                        fontSize="lg"
                        mb={4}
                        color={textColor}
                      >
                        Product Information
                      </Text>

                      <FormControl
                        isInvalid={!!errors.productType}
                        mb={4}
                        isRequired
                      >
                        <FormLabel htmlFor="productType" color={textColor}>
                          Product Type
                        </FormLabel>
                        <Select
                          id="productType"
                          {...register("productType")}
                          _focus={{
                            borderColor: "brand.500",
                            boxShadow:
                              "0 0 0 1px var(--chakra-colors-brand-500)",
                          }}
                        >
                          {productTypeEnum.map((type) => (
                            <option key={type} value={type}>
                              {type.charAt(0).toUpperCase() + type.slice(1)}
                            </option>
                          ))}
                        </Select>
                        {errors.productType && (
                          <FormErrorMessage>
                            {errors.productType.message}
                          </FormErrorMessage>
                        )}
                      </FormControl>

                      {renderProductFields()}
                    </Box>

                    <Divider />

                    <FormControl isInvalid={!!errors.termsAccepted}>
                      <Checkbox
                        {...register("termsAccepted")}
                        colorScheme="brand"
                      >
                        <Text color={textColor}>
                          I agree to the Terms of Service and Privacy Policy
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
                      size="lg"
                      colorScheme="brand"
                      isLoading={isSubmitting}
                      loadingText="Submitting"
                      w="full"
                    >
                      Submit
                    </Button>
                  </VStack>
                </form>
              </Box>
            </VStack>
          </TabPanel>
          <TabPanel>
            <VStack align="start" spacing={6}>
              <Text color={textColor}>
                This form demonstrates the implementation of
                dependent/conditional fields based on user selection. Key
                concepts covered include:
              </Text>

              <Box as="ul" pl={5} alignSelf="stretch" color={textColor}>
                <Box as="li" mt={2}>
                  Watching field values to conditionally render form sections
                </Box>
                <Box as="li" mt={2}>
                  Conditional validation based on field dependencies
                </Box>
                <Box as="li" mt={2}>
                  Using Zod's refine method to create complex validation rules
                </Box>
                <Box as="li" mt={2}>
                  Managing multiple dependent field groups in a single form
                </Box>
                <Box as="li" mt={2}>
                  Maintaining a clean user experience with dynamic form changes
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
