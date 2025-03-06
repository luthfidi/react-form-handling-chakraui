import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useRef,
} from "react";
import { ZodSchema, z } from "zod";

interface ValidationCache {
  [key: string]: {
    result: boolean;
    message?: string;
    timestamp: number;
  };
}

interface ValidationResult {
  isValid: boolean;
  message?: string;
}

interface ValidationContextType {
  // Run a validation check
  validate: <T>(
    value: T,
    validatorName: string,
    validator: (value: T) => Promise<ValidationResult> | ValidationResult
  ) => Promise<ValidationResult>;

  // Register a custom validator
  registerValidator: <T>(
    name: string,
    validator: (value: T) => Promise<ValidationResult> | ValidationResult
  ) => void;

  // Check if a validation is in progress
  isValidating: (validatorName: string) => boolean;

  // Reset the cache
  clearCache: (validatorName?: string) => void;

  // Validates a value against a Zod schema
  validateWithZod: <T>(value: T, schema: ZodSchema<T>) => ValidationResult;

  // Cross-field validation
  validateFields: <T extends Record<string, any>>(
    values: T,
    validator: (values: T) => ValidationResult
  ) => ValidationResult;

  // Store validation results
  validationResults: Record<string, ValidationResult>;
}

const ValidationContext = createContext<ValidationContextType | undefined>(
  undefined
);

interface ValidationProviderProps {
  children: ReactNode;
  cacheTimeout?: number; // Cache expiration in ms
  validators?: Record<
    string,
    (value: any) => Promise<ValidationResult> | ValidationResult
  >;
}

export const ValidationContextProvider: React.FC<ValidationProviderProps> = ({
  children,
  cacheTimeout = 5 * 60 * 1000, // 5 minutes default
  validators = {},
}) => {
  // Store validation results
  const [validationResults, setValidationResults] = useState<
    Record<string, ValidationResult>
  >({});

  // Track which validations are in progress
  const [pendingValidations, setPendingValidations] = useState<
    Record<string, boolean>
  >({});

  // Cache validation results for performance
  const validationCache = useRef<ValidationCache>({});

  // Store custom validators
  const [customValidators, setCustomValidators] =
    useState<
      Record<
        string,
        (value: any) => Promise<ValidationResult> | ValidationResult
      >
    >(validators);

  // Register a new validator
  const registerValidator = useCallback(
    <T,>(
      name: string,
      validator: (value: T) => Promise<ValidationResult> | ValidationResult
    ) => {
      setCustomValidators((prev) => ({
        ...prev,
        [name]: validator,
      }));
    },
    []
  );

  // Generate a cache key
  const getCacheKey = (validatorName: string, value: any): string => {
    // For primitive values, use direct string representation
    if (
      typeof value === "string" ||
      typeof value === "number" ||
      typeof value === "boolean" ||
      value === null ||
      value === undefined
    ) {
      return `${validatorName}:${String(value)}`;
    }

    // For objects, arrays, etc., use JSON.stringify
    try {
      return `${validatorName}:${JSON.stringify(value)}`;
    } catch (e) {
      // If circular reference or other JSON issue, fall back to type + validator name
      return `${validatorName}:${typeof value}:${Date.now()}`;
    }
  };

  // Check if a cache entry is still valid
  const isCacheValid = (timestamp: number): boolean => {
    return Date.now() - timestamp < cacheTimeout;
  };

  // Validate a value using a named validator
  const validate = useCallback(
    async <T,>(
      value: T,
      validatorName: string,
      validator: (value: T) => Promise<ValidationResult> | ValidationResult
    ): Promise<ValidationResult> => {
      // Mark validation as pending
      setPendingValidations((prev) => ({ ...prev, [validatorName]: true }));

      try {
        // Check cache first
        const cacheKey = getCacheKey(validatorName, value);
        const cached = validationCache.current[cacheKey];

        if (cached && isCacheValid(cached.timestamp)) {
          const result = { isValid: cached.result, message: cached.message };

          // Update validation results store
          setValidationResults((prev) => ({
            ...prev,
            [validatorName]: result,
          }));

          return result;
        }

        // If no cache hit or expired, run the validator
        const validationResult = await Promise.resolve(validator(value));

        // Store in cache
        validationCache.current[cacheKey] = {
          result: validationResult.isValid,
          message: validationResult.message,
          timestamp: Date.now(),
        };

        // Update validation results store
        setValidationResults((prev) => ({
          ...prev,
          [validatorName]: validationResult,
        }));

        return validationResult;
      } catch (error) {
        const errorResult = {
          isValid: false,
          message: error instanceof Error ? error.message : "Validation error",
        };

        // Update validation results store
        setValidationResults((prev) => ({
          ...prev,
          [validatorName]: errorResult,
        }));

        return errorResult;
      } finally {
        // Mark validation as completed
        setPendingValidations((prev) => {
          const updated = { ...prev };
          delete updated[validatorName];
          return updated;
        });
      }
    },
    [cacheTimeout]
  );

  // Check if a validation is currently in progress
  const isValidating = useCallback(
    (validatorName: string): boolean => {
      return !!pendingValidations[validatorName];
    },
    [pendingValidations]
  );

  // Clear cache for a specific validator or all validators
  const clearCache = useCallback((validatorName?: string) => {
    if (validatorName) {
      // Clear specific validator cache
      Object.keys(validationCache.current).forEach((key) => {
        if (key.startsWith(`${validatorName}:`)) {
          delete validationCache.current[key];
        }
      });

      // Clear from results
      setValidationResults((prev) => {
        const updated = { ...prev };
        delete updated[validatorName];
        return updated;
      });
    } else {
      // Clear all cache
      validationCache.current = {};
      setValidationResults({});
    }
  }, []);

  // Validate with Zod
  const validateWithZod = useCallback(
    <T,>(value: T, schema: ZodSchema<T>): ValidationResult => {
      try {
        schema.parse(value);
        return { isValid: true };
      } catch (error) {
        if (error instanceof z.ZodError) {
          return {
            isValid: false,
            message: error.errors[0]?.message || "Validation failed",
          };
        }
        return {
          isValid: false,
          message: "Unknown validation error",
        };
      }
    },
    []
  );

  // Cross-field validation
  const validateFields = useCallback(
    <T extends Record<string, any>>(
      values: T,
      validator: (values: T) => ValidationResult
    ): ValidationResult => {
      try {
        return validator(values);
      } catch (error) {
        return {
          isValid: false,
          message: error instanceof Error ? error.message : "Validation error",
        };
      }
    },
    []
  );

  const contextValue: ValidationContextType = {
    validate,
    registerValidator,
    isValidating,
    clearCache,
    validateWithZod,
    validateFields,
    validationResults,
  };

  return (
    <ValidationContext.Provider value={contextValue}>
      {children}
    </ValidationContext.Provider>
  );
};

// Hook to use validation context
export const useValidation = (): ValidationContextType => {
  const context = useContext(ValidationContext);

  if (!context) {
    throw new Error(
      "useValidation must be used within a ValidationContextProvider"
    );
  }

  return context;
};

// Pre-defined validators
export const commonValidators = {
  // Email validation with disposable email check
  email: async (email: string): Promise<ValidationResult> => {
    // Basic email format check
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return { isValid: false, message: "Invalid email format" };
    }

    // Check for disposable email domains
    const domain = email.split("@")[1].toLowerCase();
    const disposableDomains = [
      "tempmail.com",
      "throwaway.com",
      "mailinator.com",
    ];

    if (disposableDomains.includes(domain)) {
      return {
        isValid: false,
        message: "Disposable email providers are not allowed",
      };
    }

    return { isValid: true };
  },

  // Strong password validation
  password: (password: string): ValidationResult => {
    const hasUppercase = /[A-Z]/.test(password);
    const hasLowercase = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[^A-Za-z0-9]/.test(password);
    const hasMinLength = password.length >= 8;

    if (!hasMinLength) {
      return {
        isValid: false,
        message: "Password must be at least 8 characters",
      };
    }

    if (!hasUppercase) {
      return {
        isValid: false,
        message: "Password must contain an uppercase letter",
      };
    }

    if (!hasLowercase) {
      return {
        isValid: false,
        message: "Password must contain a lowercase letter",
      };
    }

    if (!hasNumber) {
      return { isValid: false, message: "Password must contain a number" };
    }

    if (!hasSpecial) {
      return {
        isValid: false,
        message: "Password must contain a special character",
      };
    }

    return { isValid: true };
  },

  // Credit card validation
  creditCard: (cardNumber: string): ValidationResult => {
    // Remove all non-digit characters
    const digits = cardNumber.replace(/\D/g, "");

    // Check if all digits and has valid length
    if (!/^\d{13,19}$/.test(digits)) {
      return {
        isValid: false,
        message: "Credit card number must be 13-19 digits",
      };
    }

    // Luhn algorithm
    let sum = 0;
    let double = false;

    // Starting from the right
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);

      if (double) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }

      sum += digit;
      double = !double;
    }

    if (sum % 10 !== 0) {
      return { isValid: false, message: "Invalid credit card number" };
    }

    return { isValid: true };
  },
};

export default ValidationContextProvider;
