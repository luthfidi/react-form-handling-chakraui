import React from "react";
import {
  Box,
  Select,
  FormLabel,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  useColorModeValue,
  Text,
  Flex,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import { ChevronDownIcon } from "@chakra-ui/icons";
import {
  availableLanguages,
  LanguageCode,
  uiTranslations,
} from "../../../schemas/internationalizationSchema";
import { useI18nFormStore } from "../../../store/i18nFormStore";

interface LanguageSelectorProps {
  variant?: "select" | "menu" | "buttons";
}

const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = "select",
}) => {
  const { currentLanguage, setLanguage } = useI18nFormStore();

  const textColor = useColorModeValue("gray.700", "gray.200");
  const menuBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");
  const activeBg = useColorModeValue("gray.200", "gray.500");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const handleLanguageChange = (langCode: LanguageCode) => {
    setLanguage(langCode);
  };

  // Select dropdown variant
  if (variant === "select") {
    return (
      <Box>
        <FormLabel htmlFor="language-select" color={textColor}>
          {uiTranslations[currentLanguage].changeLanguage}
        </FormLabel>
        <Select
          id="language-select"
          value={currentLanguage}
          onChange={(e) => handleLanguageChange(e.target.value as LanguageCode)}
          w="auto"
        >
          {availableLanguages.map((lang) => (
            <option key={lang.code} value={lang.code}>
              {lang.name}
            </option>
          ))}
        </Select>
      </Box>
    );
  }

  // Menu dropdown variant
  if (variant === "menu") {
    return (
      <Menu>
        <MenuButton
          as={Button}
          rightIcon={<ChevronDownIcon />}
          variant="outline"
          borderColor={borderColor}
        >
          {availableLanguages.find((lang) => lang.code === currentLanguage)
            ?.name || "English"}
        </MenuButton>
        <MenuList bg={menuBg}>
          {availableLanguages.map((lang) => (
            <MenuItem
              key={lang.code}
              onClick={() => handleLanguageChange(lang.code)}
              bg={lang.code === currentLanguage ? activeBg : undefined}
              _hover={{ bg: hoverBg }}
            >
              {lang.name}
            </MenuItem>
          ))}
        </MenuList>
      </Menu>
    );
  }

  // Buttons variant
  return (
    <Box width="100%">
      <Text mb={2} color={textColor}>
        {uiTranslations[currentLanguage].changeLanguage}
      </Text>
      <Flex justify="center" width="100%">
        <Wrap spacing={2} justify="center">
          {availableLanguages.map((lang) => (
            <WrapItem key={lang.code}>
              <Button
                size="sm"
                onClick={() => handleLanguageChange(lang.code)}
                colorScheme={lang.code === currentLanguage ? "brand" : "gray"}
                variant={lang.code === currentLanguage ? "solid" : "outline"}
                minW="90px"
              >
                {lang.name}
              </Button>
            </WrapItem>
          ))}
        </Wrap>
      </Flex>
    </Box>
  );
};

export default LanguageSelector;
