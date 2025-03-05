import React from "react";
import {
  Box,
  HStack,
  Button,
  Text,
  VStack,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FormConfig,
  contactFormConfig,
  surveyFormConfig,
  eventRegistrationConfig,
} from "../../../schemas/dynamicFieldsSchema";

interface FormConfigSelectorProps {
  onSelectConfig: (config: FormConfig) => void;
  currentConfigTitle: string;
}

// Predefined form configurations
const predefinedConfigs: { title: string; config: FormConfig }[] = [
  { title: "Contact Form", config: contactFormConfig },
  { title: "Survey Form", config: surveyFormConfig },
  { title: "Event Registration", config: eventRegistrationConfig },
];

const FormConfigSelector: React.FC<FormConfigSelectorProps> = ({
  onSelectConfig,
  currentConfigTitle,
}) => {
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const hoverBg = useColorModeValue("gray.50", "gray.700");
  const activeBg = useColorModeValue("brand.50", "brand.900");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutetTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <VStack spacing={3} align="stretch">
      <Text fontWeight="medium" color={textColor}>
        Select a template or start from scratch
      </Text>

      <VStack spacing={2} align="stretch">
        {predefinedConfigs.map(({ title, config }) => (
          <Box
            key={title}
            p={3}
            borderWidth="1px"
            borderRadius="md"
            borderColor={borderColor}
            bg={title === currentConfigTitle ? activeBg : bgColor}
            cursor="pointer"
            _hover={{ bg: title === currentConfigTitle ? activeBg : hoverBg }}
            onClick={() => onSelectConfig(config)}
          >
            <HStack justify="space-between">
              <VStack align="start" spacing={0}>
                <Text fontWeight="medium" color={textColor}>
                  {title}
                </Text>
                <Text fontSize="sm" color={mutetTextColor}>
                  {config.fields.length} fields
                </Text>
              </VStack>
              <Button
                size="sm"
                colorScheme="brand"
                variant={title === currentConfigTitle ? "solid" : "outline"}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectConfig(config);
                }}
              >
                {title === currentConfigTitle ? "Selected" : "Use Template"}
              </Button>
            </HStack>
          </Box>
        ))}

        <Box
          p={3}
          borderWidth="1px"
          borderStyle="dashed"
          borderRadius="md"
          borderColor={borderColor}
          bg={bgColor}
          cursor="pointer"
          _hover={{ bg: hoverBg }}
          onClick={() =>
            onSelectConfig({
              title: "Custom Form",
              description: "A custom form created from scratch",
              fields: [],
              submitButtonText: "Submit",
            })
          }
        >
          <HStack justify="space-between">
            <VStack align="start" spacing={0}>
              <Text fontWeight="medium" color={textColor}>
                Create from Scratch
              </Text>
              <Text fontSize="sm" color={mutetTextColor}>
                Start with an empty form
              </Text>
            </VStack>
            <Button
              size="sm"
              colorScheme="brand"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation();
                onSelectConfig({
                  title: "Custom Form",
                  description: "A custom form created from scratch",
                  fields: [],
                  submitButtonText: "Submit",
                });
              }}
            >
              Start Fresh
            </Button>
          </HStack>
        </Box>
      </VStack>
    </VStack>
  );
};

export default FormConfigSelector;
