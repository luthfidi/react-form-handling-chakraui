import React from "react";
import {
  Box,
  Heading,
  Text,
  useColorModeValue,
  Button,
  Flex,
} from "@chakra-ui/react";
import { FormConfig } from "../../../schemas/dynamicFieldsSchema";
import CodeBlock from "../../../components/ui/CodeBlock";

interface ConfigCodeDisplayProps {
  formConfig: FormConfig;
}

const ConfigCodeDisplay: React.FC<ConfigCodeDisplayProps> = ({
  formConfig,
}) => {
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Generate the configuration code
  const configCode = `// Form Configuration
const formConfig = ${JSON.stringify(formConfig, null, 2)};`;

  // Generate the usage code
  const usageCode = `import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { generateZodSchema, createDefaultValues } from "./dynamicFieldsSchema";

// Your form configuration (from editor)
const formConfig = ${JSON.stringify(formConfig, null, 2)};

// Generate schema from configuration
const dynamicSchema = generateZodSchema(formConfig);

// Get default values for the form
const defaultValues = createDefaultValues(formConfig);

// Setup React Hook Form
const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm({
  resolver: zodResolver(dynamicSchema),
  defaultValues,
});

const onSubmit = (data) => {
  console.log("Form data:", data);
  // Process the form data...
};`;

  // Generate the Zod schema code
  // First convert the schema to a string representation
  const schemaObject: Record<string, string> = {};

  try {
    // Create a more readable schema visualization
    formConfig.fields.forEach((field) => {
      let schemaStr = "z.";

      switch (field.type) {
        case "number":
          schemaStr += "number()";
          break;
        case "checkbox":
          schemaStr += "boolean()";
          break;
        default:
          schemaStr += "string()";
      }

      if (field.validationRules) {
        field.validationRules.forEach((rule) => {
          switch (rule.type) {
            case "required":
              if (field.type === "checkbox") {
                schemaStr += `.refine(val => val === true, { message: "${
                  rule.message || "This field is required"
                }" })`;
              } else {
                schemaStr += `.min(1, { message: "${
                  rule.message || "This field is required"
                }" })`;
              }
              break;
            case "min":
              schemaStr += `.min(${rule.value}, { message: "${
                rule.message || `Minimum ${rule.value} characters required`
              }" })`;
              break;
            case "max":
              schemaStr += `.max(${rule.value}, { message: "${
                rule.message || `Maximum ${rule.value} characters allowed`
              }" })`;
              break;
            case "email":
              schemaStr += `.email({ message: "${
                rule.message || "Invalid email address"
              }" })`;
              break;
            case "url":
              schemaStr += `.url({ message: "${
                rule.message || "Invalid URL"
              }" })`;
              break;
            case "pattern":
              schemaStr += `.regex(/${rule.value}/, { message: "${
                rule.message || "Invalid format"
              }" })`;
              break;
          }
        });
      }

      // Check if field is required
      const isRequired = field.validationRules?.some(
        (rule) => rule.type === "required"
      );
      if (!isRequired) {
        schemaStr += ".optional()";
      }

      schemaObject[field.name] = schemaStr;
    });
  } catch (error) {
    console.error("Error generating schema display:", error);
  }

  const zodSchemaCode = `import { z } from "zod";

// Generated Zod schema from form configuration
const dynamicSchema = z.object({
${Object.entries(schemaObject)
  .map(([key, value]) => `  ${key}: ${value}`)
  .join(",\n")}
});

export type FormData = z.infer<typeof dynamicSchema>;`;

  // Function to copy code to clipboard
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        <Box>
          <Heading as="h3" size="md" mb={2} color={textColor}>
            Form Configuration
          </Heading>
          <Text color={mutedColor} mb={4}>
            This is the JSON configuration for your form:
          </Text>
          <Box
            position="relative"
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
          >
            <Flex position="absolute" top={2} right={2}>
              <Button
                size="xs"
                onClick={() => copyToClipboard(configCode)}
                colorScheme="brand"
              >
                Copy
              </Button>
            </Flex>
            <CodeBlock
              code={configCode}
              language="javascript"
              showLineNumbers={true}
            />
          </Box>
        </Box>

        <Box>
          <Heading as="h3" size="md" mb={2} color={textColor}>
            Generated Zod Schema
          </Heading>
          <Text color={mutedColor} mb={4}>
            This schema is automatically generated from your form configuration:
          </Text>
          <Box
            position="relative"
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
          >
            <Flex position="absolute" top={2} right={2}>
              <Button
                size="xs"
                onClick={() => copyToClipboard(zodSchemaCode)}
                colorScheme="brand"
              >
                Copy
              </Button>
            </Flex>
            <CodeBlock
              code={zodSchemaCode}
              language="typescript"
              showLineNumbers={true}
            />
          </Box>
        </Box>

        <Box>
          <Heading as="h3" size="md" mb={2} color={textColor}>
            Usage Example
          </Heading>
          <Text color={mutedColor} mb={4}>
            Here's how to use the form configuration with React Hook Form:
          </Text>
          <Box
            position="relative"
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
          >
            <Flex position="absolute" top={2} right={2}>
              <Button
                size="xs"
                onClick={() => copyToClipboard(usageCode)}
                colorScheme="brand"
              >
                Copy
              </Button>
            </Flex>
            <CodeBlock
              code={usageCode}
              language="typescript"
              showLineNumbers={true}
            />
          </Box>
        </Box>
      </VStack>
    </Box>
  );
};

// Helper component for consistent layout
const VStack: React.FC<{
  children: React.ReactNode;
  spacing: number;
  align: string;
}> = ({ children, spacing, align }) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems={align === "stretch" ? "stretch" : "flex-start"}
      gap={`${spacing * 4}px`}
    >
      {children}
    </Box>
  );
};

export default ConfigCodeDisplay;
