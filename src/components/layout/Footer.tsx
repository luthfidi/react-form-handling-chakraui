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
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.50", "gray.900")}
      color={useColorModeValue("gray.700", "gray.200")}
      borderTopWidth={1}
      borderStyle={"solid"}
      borderColor={useColorModeValue("gray.200", "gray.700")}
    >
      <Container as={Stack} maxW={"6xl"} py={10}>
        <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={8}>
          <Stack align={"flex-start"}>
            <Heading as="h4" size="md" mb={3}>
              React Form Mastery
            </Heading>
            <Text
              fontSize="sm"
              color={useColorModeValue("gray.600", "gray.400")}
            >
              A comprehensive guide to building forms with React Hook Form and
              Zod
            </Text>
          </Stack>

          <Stack align={"flex-start"}>
            <Heading as="h5" size="sm">
              Resources
            </Heading>
            <Link href={"https://react-hook-form.com"} isExternal>
              React Hook Form
            </Link>
            <Link href={"https://github.com/colinhacks/zod"} isExternal>
              Zod Documentation
            </Link>
            <Link href={"https://chakra-ui.com"} isExternal>
              Chakra UI
            </Link>
            <Link href={"https://reactjs.org"} isExternal>
              React
            </Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Heading as="h5" size="sm">
              Legal
            </Heading>
            <Link href={"#"}>Privacy Policy</Link>
            <Link href={"#"}>Terms of Service</Link>
            <Link href={"#"}>Cookies Policy</Link>
          </Stack>

          <Stack align={"flex-start"}>
            <Heading as="h5" size="sm">
              Follow Us
            </Heading>
            <Flex gap={4}>
              <Link href={"https://github.com"} isExternal>
                <Icon as={FaGithub} boxSize={5} />
              </Link>
              <Link href={"https://twitter.com"} isExternal>
                <Icon as={FaTwitter} boxSize={5} />
              </Link>
              <Link href={"https://linkedin.com"} isExternal>
                <Icon as={FaLinkedin} boxSize={5} />
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
          <Text fontSize={"sm"} textAlign={"center"}>
            © {new Date().getFullYear()} React Form Mastery. All rights
            reserved. Built with ♥ for learning purposes.
          </Text>
        </Box>
      </Container>
    </Box>
  );
}
