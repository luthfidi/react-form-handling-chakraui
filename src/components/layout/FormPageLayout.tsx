import {
  Box,
  Container,
  Heading,
  Text,
  VStack,
  useColorModeValue,
  Flex,
  Badge,
  Icon,
} from "@chakra-ui/react";
import { ReactNode } from "react";
import { IconType } from "react-icons";

interface FormPageLayoutProps {
  title: string;
  description: string;
  icon: IconType;
  children: ReactNode;
  difficulty: "Basic" | "Intermediate" | "Advanced";
}

export default function FormPageLayout({
  title,
  description,
  icon,
  children,
  difficulty,
}: FormPageLayoutProps) {
  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "Basic":
        return "green";
      case "Intermediate":
        return "orange";
      case "Advanced":
        return "red";
      default:
        return "gray";
    }
  };

  return (
    <Box>
      <Box bg={useColorModeValue("brand.500", "brand.600")} py={10} mb={10}>
        <Container maxW="container.lg">
          <Flex
            align="center"
            justify="center"
            direction={{ base: "column", md: "row" }}
            textAlign={{ base: "center", md: "left" }}
          >
            <Flex
              align="center"
              justify="center"
              bg="white"
              color="brand.600"
              rounded="full"
              p={4}
              w={20}
              h={20}
              mb={{ base: 4, md: 0 }}
              mr={{ base: 0, md: 6 }}
            >
              <Icon as={icon} boxSize={10} />
            </Flex>
            <VStack align={{ base: "center", md: "start" }} spacing={2}>
              <Flex align="center">
                <Heading color="white" as="h1" size="xl">
                  {title}
                </Heading>
                <Badge
                  colorScheme={getDifficultyColor(difficulty)}
                  ml={3}
                  fontSize="md"
                >
                  {difficulty}
                </Badge>
              </Flex>
              <Text color="white" opacity={0.9} fontSize="lg" maxW="3xl">
                {description}
              </Text>
            </VStack>
          </Flex>
        </Container>
      </Box>

      <Container maxW="container.lg" mb={16}>
        {children}
      </Container>
    </Box>
  );
}
