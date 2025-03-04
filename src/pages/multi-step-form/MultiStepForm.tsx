import {
  Box,
  Container,
  VStack,
  useColorModeValue,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Text,
} from "@chakra-ui/react";
import { FaLayerGroup } from "react-icons/fa";
import { useMultiStepFormStore } from "../../store/multiStepFormStore";
import FormPageLayout from "../../components/layout/FormPageLayout";
import StepProgress from "./components/StepProgress";
import Step1PersonalInfo from "./components/Step1PersonalInfo";
import Step2Address from "./components/Step2Address";
import Step3Account from "./components/Step3Account";
import FormSuccess from "./components/FormSuccess";
import CodeBlock from "../../components/ui/CodeBlock";

const STEPS = [
  { title: "Personal", description: "Basic info" },
  { title: "Address", description: "Your address" },
  { title: "Account", description: "Set up account" },
];

export default function MultiStepForm() {
  const { activeStep, isCompleted } = useMultiStepFormStore();

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");

  // Code examples as constants
  const zustandStoreCode = `// Store with persistence
export const useMultiStepFormStore = create(
  persist(
    (set, get) => ({
      // Form data
      personalInfo: null,
      address: null,
      account: null,
      // Active step
      activeStep: 0,
      // Status
      isCompleted: false,
      
      // Actions
      setPersonalInfo: (data) => set({ personalInfo: data }),
      setAddress: (data) => set({ address: data }),
      setAccount: (data) => set({ account: data }),
      nextStep: () => {
        const { activeStep } = get()
        if (activeStep < 2) {
          set({ activeStep: activeStep + 1 })
        }
      },
      prevStep: () => {
        const { activeStep } = get()
        if (activeStep > 0) {
          set({ activeStep: activeStep - 1 })
        }
      },
      reset: () => set({
        personalInfo: null,
        address: null,
        account: null,
        activeStep: 0,
        isCompleted: false
      }),
      completeForm: () => set({ isCompleted: true }),
    }),
    {
      name: 'multi-step-form', // localStorage key
    }
  )
)`;

  const stepComponentCode = `const StepComponent = () => {
  const { stepData, setStepData, nextStep } = useMultiStepFormStore()
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(stepSchema),
    defaultValues: stepData || {
      // Default values here
    },
  })

  const onSubmit = (data) => {
    setStepData(data)
    nextStep()
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {/* Form fields */}
      <Button type="submit">Next Step</Button>
    </form>
  )
}`;

  // Render the appropriate step component based on activeStep
  const renderStepContent = () => {
    if (isCompleted) {
      return <FormSuccess />;
    }

    switch (activeStep) {
      case 0:
        return <Step1PersonalInfo />;
      case 1:
        return <Step2Address />;
      case 2:
        return <Step3Account />;
      default:
        return <Step1PersonalInfo />;
    }
  };

  return (
    <FormPageLayout
      title="Multi-step Form"
      description="Create a wizard-style form with multiple steps, progress tracking, and state persistence between steps."
      icon={FaLayerGroup}
      difficulty="Intermediate"
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
                <StepProgress
                  activeStep={activeStep}
                  steps={STEPS}
                  isCompleted={isCompleted}
                />

                {!isCompleted && (
                  <Box
                    bg={cardBg}
                    p={{ base: 6, md: 8 }}
                    borderRadius="xl"
                    borderWidth="1px"
                    borderColor={borderColor}
                    boxShadow="lg"
                  >
                    {renderStepContent()}
                  </Box>
                )}

                {isCompleted && <Box>{renderStepContent()}</Box>}
              </VStack>
            </Container>
          </TabPanel>
          <TabPanel>
            <VStack align="start" spacing={6}>
              <Text color={textColor}>
                This form demonstrates building a multi-step form with state
                persistence between steps using React Hook Form, Zod, and
                Zustand. Key concepts covered include:
              </Text>

              <Box as="ul" pl={5} alignSelf="stretch" color={textColor}>
                <Box as="li" mt={2}>
                  Step-by-step form progression with validation at each step
                </Box>
                <Box as="li" mt={2}>
                  Persistent form state using Zustand store with localStorage
                </Box>
                <Box as="li" mt={2}>
                  Progress indicator to show users where they are in the process
                </Box>
                <Box as="li" mt={2}>
                  Combining validation schemas from multiple steps
                </Box>
                <Box as="li" mt={2}>
                  Form state management across components
                </Box>
              </Box>

              <Text fontWeight="bold" mt={2} color={textColor}>
                Zustand Store Implementation:
              </Text>
              <CodeBlock
                code={zustandStoreCode}
                language="typescript"
                showLineNumbers={true}
              />

              <Text fontWeight="bold" mt={2} color={textColor}>
                Step Component Example:
              </Text>
              <CodeBlock
                code={stepComponentCode}
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
