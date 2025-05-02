import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
  FormErrorMessage,
  VStack,
  IconButton,
  useColorModeValue,
  Flex,
  Spacer,
  SimpleGrid,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  Control,
  useController,
  useFormState,
  UseFormRegister,
} from "react-hook-form";
import { ArrayFieldsFormData } from "../../../schemas/arrayFieldsSchema";

interface ExperienceItemProps {
  index: number;
  register: UseFormRegister<ArrayFieldsFormData>;
  control: Control<ArrayFieldsFormData>;
  onRemove: () => void;
  isRemoveDisabled: boolean;
}

const ExperienceItem = ({
  index,
  register,
  control,
  onRemove,
  isRemoveDisabled,
}: ExperienceItemProps) => {
  const { errors } = useFormState({ control });
  const experienceErrors = errors.experience?.[index];

  const { field: currentField } = useController({
    name: `experience.${index}.current`,
    control,
  });

  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const bgColor = useColorModeValue("gray.50", "gray.800");

  return (
    <Box
      position="relative"
      p={4}
      borderWidth="1px"
      borderRadius="md"
      borderColor={borderColor}
      bg={bgColor}
    >
      <Flex align="center" mb={4}>
        <Box fontWeight="medium" fontSize="md" color={textColor}>
          Experience #{index + 1}
        </Box>
        <Spacer />
        <IconButton
          aria-label="Remove experience"
          icon={<DeleteIcon />}
          onClick={onRemove}
          variant="ghost"
          colorScheme="red"
          size="sm"
          isDisabled={isRemoveDisabled}
        />
      </Flex>

      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!experienceErrors?.company}>
          <FormLabel htmlFor={`experience.${index}.company`} color={textColor}>
            Company
          </FormLabel>
          <Input
            id={`experience.${index}.company`}
            placeholder="Enter company name"
            {...register(`experience.${index}.company`)}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {experienceErrors?.company && (
            <FormErrorMessage>
              {experienceErrors.company.message as string}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!experienceErrors?.position}>
          <FormLabel htmlFor={`experience.${index}.position`} color={textColor}>
            Position
          </FormLabel>
          <Input
            id={`experience.${index}.position`}
            placeholder="Enter job title"
            {...register(`experience.${index}.position`)}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {experienceErrors?.position && (
            <FormErrorMessage>
              {experienceErrors.position.message as string}
            </FormErrorMessage>
          )}
        </FormControl>

        {/* Improved responsive date fields */}
        <SimpleGrid columns={{ base: 1, sm: 2 }} spacing={4}>
          <FormControl isInvalid={!!experienceErrors?.startDate}>
            <FormLabel
              htmlFor={`experience.${index}.startDate`}
              color={textColor}
            >
              Start Date
            </FormLabel>
            <Input
              id={`experience.${index}.startDate`}
              type="month"
              {...register(`experience.${index}.startDate`)}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {experienceErrors?.startDate && (
              <FormErrorMessage>
                {experienceErrors.startDate.message as string}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl
            isInvalid={!!experienceErrors?.endDate}
            isDisabled={currentField.value}
          >
            <FormLabel
              htmlFor={`experience.${index}.endDate`}
              color={textColor}
            >
              End Date
            </FormLabel>
            <Input
              id={`experience.${index}.endDate`}
              type="month"
              {...register(`experience.${index}.endDate`)}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
              isDisabled={currentField.value}
            />
            {experienceErrors?.endDate && (
              <FormErrorMessage>
                {experienceErrors.endDate.message as string}
              </FormErrorMessage>
            )}
          </FormControl>
        </SimpleGrid>

        <FormControl>
          <Checkbox
            id={`experience.${index}.current`}
            isChecked={currentField.value}
            onChange={currentField.onChange}
            colorScheme="brand"
          >
            <Box color={textColor}>I currently work here</Box>
          </Checkbox>
        </FormControl>

        <FormControl isInvalid={!!experienceErrors?.description}>
          <FormLabel
            htmlFor={`experience.${index}.description`}
            color={textColor}
          >
            Description
          </FormLabel>
          <Textarea
            id={`experience.${index}.description`}
            placeholder="Describe your responsibilities and achievements"
            {...register(`experience.${index}.description`)}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {experienceErrors?.description && (
            <FormErrorMessage>
              {experienceErrors.description.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
      </VStack>
    </Box>
  );
};

export default ExperienceItem;
