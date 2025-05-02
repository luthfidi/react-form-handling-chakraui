// InternationalizationForm.tsx - File utama
import { useState, useRef, useEffect } from "react";
import {
  Box,
  Container,
  VStack,
  Heading,
  Text,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  CloseButton,
  Divider,
  Code,
} from "@chakra-ui/react";
import { FaGlobe } from "react-icons/fa";
import FormPageLayout from "../../components/layout/FormPageLayout";
import I18nForm from "./components/I18nForm";
import LanguageSelector from "./components/LanguageSelector";
import CodeBlock from "../../components/ui/CodeBlock";
import {
  I18nFormData,
  uiTranslations,
  LanguageCode,
} from "../../schemas/internationalizationSchema";
import { useI18nFormStore } from "../../store/i18nFormStore";

export default function InternationalizationForm() {
  const { currentLanguage, detectBrowserLanguage } = useI18nFormStore();
  const [isSubmitSuccessful, setIsSubmitSuccessful] = useState(false);
  const [formData, setFormData] = useState<I18nFormData | null>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  // Color modes
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const successBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  // Detect browser language on first load
  useEffect(() => {
    detectBrowserLanguage();
  }, [detectBrowserLanguage]);

  // Create localized sample data based on language
  const getLocalizedSampleData = (language: LanguageCode): I18nFormData => {
    // Default data structure with common field structure
    const base: I18nFormData = {
      name: "",
      email: "",
      phone: "",
      message: "",
      preferredContact: "email" as "email" | "phone",
      terms: true, // Always checked
    };

    // Language-specific data
    switch (language) {
      case "en":
        return {
          ...base,
          name: "John Smith",
          email: "john.smith@example.com",
          phone: "+1 (555) 123-4567",
          message:
            "I'm interested in learning more about your services. Please contact me when convenient.",
        };
      case "id":
        return {
          ...base,
          name: "Budi Santoso",
          email: "budi.santoso@example.com",
          phone: "+62 812-3456-7890",
          message:
            "Saya tertarik untuk mempelajari lebih lanjut tentang layanan Anda. Mohon hubungi saya saat memungkinkan.",
        };
      case "es":
        return {
          ...base,
          name: "Carlos Rodríguez",
          email: "carlos.rodriguez@example.com",
          phone: "+34 612 345 678",
          message:
            "Estoy interesado en obtener más información sobre sus servicios. Por favor, contáctenme cuando sea conveniente.",
        };
      case "fr":
        return {
          ...base,
          name: "Marie Dubois",
          email: "marie.dubois@example.com",
          phone: "+33 6 12 34 56 78",
          message:
            "Je suis intéressé(e) à en savoir plus sur vos services. Veuillez me contacter à votre convenance.",
        };
      case "de":
        return {
          ...base,
          name: "Thomas Müller",
          email: "thomas.mueller@example.com",
          phone: "+49 151 1234 5678",
          message:
            "Ich interessiere mich für weitere Informationen über Ihre Dienstleistungen. Bitte kontaktieren Sie mich, wenn es Ihnen passt.",
        };
      case "ja":
        return {
          ...base,
          name: "田中 太郎",
          email: "tanaka.taro@example.com",
          phone: "+81 90-1234-5678",
          message:
            "御社のサービスについてもっと詳しく知りたいと思っています。ご都合の良いときにご連絡ください。",
        };
      case "zh":
        return {
          ...base,
          name: "李明",
          email: "li.ming@example.com",
          phone: "+86 138 1234 5678",
          message:
            "我有兴趣了解更多关于您公司服务的信息。请在方便的时候联系我。",
        };
      default:
        return base;
    }
  };

  // Handle form submission
  const handleSubmitSuccess = (data: I18nFormData) => {
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

  // Code examples
  const i18nSchemaCode = `import { z } from "zod";

// Define available languages
export const availableLanguages = [
  { code: "en", name: "English" },
  { code: "es", name: "Español" },
  { code: "fr", name: "Français" },
  // ...more languages
] as const;

export type LanguageCode = typeof availableLanguages[number]["code"];

// Create schema with localized error messages
export const createI18nSchema = (language: LanguageCode) => {
  // Get error messages for selected language
  const errorMessages = getErrorMessages(language);
  
  return z.object({
    name: z
      .string()
      .min(2, errorMessages.nameMin)
      .max(50, errorMessages.nameMax),
    email: z
      .string()
      .email(errorMessages.invalidEmail),
    // ...more field validations
  });
};

// Error messages in different languages
const errorMessages: Record<string, Record<LanguageCode, string>> = {
  nameMin: {
    en: "Name must be at least 2 characters",
    es: "El nombre debe tener al menos 2 caracteres",
    fr: "Le nom doit comporter au moins 2 caractères",
    // ...translations for other languages
  },
  // ...more error message types
};`;

  const i18nStoreCode = `import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { LanguageCode } from '../schemas/internationalizationSchema'

interface I18nFormState {
  // Currently selected language
  currentLanguage: LanguageCode
  // Set language
  setLanguage: (language: LanguageCode) => void
  // Get browser's preferred language
  detectBrowserLanguage: () => void
}

export const useI18nFormStore = create<I18nFormState>()(
  persist(
    (set) => ({
      // Default language is English
      currentLanguage: 'en',
      
      // Set language
      setLanguage: (language: LanguageCode) => 
        set({ currentLanguage: language }),
      
      // Detect browser language
      detectBrowserLanguage: () => {
        const browserLanguages = 
          navigator.languages || [navigator.language];
        
        // Check if we support any of the user's languages
        for (const browserLang of browserLanguages) {
          const langCode = browserLang.substring(0, 2).toLowerCase();
          const isSupported = availableLanguages.some(
            lang => lang.code === langCode
          );
          
          if (isSupported) {
            set({ currentLanguage: langCode as LanguageCode });
            return;
          }
        }
        
        // Fallback to English
        set({ currentLanguage: 'en' });
      }
    }),
    {
      name: 'i18n-form-language', // localStorage key
    }
  )
)`;

  const i18nFormCode = `const I18nForm: React.FC<I18nFormProps> = ({ onSubmitSuccess }) => {
  const { currentLanguage } = useI18nFormStore();
  
  // Get schema for current language
  const schema = createI18nSchema(currentLanguage);
  
  // Initialize React Hook Form with dynamic schema based on language
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<I18nFormData>({
    resolver: zodResolver(schema),
    defaultValues: { /* ... */ }
  });
  
  // Render field with translated labels, placeholders
  const renderField = (field: I18nField) => {
    const fieldTranslation = field.translations[currentLanguage];
    
    return (
      <FormControl isInvalid={!!errors[field.name]}>
        <FormLabel>{fieldTranslation.label}</FormLabel>
        <Input
          placeholder={fieldTranslation.placeholder}
          {...register(field.name)}
        />
        {errors[field.name] && (
          <FormErrorMessage>
            {errors[field.name]?.message}
          </FormErrorMessage>
        )}
      </FormControl>
    );
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {formFields.map(renderField)}
      
      <Button type="submit">
        {uiTranslations[currentLanguage].submitButton}
      </Button>
    </form>
  );
};`;

  return (
    <FormPageLayout
      title="Internationalized Forms"
      description="Build forms with multi-language support for labels, placeholders, and error messages."
      icon={FaGlobe}
      difficulty="Advanced"
    >
      <Tabs variant="enclosed" colorScheme="brand">
        <TabList>
          <Tab fontWeight="medium">Form Demo</Tab>
          <Tab fontWeight="medium">Code Example</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Container maxW="container.md" py={8}>
              <VStack spacing={8} align="stretch">
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
                        {uiTranslations[currentLanguage].successMessage}
                      </AlertTitle>
                      <AlertDescription maxWidth="sm" color={textColor}>
                        {uiTranslations[currentLanguage].successDescription}
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
                            {uiTranslations[currentLanguage].formDataLabel}
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
                  bg={cardBg}
                  p={{ base: 4, md: 6 }}
                  borderRadius="xl"
                  borderWidth="1px"
                  borderColor={cardBorder}
                  boxShadow="md"
                >
                  <VStack spacing={6} align="stretch">
                    <Flex
                      justifyContent="space-between"
                      alignItems={{ base: "center", md: "center" }}
                      flexDirection="column"
                      gap={4}
                    >
                      <Box width="100%" textAlign="center">
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          mb={4}
                        >
                          <Box width="100%" textAlign="center">
                            <Heading as="h2" size="lg" color={textColor}>
                              {uiTranslations[currentLanguage].formTitle}
                            </Heading>
                            <Text color={mutedTextColor} mt={1}>
                              {uiTranslations[currentLanguage].formDescription}
                            </Text>
                          </Box>
                        </Flex>
                      </Box>

                      <Box width="100%">
                        <LanguageSelector variant="buttons" />
                      </Box>
                    </Flex>

                    <Divider />

                    <I18nForm
                      onSubmitSuccess={handleSubmitSuccess}
                      getLocalizedSampleData={getLocalizedSampleData}
                      currentLanguage={currentLanguage}
                    />
                  </VStack>
                </Box>
              </VStack>
            </Container>
          </TabPanel>

          <TabPanel>
            <VStack align="start" spacing={6} py={5}>
              <Box>
                <Heading as="h3" size="md" mb={4} color={textColor}>
                  Creating Internationalized Forms
                </Heading>
                <Text color={textColor}>
                  Internationalized forms allow you to create a seamless
                  experience for users around the world. This implementation
                  demonstrates:
                </Text>

                <Box as="ul" pl={5} mt={4} color={textColor}>
                  <Box as="li" mt={2}>
                    Dynamic form validation with language-specific error
                    messages
                  </Box>
                  <Box as="li" mt={2}>
                    Translating form labels, placeholders, and UI elements
                  </Box>
                  <Box as="li" mt={2}>
                    Language detection and persistence using browser preferences
                  </Box>
                  <Box as="li" mt={2}>
                    Seamless language switching without losing form state
                  </Box>
                </Box>
              </Box>

              <Divider />

              <Box>
                <Heading as="h3" size="md" mb={4} color={textColor}>
                  Implementation Approach
                </Heading>

                <VStack spacing={8} align="stretch">
                  <Box>
                    <Text fontWeight="bold" mb={3} color={textColor}>
                      1. Schema with Localized Validation
                    </Text>
                    <Text color={mutedTextColor} mb={2}>
                      Create a function that generates a Zod schema with error
                      messages in the selected language.
                    </Text>
                    <CodeBlock
                      code={i18nSchemaCode}
                      language="typescript"
                      showLineNumbers={true}
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={3} color={textColor}>
                      2. Language State Management
                    </Text>
                    <Text color={mutedTextColor} mb={2}>
                      Use Zustand to manage the current language and detect
                      browser preferences.
                    </Text>
                    <CodeBlock
                      code={i18nStoreCode}
                      language="typescript"
                      showLineNumbers={true}
                    />
                  </Box>

                  <Box>
                    <Text fontWeight="bold" mb={3} color={textColor}>
                      3. Internationalized Form Component
                    </Text>
                    <Text color={mutedTextColor} mb={2}>
                      Create a form component that adapts to the current
                      language.
                    </Text>
                    <CodeBlock
                      code={i18nFormCode}
                      language="typescript"
                      showLineNumbers={true}
                    />
                  </Box>
                </VStack>
              </Box>

              <Divider />

              <Box>
                <Heading as="h3" size="md" mb={4} color={textColor}>
                  Best Practices
                </Heading>
                <VStack align="start" spacing={4} color={mutedTextColor}>
                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      Extract Translations to Separate Files
                    </Text>
                    <Text>
                      For larger applications, keep translations in separate
                      files organized by language or feature.
                    </Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      Consider RTL Languages
                    </Text>
                    <Text>
                      For languages like Arabic or Hebrew, implement
                      Right-to-Left (RTL) support in your layout.
                    </Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      Use Translation Libraries
                    </Text>
                    <Text>
                      For more complex applications, consider using libraries
                      like <Code>react-i18next</Code> or <Code>react-intl</Code>
                      .
                    </Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      Format Numbers and Dates Correctly
                    </Text>
                    <Text>
                      Use the <Code>Intl</Code> API to format dates, numbers,
                      and currencies according to the user's locale.
                    </Text>
                  </Box>

                  <Box>
                    <Text fontWeight="bold" color={textColor}>
                      Test with Native Speakers
                    </Text>
                    <Text>
                      Have native speakers review your translations for accuracy
                      and cultural appropriateness.
                    </Text>
                  </Box>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </FormPageLayout>
  );
}
