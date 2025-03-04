import {
  Box,
  Heading,
  Text,
  Button,
  VStack,
  useColorModeValue,
  Icon,
  Flex,
  Divider,
} from "@chakra-ui/react";
import { CheckCircleIcon } from "@chakra-ui/icons";
import { useMultiStepFormStore } from "../../../store/multiStepFormStore";

const FormSuccess = () => {
  const { reset, getAllFormData } = useMultiStepFormStore();
  const formData = getAllFormData();

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  return (
    <VStack spacing={8} width="full">
      <Flex
        width="100px"
        height="100px"
        bg={useColorModeValue("green.50", "green.900")}
        borderRadius="full"
        justifyContent="center"
        alignItems="center"
      >
        <Icon as={CheckCircleIcon} w={50} h={50} color="green.500" />
      </Flex>

      <VStack spacing={3}>
        <Heading size="xl" color={textColor}>
          Registration Complete!
        </Heading>
        <Text fontSize="lg" color={mutedTextColor} textAlign="center" maxW="md">
          Thank you for completing the registration process. Your information
          has been saved successfully.
        </Text>
      </VStack>

      {formData && (
        <Box
          width="full"
          bg={cardBg}
          p={6}
          borderRadius="md"
          borderWidth="1px"
          borderColor={borderColor}
          boxShadow="md"
        >
          <VStack spacing={4} align="stretch">
            <Heading size="md" color={textColor}>
              Submission Summary
            </Heading>
            <Divider />

            <Box>
              <Text fontWeight="bold" mb={1} color={textColor}>
                Personal Information
              </Text>
              <Text color={mutedTextColor}>
                Name: {formData.personalInfo.firstName}{" "}
                {formData.personalInfo.lastName}
              </Text>
              <Text color={mutedTextColor}>
                Email: {formData.personalInfo.email}
              </Text>
              <Text color={mutedTextColor}>
                Phone: {formData.personalInfo.phone}
              </Text>
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="bold" mb={1} color={textColor}>
                Address
              </Text>
              <Text color={mutedTextColor}>{formData.address.street}</Text>
              <Text color={mutedTextColor}>
                {formData.address.city}, {formData.address.state}{" "}
                {formData.address.zipCode}
              </Text>
              <Text color={mutedTextColor}>{formData.address.country}</Text>
            </Box>

            <Divider />

            <Box>
              <Text fontWeight="bold" mb={1} color={textColor}>
                Account
              </Text>
              <Text color={mutedTextColor}>
                Username: {formData.account.username}
              </Text>
              <Text color={mutedTextColor}>Password: ••••••••</Text>
            </Box>
          </VStack>
        </Box>
      )}

      <Button colorScheme="brand" size="lg" onClick={reset} mt={4}>
        Start New Registration
      </Button>
    </VStack>
  );
};

export default FormSuccess;
