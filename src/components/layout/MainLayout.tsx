import { ReactNode } from "react";
import { Box, Container, Flex, useColorModeValue } from "@chakra-ui/react";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "../ui/Breadcrumbs";
import { useLocation } from "react-router-dom";

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout = ({ children }: MainLayoutProps) => {
  const bgColor = useColorModeValue("white", "gray.900");
  const location = useLocation();

  // Only show homepage content full width, other pages with container
  const isHomePage = location.pathname === "/";

  return (
    <Flex direction="column" minH="100vh" bg={bgColor}>
      <Header />
      {!isHomePage && <Breadcrumbs />}
      <Box as="main" flex="1">
        {children}
      </Box>
      <Footer />
    </Flex>
  );
};

export default MainLayout;
