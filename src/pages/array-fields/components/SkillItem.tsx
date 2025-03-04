import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Select,
  FormErrorMessage,
  HStack,
  IconButton,
  useColorModeValue,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Control, useFormState, UseFormRegister } from "react-hook-form";
import { ArrayFieldsFormData } from "../../../schemas/arrayFieldsSchema";

interface SkillItemProps {
  index: number;
  register: UseFormRegister<ArrayFieldsFormData>;
  control: Control<ArrayFieldsFormData>;
  onRemove: () => void;
}

const SkillItem = ({ index, register, control, onRemove }: SkillItemProps) => {
  const { errors } = useFormState({ control });
  const skillErrors = errors.skills?.[index];

  const textColor = useColorModeValue("gray.700", "gray.200");

  return (
    <HStack spacing={4} align="flex-start" width="full">
      <FormControl isInvalid={!!skillErrors?.name} flex={2}>
        <FormLabel
          htmlFor={`skills.${index}.name`}
          color={textColor}
          fontSize="sm"
        >
          Skill
        </FormLabel>
        <Input
          id={`skills.${index}.name`}
          placeholder="E.g. JavaScript, Project Management"
          {...register(`skills.${index}.name`)}
          _focus={{
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
          }}
        />
        {skillErrors?.name && (
          <FormErrorMessage>
            {skillErrors.name.message as string}
          </FormErrorMessage>
        )}
      </FormControl>

      <FormControl isInvalid={!!skillErrors?.level} flex={1}>
        <FormLabel
          htmlFor={`skills.${index}.level`}
          color={textColor}
          fontSize="sm"
        >
          Level
        </FormLabel>
        <Select
          id={`skills.${index}.level`}
          {...register(`skills.${index}.level`)}
          _focus={{
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
          }}
        >
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
          <option value="expert">Expert</option>
        </Select>
        {skillErrors?.level && (
          <FormErrorMessage>
            {skillErrors.level.message as string}
          </FormErrorMessage>
        )}
      </FormControl>

      <IconButton
        aria-label="Remove skill"
        icon={<DeleteIcon />}
        onClick={onRemove}
        alignSelf="flex-end"
        mt={8}
        size="sm"
        colorScheme="red"
        variant="ghost"
      />
    </HStack>
  );
};

export default SkillItem;
