import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  Checkbox,
  FormErrorMessage,
  VStack,
  useColorModeValue,
  Heading,
  Text,
} from "@chakra-ui/react";
import {
  FormConfig,
  DynamicField,
  generateZodSchema,
  createDefaultValues,
} from "../../../schemas/dynamicFieldsSchema";

interface DynamicFormProps {
  formConfig: FormConfig;
  onSubmit: (data: any) => void;
  isSubmitting: boolean;
}

const DynamicForm: React.FC<DynamicFormProps> = ({
  formConfig,
  onSubmit,
  isSubmitting,
}) => {
  const textColor = useColorModeValue("gray.700", "gray.200");
  const muted = useColorModeValue("gray.600", "gray.400");
  const topRef = useRef<HTMLDivElement>(null);

  // Generate Zod schema based on form configuration
  const dynamicSchema = generateZodSchema(formConfig);

  // Get default values from form configuration
  const defaultValues = createDefaultValues(formConfig);

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(dynamicSchema),
    defaultValues,
  });

  // Handle form submission with scrolling to top
  const handleFormSubmit = (data: any) => {
    console.log("Form submitted:", data);

    // Scroll to top to make notification visible
    window.scrollTo({ top: 0, behavior: "smooth" });

    // If using ref instead
    if (topRef.current) {
      topRef.current.scrollIntoView({ behavior: "smooth" });
    }

    // Call the provided onSubmit handler
    onSubmit(data);
  };

  // Render field based on its type
  const renderField = (field: DynamicField) => {
    const isInvalid = errors[field.name] ? true : false;

    switch (field.type) {
      case "text":
      case "email":
      case "tel":
      case "number":
      case "date":
        return (
          <FormControl key={field.id} isInvalid={isInvalid} mb={4}>
            <FormLabel htmlFor={field.id} color={textColor}>
              {field.label}
            </FormLabel>
            <Input
              id={field.id}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name)}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {isInvalid && (
              <FormErrorMessage>
                {errors[field.name]?.message?.toString()}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      case "select":
        return (
          <FormControl key={field.id} isInvalid={isInvalid} mb={4}>
            <FormLabel htmlFor={field.id} color={textColor}>
              {field.label}
            </FormLabel>
            <Select
              id={field.id}
              placeholder="Select an option"
              {...register(field.name)}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            >
              {field.options?.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
            {isInvalid && (
              <FormErrorMessage>
                {errors[field.name]?.message?.toString()}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      case "textarea":
        return (
          <FormControl key={field.id} isInvalid={isInvalid} mb={4}>
            <FormLabel htmlFor={field.id} color={textColor}>
              {field.label}
            </FormLabel>
            <Textarea
              id={field.id}
              placeholder={field.placeholder}
              {...register(field.name)}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {isInvalid && (
              <FormErrorMessage>
                {errors[field.name]?.message?.toString()}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControl key={field.id} isInvalid={isInvalid} mb={4}>
            <Checkbox
              id={field.id}
              colorScheme="brand"
              {...register(field.name)}
            >
              <Text color={textColor}>{field.label}</Text>
            </Checkbox>
            {isInvalid && (
              <FormErrorMessage>
                {errors[field.name]?.message?.toString()}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Box as="form" onSubmit={handleSubmit(handleFormSubmit)} width="100%">
      <div ref={topRef} /> {/* Reference for scrolling to top */}
      <VStack spacing={6} align="stretch">
        <Box mb={4}>
          <Heading as="h3" size="md" mb={2} color={textColor}>
            {formConfig.title}
          </Heading>
          {formConfig.description && (
            <Text color={muted}>{formConfig.description}</Text>
          )}
        </Box>

        {formConfig.fields.map(renderField)}

        <Button
          type="submit"
          colorScheme="brand"
          size="lg"
          isLoading={isSubmitting}
          mt={4}
        >
          {formConfig.submitButtonText || "Submit"}
        </Button>
      </VStack>
    </Box>
  );
};

export default DynamicForm;
