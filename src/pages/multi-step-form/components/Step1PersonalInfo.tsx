import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  VStack,
  useColorModeValue,
  SimpleGrid,
  Tooltip,
  IconButton,
} from "@chakra-ui/react";
import { MdAutoFixHigh } from "react-icons/md";
import {
  personalInfoSchema,
  type PersonalInfoData,
} from "../../../schemas/multiStepFormSchema";
import { useMultiStepFormStore } from "../../../store/multiStepFormStore";
import { multiStepFormSampleData } from "../../../utils/SampleData";

const Step1PersonalInfo = () => {
  const { personalInfo, setPersonalInfo, nextStep } = useMultiStepFormStore();

  const textColor = useColorModeValue("gray.700", "gray.200");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PersonalInfoData>({
    resolver: zodResolver(personalInfoSchema),
    defaultValues: personalInfo || {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
    },
  });

  const onSubmit = (data: PersonalInfoData) => {
    setPersonalInfo(data);
    nextStep();
  };

  // Function to fill the form with sample data
  const fillWithSampleData = () => {
    reset(multiStepFormSampleData.personalInfo);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <VStack spacing={6} align="stretch">
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isInvalid={!!errors.firstName}>
            <FormLabel htmlFor="firstName" color={textColor}>
              First Name
              <Tooltip label="Fill with sample data" placement="top">
                <IconButton
                  aria-label="Fill with sample data"
                  icon={<MdAutoFixHigh />}
                  size="xs"
                  ml={2}
                  onClick={(e) => {
                    e.preventDefault();
                    fillWithSampleData();
                  }}
                  colorScheme="blue"
                  variant="ghost"
                />
              </Tooltip>
            </FormLabel>
            <Input
              id="firstName"
              placeholder="John"
              {...register("firstName")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {errors.firstName && (
              <FormErrorMessage>{errors.firstName.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.lastName}>
            <FormLabel htmlFor="lastName" color={textColor}>
              Last Name
            </FormLabel>
            <Input
              id="lastName"
              placeholder="Doe"
              {...register("lastName")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {errors.lastName && (
              <FormErrorMessage>{errors.lastName.message}</FormErrorMessage>
            )}
          </FormControl>
        </SimpleGrid>

        <FormControl isInvalid={!!errors.email}>
          <FormLabel htmlFor="email" color={textColor}>
            Email Address
          </FormLabel>
          <Input
            id="email"
            type="email"
            placeholder="john.doe@example.com"
            {...register("email")}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {errors.email && (
            <FormErrorMessage>{errors.email.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.phone}>
          <FormLabel htmlFor="phone" color={textColor}>
            Phone Number
          </FormLabel>
          <Input
            id="phone"
            placeholder="+1 (555) 123-4567"
            {...register("phone")}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {errors.phone && (
            <FormErrorMessage>{errors.phone.message}</FormErrorMessage>
          )}
        </FormControl>

        <Button
          type="submit"
          colorScheme="brand"
          size="md"
          isLoading={isSubmitting}
          alignSelf="flex-end"
          mt={4}
        >
          Next Step
        </Button>
      </VStack>
    </Box>
  );
};

export default Step1PersonalInfo;
