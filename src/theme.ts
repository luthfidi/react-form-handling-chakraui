import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
        50: '#e6fffa',
        100: '#b2f5ea',
        200: '#81e6d9',
        300: '#4fd1c5',
        400: '#38b2ac',
        500: '#319795',
        600: '#2c7a7b',
        700: '#285e61',
        800: '#234e52',
        900: '#1d4044',
    },
  },
  styles: {
    global: (props: any) => ({
      body: {
        bg: props.colorMode === "dark" ? "gray.900" : "white",
      },
    }),
  },
  components: {
    Card: {
      baseStyle: (props: any) => ({
        container: {
          bg: props.colorMode === "dark" ? "gray.700" : "white",
          borderColor: props.colorMode === "dark" ? "gray.600" : "gray.200",
        },
      }),
    },
  },
});

export default theme;
