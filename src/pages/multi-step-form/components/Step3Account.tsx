import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  FormErrorMessage,
  VStack,
  HStack,
  useColorModeValue,
  InputGroup,
  InputRightElement,
  IconButton,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { MdAutoFixHigh } from "react-icons/md";
import {
  accountSchema,
  type AccountData,
} from "../../../schemas/multiStepFormSchema";
import { useMultiStepFormStore } from "../../../store/multiStepFormStore";
import { multiStepFormSampleData } from "../../../utils/SampleData";

const Step3Account = () => {
  const { account, setAccount, prevStep, completeForm } =
    useMultiStepFormStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const textColor = useColorModeValue("gray.700", "gray.200");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<AccountData>({
    resolver: zodResolver(accountSchema),
    defaultValues: account || {
      username: "",
      password: "",
      confirmPassword: "",
      termsAccepted: false,
    },
  });

  const onSubmit = (data: AccountData) => {
    setAccount(data);
    completeForm();
  };

  // Function to fill the form with sample data
  const fillWithSampleData = () => {
    reset(multiStepFormSampleData.account);
  };

  return (
    <Box as="form" onSubmit={handleSubmit(onSubmit)} width="100%">
      <VStack spacing={6} align="stretch">
        <FormControl isInvalid={!!errors.username}>
          <FormLabel htmlFor="username" color={textColor}>
            Username
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
            id="username"
            placeholder="johndoe123"
            {...register("username")}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
          />
          {errors.username && (
            <FormErrorMessage>{errors.username.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.password}>
          <FormLabel htmlFor="password" color={textColor}>
            Password
          </FormLabel>
          <InputGroup>
            <Input
              id="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              {...register("password")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            <InputRightElement>
              <IconButton
                aria-label={showPassword ? "Hide password" : "Show password"}
                variant="ghost"
                icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowPassword(!showPassword)}
                color="gray.500"
                _hover={{ color: "brand.500" }}
              />
            </InputRightElement>
          </InputGroup>
          {errors.password && (
            <FormErrorMessage>{errors.password.message}</FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.confirmPassword}>
          <FormLabel htmlFor="confirmPassword" color={textColor}>
            Confirm Password
          </FormLabel>
          <InputGroup>
            <Input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm your password"
              {...register("confirmPassword")}
              _focus={{
                borderColor: "brand.500",
                boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
              }}
            />
            <InputRightElement>
              <IconButton
                aria-label={
                  showConfirmPassword ? "Hide password" : "Show password"
                }
                variant="ghost"
                icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                color="gray.500"
                _hover={{ color: "brand.500" }}
              />
            </InputRightElement>
          </InputGroup>
          {errors.confirmPassword && (
            <FormErrorMessage>
              {errors.confirmPassword.message}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl isInvalid={!!errors.termsAccepted}>
          <Checkbox
            id="termsAccepted"
            colorScheme="brand"
            {...register("termsAccepted")}
          >
            <Text color={textColor} fontSize="sm">
              I agree to the Terms of Service and Privacy Policy
            </Text>
          </Checkbox>
          {errors.termsAccepted && (
            <FormErrorMessage>{errors.termsAccepted.message}</FormErrorMessage>
          )}
        </FormControl>

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
            Complete Registration
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Step3Account;
