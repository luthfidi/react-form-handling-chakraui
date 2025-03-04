import {
  Box,
  Heading,
  Text,
  SimpleGrid,
  VStack,
  useColorModeValue,
  Container,
} from "@chakra-ui/react";
import FormCard from "../components/ui/FormCard";
import {
  FaUserPlus,
  FaLayerGroup,
  FaRandom,
  FaListUl,
  FaFileUpload,
  FaNetworkWired,
  FaSync,
  FaCode,
  FaMagic,
  FaGlobe,
} from "react-icons/fa";

export default function HomePage() {
  return (
    <Box>
      {/* Hero Section */}
      <Box
        bg={useColorModeValue("brand.500", "brand.600")}
        py={{ base: "30px", md: "40px" }}
        backgroundImage="linear-gradient(135deg, var(--chakra-colors-brand-600), var(--chakra-colors-brand-500))"
        mb={14}
      >
        <Container maxW="container.xl">
          <VStack spacing={6} textAlign="center">
            <Heading
              as="h1"
              fontSize={{ base: "3xl", sm: "4xl", md: "5xl", lg: "6xl" }}
              fontWeight="extrabold"
              color="white"
              lineHeight="shorter"
            >
              Master Form Handling with React
            </Heading>
            <Text
              fontSize={{ base: "md", md: "xl" }}
              color="white"
              maxW="3xl"
              opacity={0.9}
            >
              A comprehensive guide to building complex forms with React Hook
              Form and Zod schema validation. Explore these 10 real-world
              examples to level up your form development skills.
            </Text>
          </VStack>
        </Container>
      </Box>

      {/* Cards Section */}
      <Container maxW="container.xl" mt={{ base: "-40px", md: "-60px" }}>
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3 }}
          spacing={{ base: 5, lg: 8 }}
          py={10}
          justifyItems="center"
        >
          <FormCard
            title="Basic Registration Form"
            description="Learn the fundamentals of form validation including required fields, email format, password matching, and basic submission handling."
            icon={FaUserPlus}
            to="/basic-registration"
            difficulty="Basic"
          />

          <FormCard
            title="Multi-step Form"
            description="Create a wizard-style form with multiple steps, progress tracking, and state persistence between steps."
            icon={FaLayerGroup}
            to="/multi-step-form"
            difficulty="Intermediate"
          />

          <FormCard
            title="Dependent Fields"
            description="Build forms with conditional fields that appear or change based on values entered in other fields."
            icon={FaRandom}
            to="/dependent-fields"
            difficulty="Intermediate"
          />

          <FormCard
            title="Array Field Management"
            description="Handle dynamic arrays of fields with add/remove functionality - perfect for managing lists of items."
            icon={FaListUl}
            to="/array-fields"
            difficulty="Intermediate"
          />

          <FormCard
            title="File Upload Validation"
            description="Implement file uploads with comprehensive validation for file type, size, and count limitations."
            icon={FaFileUpload}
            to="/file-upload"
            difficulty="Advanced"
          />

          <FormCard
            title="Nested Object Forms"
            description="Structure complex forms with deeply nested objects while maintaining clean validation and error handling."
            icon={FaNetworkWired}
            to="/nested-objects"
            difficulty="Advanced"
          />

          <FormCard
            title="Async Validation"
            description="Implement server-side validation checks such as username availability without a real backend."
            icon={FaSync}
            to="/async-validation"
            difficulty="Advanced"
          />

          <FormCard
            title="Custom Validation Rules"
            description="Create sophisticated custom validation logic beyond what schema validation provides out of the box."
            icon={FaCode}
            to="/custom-validation"
            difficulty="Advanced"
          />

          <FormCard
            title="Dynamic Form Generation"
            description="Generate form fields dynamically based on external data or API responses."
            icon={FaMagic}
            to="/dynamic-fields"
            difficulty="Advanced"
          />

          <FormCard
            title="Internationalized Forms"
            description="Build forms with multi-language support for labels, placeholders, and error messages."
            icon={FaGlobe}
            to="/internationalization"
            difficulty="Advanced"
          />
        </SimpleGrid>
      </Container>

      {/* Features Section */}
      <Box py={14} bg={useColorModeValue("gray.50", "gray.800")}>
        <Container maxW="container.xl">
          <VStack spacing={12}>
            <VStack spacing={4} textAlign="center">
              <Heading as="h2" size="xl">
                Why Use React Hook Form & Zod?
              </Heading>
              <Text
                maxW="3xl"
                fontSize="lg"
                color={useColorModeValue("gray.600", "gray.400")}
              >
                A powerful combination for building type-safe, performant forms
                with minimal re-renders and maximum validation capabilities.
              </Text>
            </VStack>

            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={10} w="full">
              <Box
                p={6}
                bg={useColorModeValue("white", "gray.700")}
                rounded="xl"
                shadow="md"
                borderWidth="1px"
                borderColor={useColorModeValue("gray.100", "gray.600")}
              >
                <Heading as="h3" size="md" mb={4}>
                  Performance Focused
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.300")}>
                  Minimize unnecessary re-renders with uncontrolled components
                  and efficient validation.
                </Text>
              </Box>

              <Box
                p={6}
                bg={useColorModeValue("white", "gray.700")}
                rounded="xl"
                shadow="md"
                borderWidth="1px"
                borderColor={useColorModeValue("gray.100", "gray.600")}
              >
                <Heading as="h3" size="md" mb={4}>
                  Type Safety
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.300")}>
                  First-class TypeScript support with automatic type inference
                  from your Zod schemas.
                </Text>
              </Box>

              <Box
                p={6}
                bg={useColorModeValue("white", "gray.700")}
                rounded="xl"
                shadow="md"
                borderWidth="1px"
                borderColor={useColorModeValue("gray.100", "gray.600")}
              >
                <Heading as="h3" size="md" mb={4}>
                  Developer Experience
                </Heading>
                <Text color={useColorModeValue("gray.600", "gray.300")}>
                  Intuitive API, excellent developer tools, and extensive
                  documentation.
                </Text>
              </Box>
            </SimpleGrid>
          </VStack>
        </Container>
      </Box>
    </Box>
  );
}
