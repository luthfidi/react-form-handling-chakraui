import React, { useState, useRef } from "react";
import {
  Box,
  VStack,
  Heading,
  Text,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useColorModeValue,
  CloseButton,
  Divider,
} from "@chakra-ui/react";
import { FormConfig } from "../../../schemas/dynamicFieldsSchema";
import DynamicForm from "./DynamicForm";
import CodeBlock from "../../../components/ui/CodeBlock";

interface FormPreviewProps {
  formConfig: FormConfig;
}

const FormPreview: React.FC<FormPreviewProps> = ({ formConfig }) => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<any>(null);
  const alertRef = useRef<HTMLDivElement>(null);

  const cardBg = useColorModeValue("white", "gray.800");
  const cardBorder = useColorModeValue("gray.200", "gray.700");
  const successBg = useColorModeValue("green.50", "rgba(72, 187, 120, 0.1)");
  const textColor = useColorModeValue("gray.700", "gray.200");

  const handleSubmit = (data: any) => {
    // Simulate form submission
    console.log("Form submitted:", data);
    setFormData(data);
    setIsSubmitted(true);

    // Scroll to the alert box
    if (alertRef.current) {
      alertRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Hide success message after 8 seconds
    setTimeout(() => setIsSubmitted(false), 8000);
  };

  return (
    <VStack spacing={8} align="stretch">
      <div ref={alertRef} />
      {isSubmitted && (
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
            Your form data has been submitted successfully.
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
            onClick={() => setIsSubmitted(false)}
          />
        </Alert>
      )}

      <Box
        bg={cardBg}
        p={6}
        borderRadius="md"
        borderWidth="1px"
        borderColor={cardBorder}
        boxShadow="md"
      >
        <VStack spacing={6} align="stretch">
          <Box>
            <Heading as="h3" size="md" color={textColor}>
              Form Preview
            </Heading>
            <Text
              color={useColorModeValue("gray.600", "gray.400")}
              fontSize="sm"
            >
              This is how your form will appear to users
            </Text>
          </Box>

          <Divider />

          <DynamicForm
            formConfig={formConfig}
            onSubmit={handleSubmit}
            isSubmitting={false}
          />
        </VStack>
      </Box>
    </VStack>
  );
};

export default FormPreview;
