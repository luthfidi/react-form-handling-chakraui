import React, { useState } from "react";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Textarea,
  VStack,
  HStack,
  IconButton,
  useColorModeValue,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Flex,
  Divider,
  Badge,
} from "@chakra-ui/react";
import {
  AddIcon,
  DeleteIcon,
  ChevronUpIcon,
  ChevronDownIcon,
} from "@chakra-ui/icons";
import {
  FormConfig,
  DynamicField,
  fieldTypeEnum,
  validationRuleEnum,
  ValidationRule,
  SelectOption,
} from "../../../schemas/dynamicFieldsSchema";

interface FormEditorProps {
  initialConfig: FormConfig;
  onSave: (config: FormConfig) => void;
}

const FormEditor: React.FC<FormEditorProps> = ({ initialConfig, onSave }) => {
  const [formConfig, setFormConfig] = useState<FormConfig>({
    ...initialConfig,
  });

  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const fieldBg = useColorModeValue("white", "gray.800");

  // Update form title and description
  const updateFormMeta = (key: keyof FormConfig, value: string) => {
    setFormConfig({
      ...formConfig,
      [key]: value,
    });
  };

  // Add a new field
  const addField = () => {
    const newFieldId = `field-${Date.now()}`;
    const newField: DynamicField = {
      id: newFieldId,
      name: newFieldId,
      label: "New Field",
      type: "text",
      placeholder: "",
    };

    setFormConfig({
      ...formConfig,
      fields: [...formConfig.fields, newField],
    });
  };

  // Remove a field
  const removeField = (fieldId: string) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.filter((field) => field.id !== fieldId),
    });
  };

  // Move field up
  const moveFieldUp = (fieldIndex: number) => {
    if (fieldIndex === 0) return; // Already at the top

    const newFields = [...formConfig.fields];
    const temp = newFields[fieldIndex];
    newFields[fieldIndex] = newFields[fieldIndex - 1];
    newFields[fieldIndex - 1] = temp;

    setFormConfig({
      ...formConfig,
      fields: newFields,
    });
  };

  // Move field down
  const moveFieldDown = (fieldIndex: number) => {
    if (fieldIndex === formConfig.fields.length - 1) return; // Already at the bottom

    const newFields = [...formConfig.fields];
    const temp = newFields[fieldIndex];
    newFields[fieldIndex] = newFields[fieldIndex + 1];
    newFields[fieldIndex + 1] = temp;

    setFormConfig({
      ...formConfig,
      fields: newFields,
    });
  };

  // Update field properties
  const updateField = (
    fieldId: string,
    key: keyof DynamicField,
    value: any
  ) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.map((field) => {
        if (field.id === fieldId) {
          // If updating the field type, reset options or other type-specific props
          if (key === "type") {
            const updatedField = {
              ...field,
              [key]: value,
            };

            // Clear options if changing from select
            if (field.type === "select" && value !== "select") {
              delete updatedField.options;
            }
            // Initialize options array if changing to select
            if (value === "select" && !updatedField.options) {
              updatedField.options = [{ label: "Option 1", value: "option1" }];
            }

            return updatedField;
          }

          // Regular field update
          return {
            ...field,
            [key]: value,
          };
        }
        return field;
      }),
    });
  };

  // Add a validation rule to a field
  const addValidationRule = (fieldId: string) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.map((field) => {
        if (field.id === fieldId) {
          const rules = field.validationRules || [];
          const newRule: ValidationRule = {
            type: "required",
            message: `${field.label} is required`,
          };
          return {
            ...field,
            validationRules: [...rules, newRule],
          };
        }
        return field;
      }),
    });
  };

  // Remove a validation rule from a field
  const removeValidationRule = (fieldId: string, ruleIndex: number) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.map((field) => {
        if (field.id === fieldId && field.validationRules) {
          return {
            ...field,
            validationRules: field.validationRules.filter(
              (_, index) => index !== ruleIndex
            ),
          };
        }
        return field;
      }),
    });
  };

  // Update a validation rule
  const updateValidationRule = (
    fieldId: string,
    ruleIndex: number,
    key: keyof ValidationRule,
    value: any
  ) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.map((field) => {
        if (field.id === fieldId && field.validationRules) {
          return {
            ...field,
            validationRules: field.validationRules.map((rule, index) => {
              if (index === ruleIndex) {
                return {
                  ...rule,
                  [key]: value,
                };
              }
              return rule;
            }),
          };
        }
        return field;
      }),
    });
  };

  // Add a select option to a field
  const addSelectOption = (fieldId: string) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.map((field) => {
        if (field.id === fieldId && field.type === "select") {
          const options = field.options || [];
          const newOption: SelectOption = {
            label: `Option ${options.length + 1}`,
            value: `option${options.length + 1}`,
          };
          return {
            ...field,
            options: [...options, newOption],
          };
        }
        return field;
      }),
    });
  };

  // Remove a select option from a field
  const removeSelectOption = (fieldId: string, optionIndex: number) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.map((field) => {
        if (field.id === fieldId && field.options) {
          return {
            ...field,
            options: field.options.filter((_, index) => index !== optionIndex),
          };
        }
        return field;
      }),
    });
  };

  // Update a select option
  const updateSelectOption = (
    fieldId: string,
    optionIndex: number,
    key: keyof SelectOption,
    value: string
  ) => {
    setFormConfig({
      ...formConfig,
      fields: formConfig.fields.map((field) => {
        if (field.id === fieldId && field.options) {
          return {
            ...field,
            options: field.options.map((option, index) => {
              if (index === optionIndex) {
                return {
                  ...option,
                  [key]: value,
                };
              }
              return option;
            }),
          };
        }
        return field;
      }),
    });
  };

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Form Metadata */}
        <Box
          p={4}
          borderWidth="1px"
          borderColor={borderColor}
          borderRadius="md"
          bg={bgColor}
        >
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel color={textColor}>Form Title</FormLabel>
              <Input
                value={formConfig.title}
                onChange={(e) => updateFormMeta("title", e.target.value)}
                placeholder="Enter form title"
                bg={fieldBg}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Form Description</FormLabel>
              <Textarea
                value={formConfig.description || ""}
                onChange={(e) => updateFormMeta("description", e.target.value)}
                placeholder="Enter form description"
                bg={fieldBg}
              />
            </FormControl>

            <FormControl>
              <FormLabel color={textColor}>Submit Button Text</FormLabel>
              <Input
                value={formConfig.submitButtonText || "Submit"}
                onChange={(e) =>
                  updateFormMeta("submitButtonText", e.target.value)
                }
                placeholder="Enter button text"
                bg={fieldBg}
              />
            </FormControl>
          </VStack>
        </Box>

        {/* Fields */}
        <Box>
          <Flex justifyContent="space-between" alignItems="center" mb={4}>
            <Text fontWeight="bold" color={textColor}>
              Form Fields
            </Text>
            <Button
              leftIcon={<AddIcon />}
              size="sm"
              colorScheme="brand"
              onClick={addField}
            >
              Add Field
            </Button>
          </Flex>

          <Accordion allowMultiple defaultIndex={[0]}>
            {formConfig.fields.map((field, fieldIndex) => (
              <AccordionItem
                key={field.id}
                mb={4}
                borderWidth="1px"
                borderColor={borderColor}
                borderRadius="md"
              >
                <h2>
                  <AccordionButton bg={bgColor} borderRadius="md">
                    <Box flex="1" textAlign="left">
                      <Flex alignItems="center">
                        <HStack spacing={2} mr={2}>
                          <IconButton
                            aria-label="Move field up"
                            icon={<ChevronUpIcon />}
                            size="xs"
                            isDisabled={fieldIndex === 0}
                            onClick={(e) => {
                              e.stopPropagation();
                              moveFieldUp(fieldIndex);
                            }}
                          />
                          <IconButton
                            aria-label="Move field down"
                            icon={<ChevronDownIcon />}
                            size="xs"
                            isDisabled={
                              fieldIndex === formConfig.fields.length - 1
                            }
                            onClick={(e) => {
                              e.stopPropagation();
                              moveFieldDown(fieldIndex);
                            }}
                          />
                        </HStack>
                        <Text fontWeight="medium">{field.label}</Text>
                      </Flex>
                    </Box>
                    <Badge colorScheme="blue" mr={2}>
                      {field.type}
                    </Badge>
                    <AccordionIcon />
                  </AccordionButton>
                </h2>
                <AccordionPanel pb={4} bg={fieldBg}>
                  <VStack spacing={4} align="stretch">
                    <FormControl>
                      <FormLabel color={textColor}>Field Label</FormLabel>
                      <Input
                        value={field.label}
                        onChange={(e) =>
                          updateField(field.id, "label", e.target.value)
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textColor}>Field Name</FormLabel>
                      <Input
                        value={field.name}
                        onChange={(e) =>
                          updateField(field.id, "name", e.target.value)
                        }
                      />
                    </FormControl>

                    <FormControl>
                      <FormLabel color={textColor}>Field Type</FormLabel>
                      <Select
                        value={field.type}
                        onChange={(e) =>
                          updateField(field.id, "type", e.target.value)
                        }
                      >
                        {fieldTypeEnum.map((type) => (
                          <option key={type} value={type}>
                            {type.charAt(0).toUpperCase() + type.slice(1)}
                          </option>
                        ))}
                      </Select>
                    </FormControl>

                    {(field.type === "text" ||
                      field.type === "email" ||
                      field.type === "number" ||
                      field.type === "tel" ||
                      field.type === "textarea") && (
                      <FormControl>
                        <FormLabel color={textColor}>Placeholder</FormLabel>
                        <Input
                          value={field.placeholder || ""}
                          onChange={(e) =>
                            updateField(field.id, "placeholder", e.target.value)
                          }
                        />
                      </FormControl>
                    )}

                    {field.type === "select" && (
                      <Box>
                        <Flex
                          justifyContent="space-between"
                          alignItems="center"
                          mb={2}
                        >
                          <FormLabel color={textColor} mb={0}>
                            Options
                          </FormLabel>
                          <Button
                            size="xs"
                            leftIcon={<AddIcon />}
                            onClick={() => addSelectOption(field.id)}
                          >
                            Add Option
                          </Button>
                        </Flex>
                        <VStack spacing={2} align="stretch">
                          {field.options?.map((option, optionIndex) => (
                            <Flex key={optionIndex} align="center">
                              <FormControl mr={2}>
                                <Input
                                  placeholder="Label"
                                  size="sm"
                                  value={option.label}
                                  onChange={(e) =>
                                    updateSelectOption(
                                      field.id,
                                      optionIndex,
                                      "label",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormControl>
                              <FormControl mr={2}>
                                <Input
                                  placeholder="Value"
                                  size="sm"
                                  value={option.value}
                                  onChange={(e) =>
                                    updateSelectOption(
                                      field.id,
                                      optionIndex,
                                      "value",
                                      e.target.value
                                    )
                                  }
                                />
                              </FormControl>
                              <IconButton
                                aria-label="Remove option"
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() =>
                                  removeSelectOption(field.id, optionIndex)
                                }
                              />
                            </Flex>
                          ))}
                        </VStack>
                      </Box>
                    )}

                    <Divider />

                    {/* Validation Rules */}
                    <Box>
                      <Flex
                        justifyContent="space-between"
                        alignItems="center"
                        mb={2}
                      >
                        <FormLabel color={textColor} mb={0}>
                          Validation Rules
                        </FormLabel>
                        <Button
                          size="xs"
                          leftIcon={<AddIcon />}
                          onClick={() => addValidationRule(field.id)}
                        >
                          Add Rule
                        </Button>
                      </Flex>
                      <VStack spacing={3} align="stretch">
                        {field.validationRules?.map((rule, ruleIndex) => (
                          <Box
                            key={ruleIndex}
                            p={2}
                            borderWidth="1px"
                            borderColor={borderColor}
                            borderRadius="md"
                          >
                            <Flex align="center" mb={2}>
                              <FormControl mr={2}>
                                <Select
                                  size="sm"
                                  value={rule.type}
                                  onChange={(e) =>
                                    updateValidationRule(
                                      field.id,
                                      ruleIndex,
                                      "type",
                                      e.target.value
                                    )
                                  }
                                >
                                  {validationRuleEnum.map((type) => (
                                    <option key={type} value={type}>
                                      {type}
                                    </option>
                                  ))}
                                </Select>
                              </FormControl>
                              <IconButton
                                aria-label="Remove rule"
                                icon={<DeleteIcon />}
                                size="sm"
                                variant="ghost"
                                colorScheme="red"
                                onClick={() =>
                                  removeValidationRule(field.id, ruleIndex)
                                }
                              />
                            </Flex>

                            {(rule.type === "min" ||
                              rule.type === "max" ||
                              rule.type === "pattern") && (
                              <FormControl mb={2}>
                                <FormLabel
                                  fontSize="xs"
                                  mb={1}
                                  color={textColor}
                                >
                                  Value
                                </FormLabel>
                                <Input
                                  size="sm"
                                  value={rule.value?.toString() || ""}
                                  onChange={(e) =>
                                    updateValidationRule(
                                      field.id,
                                      ruleIndex,
                                      "value",
                                      rule.type === "min" || rule.type === "max"
                                        ? Number(e.target.value)
                                        : e.target.value
                                    )
                                  }
                                />
                              </FormControl>
                            )}

                            <FormControl>
                              <FormLabel fontSize="xs" mb={1} color={textColor}>
                                Error Message
                              </FormLabel>
                              <Input
                                size="sm"
                                value={rule.message || ""}
                                onChange={(e) =>
                                  updateValidationRule(
                                    field.id,
                                    ruleIndex,
                                    "message",
                                    e.target.value
                                  )
                                }
                                placeholder="Error message"
                              />
                            </FormControl>
                          </Box>
                        ))}
                      </VStack>
                    </Box>

                    <Divider />

                    <HStack justifyContent="flex-end">
                      <Button
                        colorScheme="red"
                        size="sm"
                        leftIcon={<DeleteIcon />}
                        onClick={() => removeField(field.id)}
                      >
                        Remove Field
                      </Button>
                    </HStack>
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </Box>

        <Button
          colorScheme="brand"
          size="lg"
          onClick={() => onSave(formConfig)}
        >
          Save Form Configuration
        </Button>
      </VStack>
    </Box>
  );
};

export default FormEditor;
