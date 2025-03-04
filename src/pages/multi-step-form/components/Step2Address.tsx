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
  HStack,
  useColorModeValue,
  SimpleGrid,
} from "@chakra-ui/react";
import {
  addressSchema,
  type AddressData,
} from "../../../schemas/multiStepFormSchema";
import { useMultiStepFormStore } from "../../../store/multiStepFormStore";

const Step2Address = () => {
  const { address, setAddress, nextStep, prevStep } = useMultiStepFormStore();

  const textColor = useColorModeValue("gray.700", "gray.200");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
    defaultValues: address || {
      street: "",
      city: "",
      state: "",
      zipCode: "",
      country: "",
    },
  });

  const onSubmit = (data: AddressData) => {
    setAddress(data);
    nextStep();
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <VStack spacing={6} align="stretch">
        <FormControl isInvalid={!!errors.street}>
          <FormLabel htmlFor="street" color={textColor}>
            Street Address
          </FormLabel>
          <Input
            id="street"
            placeholder="123 Main St"
            {...register("street")}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {errors.street && (
            <FormErrorMessage>{errors.street.message}</FormErrorMessage>
          )}
        </FormControl>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isInvalid={!!errors.city}>
            <FormLabel htmlFor="city" color={textColor}>
              City
            </FormLabel>
            <Input
              id="city"
              placeholder="New York"
              {...register("city")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {errors.city && (
              <FormErrorMessage>{errors.city.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.state}>
            <FormLabel htmlFor="state" color={textColor}>
              State/Province
            </FormLabel>
            <Input
              id="state"
              placeholder="NY"
              {...register("state")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {errors.state && (
              <FormErrorMessage>{errors.state.message}</FormErrorMessage>
            )}
          </FormControl>
        </SimpleGrid>

        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
          <FormControl isInvalid={!!errors.zipCode}>
            <FormLabel htmlFor="zipCode" color={textColor}>
              ZIP/Postal Code
            </FormLabel>
            <Input
              id="zipCode"
              placeholder="10001"
              {...register("zipCode")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {errors.zipCode && (
              <FormErrorMessage>{errors.zipCode.message}</FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!errors.country}>
            <FormLabel htmlFor="country" color={textColor}>
              Country
            </FormLabel>
            <Input
              id="country"
              placeholder="United States"
              {...register("country")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            {errors.country && (
              <FormErrorMessage>{errors.country.message}</FormErrorMessage>
            )}
          </FormControl>
        </SimpleGrid>

        <HStack justifyContent="space-between" pt={4}>
          <Button variant="outline" colorScheme="brand" onClick={prevStep}>
            Previous
          </Button>
          <Button
            type="submit"
            colorScheme="brand"
            size="md"
            isLoading={isSubmitting}
          >
            Next Step
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Step2Address;
