import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  Input,
  Select,
  Checkbox,
  Stack,
  Text,
  useColorModeValue,
  Divider,
  Collapse,
  Button,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import {
  UseFormRegister,
  Control,
  useWatch,
  FieldError,
} from "react-hook-form";

// Field dependency types
type Condition =
  | { type: "equals"; field: string; value: any }
  | { type: "notEquals"; field: string; value: any }
  | { type: "contains"; field: string; value: string }
  | { type: "greaterThan"; field: string; value: number }
  | { type: "lessThan"; field: string; value: number }
  | { type: "isEmpty"; field: string }
  | { type: "isNotEmpty"; field: string }
  | { type: "custom"; predicate: (values: Record<string, any>) => boolean };

// Conditional field configuration
interface ConditionalFieldConfig {
  name: string;
  label: string;
  type:
    | "text"
    | "email"
    | "number"
    | "select"
    | "checkbox"
    | "textarea"
    | "date"
    | "password";
  condition: Condition | Condition[];
  placeholder?: string;
  options?: { label: string; value: string }[]; // For select inputs
  isRequired?: boolean;
  description?: string;
  defaultValue?: any;
  helperText?: string;
}

interface ConditionalValidationProps {
  fields: ConditionalFieldConfig[];
  register: UseFormRegister<any>;
  control: Control<any>;
  errors: Record<string, FieldError | undefined>;
  title?: string;
  description?: string;
}

const ConditionalValidation: React.FC<ConditionalValidationProps> = ({
  fields,
  register,
  control,
  errors,
  title,
  description,
}) => {
  const [visibleFields, setVisibleFields] = useState<string[]>([]);
  const [showNoFieldsMessage, setShowNoFieldsMessage] = useState(false);
  const formValues = useWatch({ control });

  // Colors
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.700");

  // Evaluate a single condition
  const evaluateCondition = (
    condition: Condition,
    values: Record<string, any>
  ): boolean => {
    switch (condition.type) {
      case "equals":
        return values[condition.field] === condition.value;
      case "notEquals":
        return values[condition.field] !== condition.value;
      case "contains":
        return String(values[condition.field]).includes(condition.value);
      case "greaterThan":
        return Number(values[condition.field]) > condition.value;
      case "lessThan":
        return Number(values[condition.field]) < condition.value;
      case "isEmpty":
        return !values[condition.field] || values[condition.field] === "";
      case "isNotEmpty":
        return !!values[condition.field] && values[condition.field] !== "";
      case "custom":
        return condition.predicate(values);
      default:
        return false;
    }
  };

  // Evaluate multiple conditions (AND logic)
  const evaluateConditions = (
    conditions: Condition | Condition[],
    values: Record<string, any>
  ): boolean => {
    if (Array.isArray(conditions)) {
      return conditions.every((condition) =>
        evaluateCondition(condition, values)
      );
    }
    return evaluateCondition(conditions, values);
  };

  // Update visible fields when form values change
  useEffect(() => {
    if (!formValues) return;

    const visible = fields
      .filter((field) => evaluateConditions(field.condition, formValues))
      .map((field) => field.name);

    setVisibleFields(visible);
    setShowNoFieldsMessage(visible.length === 0);
  }, [formValues, fields]);

  // Render a single field based on its type
  const renderField = (field: ConditionalFieldConfig) => {
    const isVisible = visibleFields.includes(field.name);
    const error = errors[field.name];

    if (!isVisible) return null;

    switch (field.type) {
      case "text":
      case "email":
      case "password":
      case "date":
        return (
          <FormControl
            key={field.name}
            isInvalid={!!error}
            isRequired={field.isRequired}
            mb={4}
          >
            <FormLabel htmlFor={field.name} color={textColor}>
              {field.label}
            </FormLabel>
            <Input
              id={field.name}
              type={field.type}
              placeholder={field.placeholder}
              {...register(field.name)}
              defaultValue={field.defaultValue}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {field.helperText && !error && (
              <Text fontSize="xs" color={mutedTextColor} mt={1}>
                {field.helperText}
              </Text>
            )}
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        );

      case "number":
        return (
          <FormControl
            key={field.name}
            isInvalid={!!error}
            isRequired={field.isRequired}
            mb={4}
          >
            <FormLabel htmlFor={field.name} color={textColor}>
              {field.label}
            </FormLabel>
            <Input
              id={field.name}
              type="number"
              placeholder={field.placeholder}
              {...register(field.name, { valueAsNumber: true })}
              defaultValue={field.defaultValue}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {field.helperText && !error && (
              <Text fontSize="xs" color={mutedTextColor} mt={1}>
                {field.helperText}
              </Text>
            )}
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        );

      case "select":
        return (
          <FormControl
            key={field.name}
            isInvalid={!!error}
            isRequired={field.isRequired}
            mb={4}
          >
            <FormLabel htmlFor={field.name} color={textColor}>
              {field.label}
            </FormLabel>
            <Select
              id={field.name}
              placeholder={field.placeholder || "Select an option"}
              {...register(field.name)}
              defaultValue={field.defaultValue}
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
            {field.helperText && !error && (
              <Text fontSize="xs" color={mutedTextColor} mt={1}>
                {field.helperText}
              </Text>
            )}
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControl
            key={field.name}
            isInvalid={!!error}
            isRequired={field.isRequired}
            mb={4}
          >
            <Checkbox
              id={field.name}
              {...register(field.name)}
              defaultChecked={!!field.defaultValue}
              colorScheme="brand"
            >
              <Text color={textColor}>{field.label}</Text>
            </Checkbox>
            {field.helperText && !error && (
              <Text fontSize="xs" color={mutedTextColor} mt={1} ml={6}>
                {field.helperText}
              </Text>
            )}
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        );

      case "textarea":
        return (
          <FormControl
            key={field.name}
            isInvalid={!!error}
            isRequired={field.isRequired}
            mb={4}
          >
            <FormLabel htmlFor={field.name} color={textColor}>
              {field.label}
            </FormLabel>
            <Input
              as="textarea"
              id={field.name}
              placeholder={field.placeholder}
              {...register(field.name)}
              defaultValue={field.defaultValue}
              minH="100px"
              py={2}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {field.helperText && !error && (
              <Text fontSize="xs" color={mutedTextColor} mt={1}>
                {field.helperText}
              </Text>
            )}
            {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      p={4}
      borderWidth="1px"
      borderColor={borderColor}
      borderRadius="md"
      bg={bgColor}
    >
      {title && (
        <Text fontSize="lg" fontWeight="medium" mb={2} color={textColor}>
          {title}
        </Text>
      )}

      {description && (
        <>
          <Text fontSize="sm" color={mutedTextColor} mb={4}>
            {description}
          </Text>
          <Divider mb={4} />
        </>
      )}

      <Collapse in={showNoFieldsMessage} animateOpacity>
        <Alert status="info" mb={4} borderRadius="md">
          <AlertIcon />
          <Text fontSize="sm">
            Additional fields will appear based on your selections above.
          </Text>
        </Alert>
      </Collapse>

      <Stack spacing={2}>{fields.map((field) => renderField(field))}</Stack>
    </Box>
  );
};

export default ConditionalValidation;