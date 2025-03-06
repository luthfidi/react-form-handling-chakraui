import React, { useMemo } from "react";
import {
  Box,
  Text,
  Progress,
  VStack,
  HStack,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { CheckIcon, CloseIcon } from "@chakra-ui/icons";

interface PasswordStrengthMeterProps {
  password: string;
  showChecklist?: boolean;
}

interface ValidationResult {
  hasMinLength: boolean;
  hasUppercase: boolean;
  hasLowercase: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
}

// Password strength levels
const strengthLevels = [
  { label: "Weak", color: "red", minScore: 0 },
  { label: "Fair", color: "orange", minScore: 2 },
  { label: "Good", color: "yellow", minScore: 3 },
  { label: "Strong", color: "green", minScore: 4 },
  { label: "Very Strong", color: "green", minScore: 5 },
];

const PasswordStrengthMeter: React.FC<PasswordStrengthMeterProps> = ({
  password,
  showChecklist = true,
}) => {
  const bgColor = useColorModeValue("gray.100", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  // Validate password criteria
  const validation = useMemo((): ValidationResult => {
    return {
      hasMinLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumber: /[0-9]/.test(password),
      hasSpecial: /[^A-Za-z0-9]/.test(password),
    };
  }, [password]);

  // Calculate the strength score (0-5)
  const score = useMemo(() => {
    if (!password) return 0;

    const { hasMinLength, hasUppercase, hasLowercase, hasNumber, hasSpecial } =
      validation;

    let score = 0;
    if (hasMinLength) score++;
    if (hasUppercase) score++;
    if (hasLowercase) score++;
    if (hasNumber) score++;
    if (hasSpecial) score++;

    return score;
  }, [validation, password]);

  // Check the strength level determination
  const strengthLevel = useMemo(() => {
    if (!password) return strengthLevels[0];
    return (
      strengthLevels.find((level) => score >= level.minScore) ||
      strengthLevels[0]
    );
  }, [score, password]);

  // Calculate progress percentage (0-100)
  const progressPercent = useMemo(() => {
    return (score / 5) * 100;
  }, [score]);

  // Criteria list to display in checklist
  const criteriaList = [
    { label: "8+ characters", isValid: validation.hasMinLength },
    { label: "Uppercase letter", isValid: validation.hasUppercase },
    { label: "Lowercase letter", isValid: validation.hasLowercase },
    { label: "Number", isValid: validation.hasNumber },
    { label: "Special character", isValid: validation.hasSpecial },
  ];

  if (!password) {
    return null; // Don't show meter if password is empty
  }

  return (
    <VStack spacing={2} align="stretch" width="100%" mt={1}>
      <HStack justify="space-between" align="center">
        <Text fontSize="xs" color={mutedTextColor} fontWeight="medium">
          Password Strength:
        </Text>
        <Text
          fontSize="xs"
          fontWeight="bold"
          color={`${strengthLevel.color}.500`}
        >
          {strengthLevel.label}
        </Text>
      </HStack>

      <Progress
        value={progressPercent}
        size="sm"
        colorScheme={strengthLevel.color}
        bg={bgColor}
        borderRadius="full"
      />

      {showChecklist && (
        <Box mt={2}>
          <SimpleGrid columns={2} spacing={1}>
            {criteriaList.map((criteria, index) => (
              <HStack key={index} spacing={1} align="center">
                <Icon
                  as={criteria.isValid ? CheckIcon : CloseIcon}
                  color={criteria.isValid ? "green.500" : "gray.400"}
                  boxSize={3}
                />
                <Text
                  fontSize="xs"
                  color={criteria.isValid ? textColor : mutedTextColor}
                >
                  {criteria.label}
                </Text>
              </HStack>
            ))}
          </SimpleGrid>
        </Box>
      )}
    </VStack>
  );
};

// Simple grid component for responsive layout
const SimpleGrid: React.FC<{
  columns: number | { base: number; md: number };
  spacing: number;
  children: React.ReactNode;
}> = ({ columns, spacing, children }) => {
  const numColumns = typeof columns === "number" ? columns : columns.base;

  return (
    <Box
      display="grid"
      gridTemplateColumns={`repeat(${numColumns}, 1fr)`}
      gap={spacing}
    >
      {children}
    </Box>
  );
};

export default PasswordStrengthMeter;