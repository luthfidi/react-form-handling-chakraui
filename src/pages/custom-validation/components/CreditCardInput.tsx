import React, { useState } from "react";
import {
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Flex,
  Text,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import {
  FaCreditCard,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex,
  FaCcDiscover,
} from "react-icons/fa";
import { UseFormRegister, FieldError } from "react-hook-form";

interface CreditCardInputProps {
  id: string;
  name: string;
  label: string;
  register: UseFormRegister<any>;
  error?: FieldError;
  isRequired?: boolean;
  onCardTypeChange?: (cardType: string) => void;
  placeholder?: string;
  helperText?: string;
}

// Credit card types with their regex patterns
const cardTypes = [
  { type: "visa", pattern: /^4/, icon: FaCcVisa },
  { type: "mastercard", pattern: /^(5[1-5]|2[2-7])/, icon: FaCcMastercard },
  { type: "amex", pattern: /^3[47]/, icon: FaCcAmex },
  { type: "discover", pattern: /^6(?:011|5)/, icon: FaCcDiscover },
  { type: "generic", pattern: /^.*/, icon: FaCreditCard },
];

// Format card number with spaces
const formatCardNumber = (value: string): string => {
  if (!value) return "";

  // Remove all non-digit characters
  const cardNumber = value.replace(/\D/g, "");

  // Format based on detected card type
  if (/^3[47]/.test(cardNumber)) {
    // AMEX: XXXX XXXXXX XXXXX
    return cardNumber.replace(/^(\d{4})(\d{6})(\d{0,5}).*$/, "$1 $2 $3").trim();
  } else {
    // Other cards: XXXX XXXX XXXX XXXX
    return cardNumber
      .replace(/^(\d{4})(\d{4})?(\d{4})?(\d{0,4})?.*$/, "$1 $2 $3 $4")
      .trim();
  }
};

// Detect card type from number
const detectCardType = (value: string): string => {
  if (!value) return "generic";

  const cardNumber = value.replace(/\D/g, "");
  const matchedCard = cardTypes.find(
    (card) => card.pattern.test(cardNumber) && card.type !== "generic"
  );

  return matchedCard?.type || "generic";
};

const CreditCardInput: React.FC<CreditCardInputProps> = ({
  id,
  name,
  label,
  register,
  error,
  isRequired = false,
  onCardTypeChange,
  placeholder = "4929 9223 1698 6350",
  helperText,
}) => {
  const [formattedValue, setFormattedValue] = useState("");
  const [cardType, setCardType] = useState("generic");

  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const validIconColor = useColorModeValue("green.500", "green.400");

  // Get the CardIcon component based on detected type
  const CardIcon =
    cardTypes.find((card) => card.type === cardType)?.icon || FaCreditCard;

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const digitsOnly = inputValue.replace(/\D/g, "");

    // Limit input length based on card type
    const isAmex = /^3[47]/.test(digitsOnly);
    const maxLength = isAmex ? 15 : 16;
    const truncatedValue = digitsOnly.slice(0, maxLength);

    // Format the value with spaces
    const formatted = formatCardNumber(truncatedValue);
    setFormattedValue(formatted);

    // Update native input (for React Hook Form)
    e.target.value = truncatedValue;

    // Detect and set card type
    const detectedType = detectCardType(truncatedValue);
    if (detectedType !== cardType) {
      setCardType(detectedType);
      if (onCardTypeChange) {
        onCardTypeChange(detectedType);
      }
    }
  };

  // Register the input with React Hook Form
  const { onChange, ...rest } = register(name, {
    setValueAs: (value: string) => value.replace(/\D/g, ""),
  });

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <FormLabel htmlFor={id} color={textColor}>
        {label}
      </FormLabel>

      <InputGroup>
        <Input
          id={id}
          placeholder={placeholder}
          value={formattedValue}
          onChange={(e) => {
            handleChange(e);
            onChange(e); // Call the React Hook Form onChange
          }}
          maxLength={cardType === "amex" ? 17 : 19} // Including spaces
          {...rest}
          _focus={{
            borderColor: "brand.500",
            boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
          }}
        />

        <InputRightElement>
          <Flex align="center">
            <Icon
              as={CardIcon}
              boxSize={6}
              color={
                formattedValue.replace(/\s/g, "").length >= 13
                  ? validIconColor
                  : "gray.400"
              }
            />
          </Flex>
        </InputRightElement>
      </InputGroup>

      {helperText && !error && (
        <Text fontSize="xs" color={mutedTextColor} mt={1}>
          {helperText}
        </Text>
      )}

      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export default CreditCardInput;
