import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import {

  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  InputGroup,
  InputRightElement,
  Spinner,
  Text,
  useColorModeValue,
  Flex,
  Badge,
  Icon,
  Box,
  VStack,
  HStack,
  Collapse,
  Progress,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon, InfoIcon } from "@chakra-ui/icons";
import {
  useController,
  UseFormRegister,
  FieldError,
  useFormContext,
  Control,
} from "react-hook-form";

interface UsernameValidatorProps {
  id: string;
  name: string;
  label: string;
  register: UseFormRegister<any>;
  control: Control<any>;
  error?: FieldError;
  isRequired?: boolean;
  placeholder?: string;
  helperText?: string;
  onAvailabilityCheck?: (isAvailable: boolean) => void;
  onStrengthChange?: (score: number) => void;
  showStrengthMeter?: boolean;
  blacklist?: string[];
  minLength?: number;
  maxLength?: number;
  debounceMs?: number;
}

// Simulated existing usernames database
const EXISTING_USERNAMES = [
  "admin",
  "user",
  "test",
  "moderator",
  "johndoe",
  "janedoe",
  "webmaster",
  "support",
  "guest",
  "customer",
];

// Common weak username patterns
const COMMON_USERNAMES = [
  "admin",
  "user",
  "test",
  "guest",
  "demo",
  "customer",
  "support",
  "123456",
  "password",
  "default",
];

// Forward ref implementation to expose functions to parent
const UsernameValidator = forwardRef<any, UsernameValidatorProps>(
  (
    {
      id,
      name,
      label,
      register,
      error,
      isRequired = false,
      placeholder = "Choose a username",
      helperText,
      onAvailabilityCheck,
      onStrengthChange,
      showStrengthMeter = false,
      blacklist = [],
      minLength = 3,
      maxLength = 20,
      debounceMs = 500,
    },
    ref
  ) => {
    const [isChecking, setIsChecking] = useState(false);
    const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
    const [strength, setStrength] = useState(0); // 0-5 scale
    const [suggestions, setSuggestions] = useState<string[]>([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [validationIssues, setValidationIssues] = useState<string[]>([]);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Colors
    const textColor = useColorModeValue("gray.700", "gray.200");
    const mutedTextColor = useColorModeValue("gray.600", "gray.400");
    const greenColor = useColorModeValue("green.500", "green.400");
    const redColor = useColorModeValue("red.500", "red.400");
    const suggestionBg = useColorModeValue("gray.50", "gray.700");
    const borderColor = useColorModeValue("gray.200", "gray.600");

    // Clear timeout on unmount
    useEffect(() => {
      return () => {
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }
      };
    }, []);

    // Validate username format
    const validateFormat = (username: string): boolean => {
      // Allow letters, numbers, underscore, hyphen
      return /^[a-zA-Z0-9_-]+$/.test(username);
    };

    // Check for blacklisted words
    const containsBlacklistedWord = (username: string): boolean => {
      const lowercaseUsername = username.toLowerCase();
      return [...blacklist, ...COMMON_USERNAMES].some((word) =>
        lowercaseUsername.includes(word.toLowerCase())
      );
    };

    // Calculate username strength
    const calculateStrength = (username: string): number => {
      if (!username || username.length < minLength) return 0;

      let score = 0;

      // Length
      if (username.length >= 8) score += 1;

      // Character variety
      const hasUppercase = /[A-Z]/.test(username);
      const hasLowercase = /[a-z]/.test(username);
      const hasNumber = /[0-9]/.test(username);
      const hasSpecial = /[_-]/.test(username);

      if (hasUppercase) score += 1;
      if (hasLowercase) score += 1;
      if (hasNumber) score += 1;
      if (hasSpecial) score += 1;

      // Check for common patterns
      if (containsBlacklistedWord(username)) {
        score = Math.max(1, score - 2);
      }

      // Normalize to 0-5 scale
      return Math.min(5, score);
    };

    // Get color based on strength
    const getStrengthColor = (score: number): string => {
      if (score <= 1) return "red";
      if (score <= 3) return "yellow";
      return "green";
    };

    // Generate username suggestions
    const generateSuggestions = (username: string): string[] => {
      if (!username || username.length < 3) return [];

      const suggestions: string[] = [];
      const base = username.toLowerCase().replace(/[^a-z0-9]/g, "");

      // Add random number
      suggestions.push(`${base}${Math.floor(Math.random() * 1000)}`);

      // Add underscore and random number
      suggestions.push(`${base}_${Math.floor(Math.random() * 100)}`);

      // Add common suffixes
      suggestions.push(`${base}_dev`);
      suggestions.push(`${base}pro`);

      // Ensure all suggestions are unique and not in the blacklist
      return [...new Set(suggestions)]
        .filter(
          (s) => !EXISTING_USERNAMES.includes(s) && !containsBlacklistedWord(s)
        )
        .slice(0, 3);
    };

    // Check username availability with API simulation
    const checkAvailability = useCallback(
      async (username: string) => {
        if (!username || username.length < minLength) {
          setIsAvailable(null);
          return null;
        }

        setIsChecking(true);

        try {
          // Simulate API call with delay
          await new Promise((resolve) => setTimeout(resolve, 800));

          // Check basic format
          if (!validateFormat(username)) {
            setValidationIssues([
              "Username can only contain letters, numbers, underscore, and hyphen",
            ]);
            setIsAvailable(false);
            return false;
          }

          // Check against database
          const isUsernameTaken = EXISTING_USERNAMES.includes(
            username.toLowerCase()
          );

          if (isUsernameTaken) {
            setValidationIssues(["Username is already taken"]);
            setSuggestions(generateSuggestions(username));
            setShowSuggestions(true);
          } else {
            setValidationIssues([]);
            setShowSuggestions(false);
          }

          setIsAvailable(!isUsernameTaken);

          // Check for blacklisted words
          if (containsBlacklistedWord(username)) {
            setValidationIssues((prev) => [
              ...prev,
              "Username contains common or blacklisted words",
            ]);
            if (onStrengthChange) {
              onStrengthChange(1); // Weak
            }
          }

          // Calculate and set strength
          const score = calculateStrength(username);
          setStrength(score);
          if (onStrengthChange) {
            onStrengthChange(score);
          }

          // Callback with result
          if (onAvailabilityCheck) {
            onAvailabilityCheck(!isUsernameTaken);
          }

          return !isUsernameTaken;
        } catch (error) {
          console.error("Error checking username:", error);
          return null;
        } finally {
          setIsChecking(false);
        }
      },
      [minLength, onAvailabilityCheck, onStrengthChange, blacklist]
    );

    // Expose methods to parent via forwardRef
    useImperativeHandle(ref, () => ({
      checkAvailability,
      calculateStrength,
    }));

    // Debounced handler for username changes
    const handleUsernameChange = (value: string) => {
      // Clear previous timer
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }

      // Reset states for empty input
      if (!value || value.length < minLength) {
        setIsAvailable(null);
        setStrength(0);
        setValidationIssues([]);
        setShowSuggestions(false);
        return;
      }

      // Set timer for debounce
      timerRef.current = setTimeout(() => {
        checkAvailability(value);
      }, debounceMs);
    };

    const formContext = useFormContext();
    const {
      field: { value, onChange },
    } = useController({
      name,
      control: formContext.control,
      defaultValue: "",
    });

    // Register input with React Hook Form
    const { onChange: registerOnChange, ...rest } = register(name, {
      minLength: {
        value: minLength,
        message: `Username must be at least ${minLength} characters`,
      },
      maxLength: {
        value: maxLength,
        message: `Username must not exceed ${maxLength} characters`,
      },
      pattern: {
        value: /^[a-zA-Z0-9_-]+$/,
        message:
          "Username can only contain letters, numbers, underscore, and hyphen",
      },
    });

    // Effect to handle initial value if set programmatically
    useEffect(() => {
      if (value && value.length >= minLength) {
        // Calculate strength immediately for the initial value
        const score = calculateStrength(value);
        setStrength(score);

        // Trigger availability check for the initial value
        checkAvailability(value);
      }
    }, []);

    return (
      <FormControl isInvalid={!!error} isRequired={isRequired}>
        <FormLabel htmlFor={id} color={textColor}>
          {label}
        </FormLabel>

        <InputGroup>
          <Input
            id={id}
            placeholder={placeholder}
            value={value}
            onChange={(e) => {
              // Call both React Hook Form onChange handlers
              registerOnChange(e);
              onChange(e);

              // Handle custom availability check
              handleUsernameChange(e.target.value);
            }}
            _focus={{
              borderColor: "brand.500",
              boxShadow: "0 0 0 1px var(--chakra-colors-brand-500)",
            }}
            {...rest}
          />

          <InputRightElement>
            {isChecking ? (
              <Spinner size="sm" color="blue.500" />
            ) : isAvailable === true ? (
              <Icon as={CheckIcon} color={greenColor} />
            ) : isAvailable === false ? (
              <Icon as={CloseIcon} color={redColor} />
            ) : null}
          </InputRightElement>
        </InputGroup>

        {/* Helper text */}
        {helperText && !error && isAvailable !== false && (
          <Text fontSize="xs" color={mutedTextColor} mt={1}>
            {helperText}
          </Text>
        )}

        {/* Form error message */}
        {error && <FormErrorMessage>{error.message}</FormErrorMessage>}

        {/* Strength meter */}
        {showStrengthMeter && strength > 0 && (
          <Box mt={2}>
            <Flex justify="space-between" align="center" mb={1}>
              <Text fontSize="xs" color={mutedTextColor}>
                Username Strength:
              </Text>
              <Text
                fontSize="xs"
                fontWeight="bold"
                color={`${getStrengthColor(strength)}.500`}
              >
                {strength <= 1 ? "Weak" : strength <= 3 ? "Medium" : "Strong"}
              </Text>
            </Flex>
            <Progress
              value={(strength / 5) * 100}
              size="xs"
              colorScheme={getStrengthColor(strength)}
              borderRadius="full"
            />
          </Box>
        )}

        {/* Availability feedback */}
        {isAvailable === true && !error && (
          <Flex align="center" mt={1}>
            <Badge colorScheme="green" variant="subtle" px={2} py={0.5}>
              Available
            </Badge>
          </Flex>
        )}

        {/* Validation issues */}
        {validationIssues.length > 0 && (
          <VStack spacing={1} align="stretch" mt={1}>
            {validationIssues.map((issue, index) => (
              <Text key={index} fontSize="xs" color={redColor}>
                <Icon as={InfoIcon} boxSize={3} mr={1} /> {issue}
              </Text>
            ))}
          </VStack>
        )}

        {/* Username suggestions */}
        <Collapse in={showSuggestions} animateOpacity>
          <Box
            mt={2}
            p={2}
            bg={suggestionBg}
            borderRadius="md"
            borderWidth="1px"
            borderColor={borderColor}
          >
            <Text fontSize="xs" fontWeight="medium" mb={1} color={textColor}>
              Try these alternatives:
            </Text>
            <HStack spacing={2}>
              {suggestions.map((suggestion, index) => (
                <Badge
                  key={index}
                  px={2}
                  py={1}
                  colorScheme="blue"
                  cursor="pointer"
                  onClick={() => {
                    // Create an input event to update the form
                    const event = {
                      target: { value: suggestion, name },
                    } as React.ChangeEvent<HTMLInputElement>;

                    registerOnChange(event);
                    onChange(event);
                    checkAvailability(suggestion);
                  }}
                >
                  {suggestion}
                </Badge>
              ))}
            </HStack>
          </Box>
        </Collapse>
      </FormControl>
    );
  }
);

export default UsernameValidator;
