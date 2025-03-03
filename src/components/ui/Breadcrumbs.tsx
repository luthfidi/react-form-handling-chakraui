import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  useColorModeValue,
  Flex,
  Icon,
  Container,
} from "@chakra-ui/react";
import { ChevronRightIcon } from "@chakra-ui/icons";
import { Link as RouterLink, useLocation } from "react-router-dom";
import { Fragment } from "react";

interface BreadcrumbsProps {
  items?: { label: string; href: string }[];
}

// This function converts a path like "/multi-step-form" to "Multi Step Form"
const formatPathName = (path: string): string => {
  // Remove the leading slash and split by dash
  const parts = path.replace(/^\//, "").split("-");

  // Capitalize first letter of each word and join with spaces
  return parts
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

// Generate breadcrumb items from current path
const generateBreadcrumbItems = (
  pathname: string
): { label: string; href: string }[] => {
  const paths = pathname.split("/").filter(Boolean);

  return paths.map((path, index) => {
    const href = "/" + paths.slice(0, index + 1).join("/");
    return {
      label: formatPathName(path),
      href,
    };
  });
};

const Breadcrumbs = ({ items }: BreadcrumbsProps) => {
  const location = useLocation();
  const breadcrumbItems = items || generateBreadcrumbItems(location.pathname);

  // Only show breadcrumbs if we're not on the home page
  if (location.pathname === "/") {
    return null;
  }

  return (
    <Flex w="full" py={4} bg={useColorModeValue("white", "gray.800")}>
      <Container maxW="container.xl">
        <Breadcrumb
          spacing="8px"
          separator={<ChevronRightIcon color="gray.500" />}
        >
          <BreadcrumbItem>
            <BreadcrumbLink as={RouterLink} to="/">
              Home
            </BreadcrumbLink>
          </BreadcrumbItem>

          {breadcrumbItems.map((item, index) => (
            <BreadcrumbItem
              key={item.href}
              isCurrentPage={index === breadcrumbItems.length - 1}
            >
              <BreadcrumbLink
                as={RouterLink}
                to={item.href}
                isCurrentPage={index === breadcrumbItems.length - 1}
                fontWeight={
                  index === breadcrumbItems.length - 1 ? "semibold" : "normal"
                }
              >
                {item.label}
              </BreadcrumbLink>
            </BreadcrumbItem>
          ))}
        </Breadcrumb>
      </Container>
    </Flex>
  );
};

export default Breadcrumbs;
