import {
  Box,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  IconButton,
  useColorModeValue,
  Flex,
  Spacer,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import { Control, useFormState, UseFormRegister } from "react-hook-form";
import { ArrayFieldsFormData } from "../../../schemas/arrayFieldsSchema";

interface EducationItemProps {
  index: number;
  register: UseFormRegister<ArrayFieldsFormData>;
  control: Control<ArrayFieldsFormData>;
  onRemove: () => void;
  isRemoveDisabled: boolean;
}

const EducationItem = ({
  index,
  register,
  control,
  onRemove,
  isRemoveDisabled,
}: EducationItemProps) => {
  const { errors } = useFormState({ control });
  const educationErrors = errors.education?.[index];

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
          Education #{index + 1}
        </Box>
        <Spacer />
        <IconButton
          aria-label="Remove education"
          icon={<DeleteIcon />}
          onClick={onRemove}
          variant="ghost"
          colorScheme="red"
          size="sm"
          isDisabled={isRemoveDisabled}
        />
      </Flex>

      <VStack spacing={4} align="stretch">
        <FormControl isInvalid={!!educationErrors?.institution}>
          <FormLabel
            htmlFor={`education.${index}.institution`}
            color={textColor}
          >
            Institution
          </FormLabel>
          <Input
            id={`education.${index}.institution`}
            placeholder="Enter school or university name"
            {...register(`education.${index}.institution`)}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {educationErrors?.institution && (
            <FormErrorMessage>
              {educationErrors.institution.message as string}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!educationErrors?.degree}>
          <FormLabel htmlFor={`education.${index}.degree`} color={textColor}>
            Degree
          </FormLabel>
          <Input
            id={`education.${index}.degree`}
            placeholder="E.g. Bachelor of Science, High School Diploma"
            {...register(`education.${index}.degree`)}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {educationErrors?.degree && (
            <FormErrorMessage>
              {educationErrors.degree.message as string}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!educationErrors?.fieldOfStudy}>
          <FormLabel
            htmlFor={`education.${index}.fieldOfStudy`}
            color={textColor}
          >
            Field of Study
          </FormLabel>
          <Input
            id={`education.${index}.fieldOfStudy`}
            placeholder="E.g. Computer Science, Business"
            {...register(`education.${index}.fieldOfStudy`)}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {educationErrors?.fieldOfStudy && (
            <FormErrorMessage>
              {educationErrors.fieldOfStudy.message as string}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!educationErrors?.graduationDate}>
          <FormLabel
            htmlFor={`education.${index}.graduationDate`}
            color={textColor}
          >
            Graduation Date
          </FormLabel>
          <Input
            id={`education.${index}.graduationDate`}
            type="month"
            {...register(`education.${index}.graduationDate`)}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {educationErrors?.graduationDate && (
            <FormErrorMessage>
              {educationErrors.graduationDate.message as string}
            </FormErrorMessage>
          )}
        </FormControl>
      </VStack>
    </Box>
  );
};

export default EducationItem;
