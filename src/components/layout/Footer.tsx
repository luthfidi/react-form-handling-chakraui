import {
  Box,
  Container,
  Stack,
  SimpleGrid,
  Text,
  Link,
  useColorModeValue,
  Icon,
  Flex,
  Heading,
} from "@chakra-ui/react";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

export default function Footer() {
  // Use specific colors to ensure white text in dark mode
  const linkColor = useColorModeValue("gray.700", "white");
  const headingColor = useColorModeValue("gray.800", "white");
  const descriptionColor = useColorModeValue("gray.600", "gray.200");

  return (
    <Box
      bg={useColorModeValue("white", "gray.900")}
      color={useColorModeValue("gray.700", "white")}
      borderTopWidth={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={"flex-start"}>
            <Heading as="h4" size="md" mb={3} color={headingColor}>
              React Form Mastery
            </Heading>
            <Text fontSize="sm" color={"gray.400"}>
              A comprehensive guide to building forms with React Hook Form and
              Zod
            </Text>
          </Stack>

          <Stack align={"flex-start"}>
            <Heading as="h5" size="sm" color={headingColor}>
              Core Resources
            </Heading>
            <Link
              href={"https://react-hook-form.com"}
              isExternal
              color={linkColor}
            >
              React Hook Form
            </Link>
            <Link
              href={"https://github.com/colinhacks/zod"}
              isExternal
              color={linkColor}
            >
              Zod Documentation
            </Link>
            <Link href={"https://chakra-ui.com"} isExternal color={linkColor}>
              Chakra UI
            </Link>
            <Link href={"https://reactjs.org"} isExternal color={linkColor}>
              React
            </Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Heading as="h5" size="sm" color={headingColor}>
              Additional Resources
            </Heading>
            <Link href={"https://reactrouter.com"} isExternal color={linkColor}>
              React Router
            </Link>
            <Link
              href={"https://zustand.docs.pmnd.rs/getting-started/introduction"}
              isExternal
              color={linkColor}
            >
              Zustand
            </Link>
            <Link
              href={"https://tanstack.com/query/latest"}
              isExternal
              color={linkColor}
            >
              TanStack Query
            </Link>
            <Link
              href={
                "https://react-syntax-highlighter.github.io/react-syntax-highlighter/demo/"
              }
              isExternal
              color={linkColor}
            >
              React Syntax Highlighter
            </Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Heading as="h5" size="sm" color={headingColor}>
              Follow Author
            </Heading>
            <Flex gap={4}>
              <Link
                href={"https://github.com/luthfidi"}
                isExternal
                aria-label="GitHub profile"
              >
                <Icon as={FaGithub} boxSize={5} color={linkColor} />
              </Link>
              <Link
                href={"https://instagram.com/luthfidi_"}
                isExternal
                aria-label="Instagram profile"
              >
                <Icon as={FaInstagram} boxSize={5} color={linkColor} />
              </Link>
              <Link
                href={"https://www.linkedin.com/in/luthfi-hadi"}
                isExternal
                aria-label="LinkedIn profile"
              >
                <Icon as={FaLinkedin} boxSize={5} color={linkColor} />
              </Link>
            </Flex>
          </Stack>
        </SimpleGrid>

        <Box
          pt={8}
          mt={8}
          borderTopWidth={1}
          borderStyle={"solid"}
          borderColor={useColorModeValue("gray.200", "gray.700")}
        >
          <Text fontSize={"sm"} textAlign={"center"} color={descriptionColor}>
            © {new Date().getFullYear()} React Form Mastery. All rights
            reserved. Built with ♥ for learning purposes.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
