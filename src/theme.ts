import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "dark",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: "#e6fffa",
      100: "#b2f5ea",
      200: "#81e6d9",
      300: "#4fd1c5",
      400: "#38b2ac",
      500: "#319795",
      600: "#2c7a7b",
      700: "#285e61",
      800: "#234e52",
      900: "#1d4044",
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "gray.100", // Changed to gray.100 for a darker light mode
        color: props.colorMode === "dark" ? "gray.200" : "gray.800", // Improved text contrast
      },
    }),
  },
  components: {
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === "dark" ? "gray.800" : "white",
          borderColor: props.colorMode === "dark" ? "gray.600" : "gray.300", // Darker border in light mode
        },
      }),
    },
    Badge: {
      baseStyle: {
        fontWeight: "bold", // Make badges bolder
      },
      variants: {
        subtle: (props: any) => ({
          bg:
            props.colorMode === "dark"
              ? `${props.colorScheme}.500` // Brighter badge background in dark mode
              : `${props.colorScheme}.100`,
          color:
            props.colorMode === "dark" ? "white" : `${props.colorScheme}.800`,
        }),
      },
    },
    // Improve contrast for buttons and other components
    Button: {
      baseStyle: {
        fontWeight: "medium",
      },
    },
    Link: {
      baseStyle: (props: any) => ({
        color: props.colorMode === "dark" ? "brand.300" : "brand.600",
        _hover: {
          textDecoration: "underline",
        },
      }),
    },
    Heading: {
      baseStyle: (props: any) => ({
        color: props.colorMode === "dark" ? "white" : "gray.800",
      }),
    },
    // Ensure form cards have good contrast
    Box: {
      variants: {
        card: (props: any) => ({
          bg: props.colorMode === "dark" ? "gray.700" : "white",
          borderColor: props.colorMode === "dark" ? "gray.600" : "gray.300",
          boxShadow: "md",
        }),
      },
    },
  },
});

export default theme;
