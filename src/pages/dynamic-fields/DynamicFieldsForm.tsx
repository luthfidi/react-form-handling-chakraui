import { useState } from "react";
import {
  Box,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useColorModeValue,
  VStack,
  Text,
  SimpleGrid,
  HStack,
  Button,
  Divider,
} from "@chakra-ui/react";
import { FaMagic } from "react-icons/fa";
import FormPageLayout from "../../components/layout/FormPageLayout";
import FormConfigSelector from "./components/FormConfigSelector";
import FormEditor from "./components/FormEditor";
import FormPreview from "./components/FormPreview";
import GenerateCode from "./components/GenerateCode";
import {
  FormConfig,
  contactFormConfig,
} from "../../schemas/dynamicFieldsSchema";

export default function DynamicFieldsForm() {
  // State for the current form configuration
  const [formConfig, setFormConfig] = useState<FormConfig>(contactFormConfig);

  // State for the active tab
  const [activeTab, setActiveTab] = useState(0);

  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");

  // Select a predefined form configuration
  const handleSelectConfig = (config: FormConfig) => {
    setFormConfig(config);
    // Move to the editor tab when a template is selected
    setActiveTab(1);
  };

  // Save the edited form configuration
  const handleSaveConfig = (config: FormConfig) => {
    setFormConfig(config);
    // Move to the preview tab after saving
    setActiveTab(2);
  };

  // Handle tab change
  const handleTabChange = (index: number) => {
    setActiveTab(index);
  };

  return (
    <FormPageLayout
      title="Dynamic Form Generation"
      description="Generate form fields dynamically based on external data or API responses."
      icon={FaMagic}
      difficulty="Advanced"
    >
      <Tabs
        variant="enclosed"
        colorScheme="brand"
        index={activeTab}
        onChange={handleTabChange}
      >
        <TabList>
          <Tab fontWeight="medium">Templates</Tab>
          <Tab fontWeight="medium">Editor</Tab>
          <Tab fontWeight="medium">Preview</Tab>
          <Tab fontWeight="medium">Code</Tab>
          <Tab fontWeight="medium">Documentation</Tab>
        </TabList>
        <TabPanels>
          {/* Templates Tab */}
          <TabPanel>
            <VStack spacing={8} w="full" py={5} align="stretch">
              <Box
                p={6}
                bg={cardBg}
                borderWidth="1px"
                borderColor={cardBorder}
                borderRadius="xl"
                boxShadow="md"
              >
                <VStack spacing={6} align="stretch">
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    Form Templates
                  </Text>
                  <Text color={mutedTextColor}>
                    Choose a pre-configured form template or start from scratch
                    to create your dynamic form.
                  </Text>

                  <Divider />

                  <FormConfigSelector
                    onSelectConfig={handleSelectConfig}
                    currentConfigTitle={formConfig.title}
                  />

                  <HStack justifyContent="flex-end">
                    <Button
                      colorScheme="brand"
                      size="md"
                      onClick={() => setActiveTab(1)}
                    >
                      Continue to Editor
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          {/* Form Editor Tab */}
          <TabPanel>
            <VStack spacing={8} w="full" py={5} align="stretch">
              <Box
                p={6}
                bg={cardBg}
                borderWidth="1px"
                borderColor={cardBorder}
                borderRadius="xl"
                boxShadow="md"
              >
                <VStack spacing={6} align="stretch">
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    Form Editor
                  </Text>
                  <Text color={mutedTextColor}>
                    Customize your form by adding, removing, and configuring
                    fields.
                  </Text>

                  <Divider />

                  <FormEditor
                    initialConfig={formConfig}
                    onSave={handleSaveConfig}
                  />
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          {/* Form Preview Tab */}
          <TabPanel>
            <VStack spacing={8} w="full" py={5} align="stretch">
              <Box
                p={6}
                bg={cardBg}
                borderWidth="1px"
                borderColor={cardBorder}
                borderRadius="xl"
                boxShadow="md"
              >
                <VStack spacing={6} align="stretch">
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    Form Preview
                  </Text>
                  <Text color={mutedTextColor}>
                    Preview how your form will appear to users. You can test the
                    form submission here.
                  </Text>

                  <Divider />

                  <FormPreview formConfig={formConfig} />

                  <HStack justifyContent="space-between">
                    <Button
                      variant="outline"
                      colorScheme="brand"
                      onClick={() => setActiveTab(1)}
                    >
                      Back to Editor
                    </Button>
                    <Button colorScheme="brand" onClick={() => setActiveTab(3)}>
                      Generate Code
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          {/* Generate Code Tab */}
          <TabPanel>
            <VStack spacing={8} w="full" py={5} align="stretch">
              <Box
                p={6}
                bg={cardBg}
                borderWidth="1px"
                borderColor={cardBorder}
                borderRadius="xl"
                boxShadow="md"
              >
                <VStack spacing={6} align="stretch">
                  <Text fontSize="xl" fontWeight="bold" color={textColor}>
                    Generate Code
                  </Text>
                  <Text color={mutedTextColor}>
                    Generate code snippets to implement your form in React,
                    HTML, or save the configuration as JSON.
                  </Text>

                  <Divider />

                  <GenerateCode formConfig={formConfig} />

                  <HStack justifyContent="flex-start">
                    <Button
                      variant="outline"
                      colorScheme="brand"
                      onClick={() => setActiveTab(2)}
                    >
                      Back to Preview
                    </Button>
                  </HStack>
                </VStack>
              </Box>
            </VStack>
          </TabPanel>

          {/* Documentation Tab */}
          <TabPanel>
            <VStack spacing={4} align="start" w="full" py={5}>
              <Text fontSize="xl" fontWeight="bold" color={textColor}>
                Dynamic Form Generation Documentation
              </Text>
              <Text color={textColor}>
                This form demonstrates how to create a dynamic form builder that
                allows users to:
              </Text>

              <Box as="ul" pl={5} color={textColor}>
                <Box as="li">
                  Choose from predefined form templates or start from scratch
                </Box>
                <Box as="li" mt={2}>
                  Add, remove, and configure form fields with a visual editor
                </Box>
                <Box as="li" mt={2}>
                  Set validation rules for each field
                </Box>
                <Box as="li" mt={2}>
                  Preview the form as it will appear to users
                </Box>
                <Box as="li" mt={2}>
                  Generate code to implement the form in different environments
                </Box>
              </Box>

              <SimpleGrid
                columns={{ base: 1, md: 2 }}
                spacing={8}
                width="full"
                mt={4}
              >
                <Box
                  p={4}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="md"
                  boxShadow="sm"
                >
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    mb={3}
                    color={textColor}
                  >
                    Key Concepts
                  </Text>
                  <VStack spacing={2} align="start">
                    <Text color={mutedTextColor}>
                      • Dynamic schema generation with Zod
                    </Text>
                    <Text color={mutedTextColor}>
                      • Form state management with React Hook Form
                    </Text>
                    <Text color={mutedTextColor}>
                      • Programmatic validation rule creation
                    </Text>
                    <Text color={mutedTextColor}>
                      • Conditional field rendering
                    </Text>
                    <Text color={mutedTextColor}>
                      • Form configuration serialization
                    </Text>
                  </VStack>
                </Box>

                <Box
                  p={4}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="md"
                  boxShadow="sm"
                >
                  <Text
                    fontSize="lg"
                    fontWeight="bold"
                    mb={3}
                    color={textColor}
                  >
                    Real World Usage
                  </Text>
                  <VStack spacing={2} align="start">
                    <Text color={mutedTextColor}>
                      • Admin interfaces for CMS systems
                    </Text>
                    <Text color={mutedTextColor}>
                      • Survey and questionnaire builders
                    </Text>
                    <Text color={mutedTextColor}>
                      • Data collection tools with variable fields
                    </Text>
                    <Text color={mutedTextColor}>
                      • Form generators for non-technical users
                    </Text>
                    <Text color={mutedTextColor}>
                      • Dynamic preferences or settings forms
                    </Text>
                  </VStack>
                </Box>
              </SimpleGrid>

              <Box width="full" mt={4}>
                <Text fontSize="lg" fontWeight="bold" mb={3} color={textColor}>
                  Implementation Notes
                </Text>
                <Box
                  p={4}
                  bg={cardBg}
                  borderWidth="1px"
                  borderColor={cardBorder}
                  borderRadius="md"
                  boxShadow="sm"
                >
                  <VStack spacing={3} align="start">
                    <Text color={mutedTextColor}>
                      This implementation uses a combination of Zod for schema
                      validation and React Hook Form for form state management.
                      The form configuration is stored as a JSON object that
                      defines the form's structure, fields, and validation
                      rules.
                    </Text>
                    <Text color={mutedTextColor}>
                      The schema generator dynamically creates Zod validation
                      schemas based on the field configurations. This approach
                      allows for powerful validation logic without having to
                      write custom validation code for each form.
                    </Text>
                    <Text color={mutedTextColor}>
                      In a real-world scenario, these form configurations could
                      be stored in a database and loaded on demand, allowing for
                      completely dynamic form rendering based on external data
                      sources or API responses.
                    </Text>
                  </VStack>
                </Box>
              </Box>
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </FormPageLayout>
  );
}
