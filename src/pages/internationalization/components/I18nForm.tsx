// I18nForm.tsx - Komponen form dengan auto-fill yang diperbaiki
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  FormErrorMessage,
  VStack,
  HStack,
  Checkbox,
  RadioGroup,
  Radio,
  Stack,
  useColorModeValue,
  Divider,
  IconButton,
  Tooltip,
} from "@chakra-ui/react";
import { MdAutoFixHigh } from "react-icons/md";
import {
  formFields,
  I18nField,
  I18nFormData,
  uiTranslations,
  createI18nSchema,
  LanguageCode,
} from "../../../schemas/internationalizationSchema";

interface I18nFormProps {
  onSubmitSuccess: (data: I18nFormData) => void;
  getLocalizedSampleData: (language: LanguageCode) => I18nFormData;
  currentLanguage: LanguageCode;
}

const I18nForm: React.FC<I18nFormProps> = ({
  onSubmitSuccess,
  getLocalizedSampleData,
  currentLanguage,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get schema for current language
  const schema = createI18nSchema(currentLanguage);

  // Colors
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  // Initialize React Hook Form with dynamic schema based on language
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm<I18nFormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      message: "",
      preferredContact: "email",
      terms: false,
    },
  });

  // Watch preferred contact method for conditional validation
  const preferredContact = watch("preferredContact");

  // Update form when language changes
  useEffect(() => {
    // Existing form values will be preserved
  }, [currentLanguage]);

  // Handle form submission
  const onSubmit = async (data: I18nFormData) => {
    setIsSubmitting(true);

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));

    setIsSubmitting(false);
    onSubmitSuccess(data);
    reset();
  };

  // Fill form with localized sample data
  const fillWithSampleData = () => {
    const sampleData = getLocalizedSampleData(currentLanguage);
    reset(sampleData);
  };

  // Render form field based on its type and language
  const renderField = (field: I18nField) => {
    const fieldTranslation = field.translations[currentLanguage];
    const isInvalid = !!errors[field.name as keyof I18nFormData];

    switch (field.type) {
      case "text":
      case "email":
        return (
          <FormControl
            key={field.name}
            isInvalid={isInvalid}
            isRequired={field.required}
          >
            <FormLabel htmlFor={field.name} color={textColor}>
              {fieldTranslation.label}
            </FormLabel>
            <Input
              id={field.name}
              type={field.type}
              placeholder={fieldTranslation.placeholder}
              {...register(field.name as keyof I18nFormData)}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {isInvalid && (
              <FormErrorMessage>
                {errors[field.name as keyof I18nFormData]?.message}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      case "textarea":
        return (
          <FormControl
            key={field.name}
            isInvalid={isInvalid}
            isRequired={field.required}
          >
            <FormLabel htmlFor={field.name} color={textColor}>
              {fieldTranslation.label}
            </FormLabel>
            <Textarea
              id={field.name}
              placeholder={fieldTranslation.placeholder}
              {...register(field.name as keyof I18nFormData)}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
              rows={4}
            />
            {isInvalid && (
              <FormErrorMessage>
                {errors[field.name as keyof I18nFormData]?.message}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      case "checkbox":
        return (
          <FormControl
            key={field.name}
            isInvalid={isInvalid}
            isRequired={field.required}
          >
            <Checkbox
              id={field.name}
              colorScheme="brand"
              {...register(field.name as keyof I18nFormData)}
            >
              {fieldTranslation.label}
            </Checkbox>
            {isInvalid && (
              <FormErrorMessage>
                {errors[field.name as keyof I18nFormData]?.message}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      case "radio":
        return (
          <FormControl
            key={field.name}
            isInvalid={isInvalid}
            isRequired={field.required}
          >
            <FormLabel htmlFor={field.name} color={textColor}>
              {fieldTranslation.label}
            </FormLabel>
            <RadioGroup
              defaultValue="email"
              value={preferredContact}
              onChange={(value) =>
                setValue("preferredContact", value as "email" | "phone")
              }
            >
              <Stack spacing={4} direction={{ base: "column", md: "row" }}>
                {fieldTranslation.options?.map((option) => (
                  <Radio
                    key={option.value}
                    value={option.value}
                    colorScheme="brand"
                    {...register(field.name as keyof I18nFormData)}
                  >
                    {option.label}
                  </Radio>
                ))}
              </Stack>
            </RadioGroup>
            {isInvalid && (
              <FormErrorMessage>
                {errors[field.name as keyof I18nFormData]?.message}
              </FormErrorMessage>
            )}
          </FormControl>
        );

      default:
        return null;
    }
  };

  return (
    <Box
      as="form"
      onSubmit={handleSubmit(onSubmit)}
      borderWidth="1px"
      borderRadius="lg"
      borderColor={borderColor}
      p={6}
      w="full"
      boxShadow="md"
      bg={useColorModeValue("white", "gray.800")}
      position="relative"
    >
      {/* Perbaikan button auto-fill dengan penempatan yang lebih akurat */}
      <Box position="absolute" top={4} right={4} zIndex={1}>
        <Tooltip
          label={
            uiTranslations[currentLanguage].fillSampleData ||
            "Fill with sample data"
          }
          placement="left"
        >
          <IconButton
            aria-label="Fill with sample data"
            icon={<MdAutoFixHigh />}
            size="md"
            onClick={fillWithSampleData}
            colorScheme="blue"
            variant="ghost"
          />
        </Tooltip>
      </Box>

      <VStack spacing={5} align="stretch">
        <VStack spacing={4} align="stretch">
          {formFields.map((field) => renderField(field))}
        </VStack>

        <Divider />

        <HStack spacing={4} justify="flex-end">
          <Button
            variant="outline"
            onClick={() => reset()}
            isDisabled={isSubmitting}
          >
            {uiTranslations[currentLanguage].resetButton}
          </Button>
          <Button
            type="submit"
            colorScheme="brand"
            isLoading={isSubmitting}
            loadingText={uiTranslations[currentLanguage].submitButton}
          >
            {uiTranslations[currentLanguage].submitButton}
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default I18nForm;
