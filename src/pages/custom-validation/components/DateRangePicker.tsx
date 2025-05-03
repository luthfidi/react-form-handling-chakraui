import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Input,
  Button,
  Text,
  VStack,
  useColorModeValue,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverHeader,
  PopoverBody,
  PopoverFooter,
  PopoverArrow,
  IconButton,
  Flex,
  SimpleGrid,
  Badge,
} from "@chakra-ui/react";
import { ChevronDownIcon, CalendarIcon } from "@chakra-ui/icons";
import {
  UseFormRegister,
  Control,
  useController,
  FieldError,
} from "react-hook-form";

interface DateRange {
  startDate: string;
  endDate: string;
}

interface DateRangePickerProps {
  startDateName: string;
  endDateName: string;
  label: string;
  control: Control<any>;
  register: UseFormRegister<any>;
  startDateError?: FieldError;
  endDateError?: FieldError;
  rangeError?: string;
  minDays?: number;
  maxDays?: number;
  isRequired?: boolean;
  excludeWeekends?: boolean;
  excludeDates?: string[];
  onChange?: (range: DateRange) => void;
}

const presetRanges = [
  { label: "Today", days: 0 },
  { label: "Last 7 days", days: 7 },
  { label: "Last 30 days", days: 30 },
  { label: "This month", type: "month" },
  { label: "Last month", type: "lastMonth" },
  { label: "This year", type: "year" },
  { label: "Custom", type: "custom" },
];

const DateRangePicker: React.FC<DateRangePickerProps> = ({
  startDateName,
  endDateName,
  label,
  control,
  register,
  startDateError,
  endDateError,
  rangeError,
  minDays = 0,
  maxDays,
  isRequired = false,
  excludeWeekends = false,
  excludeDates = [],
  onChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPreset, setSelectedPreset] = useState<string | null>(null);
  const [rangeValidationMessage, setRangeValidationMessage] = useState<string | null>(null);

  // Colors
  const textColor = useColorModeValue("gray.700", "gray.200");
  const errorColor = useColorModeValue("red.500", "red.400");
  const popoverBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  // Use React Hook Form controllers
  const { field: startDateField } = useController({
    name: startDateName,
    control,
  });

  const { field: endDateField } = useController({
    name: endDateName,
    control,
  });

  // Format date to string (YYYY-MM-DD)
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Format date to locale string
  const formatForDisplay = (dateStr: string): string => {
    if (!dateStr) return "";
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch (e) {
      return dateStr;
    }
  };

  // Calculate days between two dates
  const daysBetween = (startDate: string, endDate: string): number => {
    if (!startDate || !endDate) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  // Check if a date is a weekend
  const isWeekend = (dateStr: string): boolean => {
    const date = new Date(dateStr);
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  };

  // Check if a date is excluded
  const isExcluded = (dateStr: string): boolean => {
    return (
      excludeDates.includes(dateStr) || (excludeWeekends && isWeekend(dateStr))
    );
  };

  // Validate the date range
  const validateRange = (startDate: string, endDate: string): boolean => {
    if (!startDate || !endDate) return true;

    // End date must be after start date
    if (new Date(endDate) <= new Date(startDate)) {
      setRangeValidationMessage("End date must be after start date");
      return false;
    }

    // Check min/max days
    const days = daysBetween(startDate, endDate);
    if (minDays && days < minDays) {
      setRangeValidationMessage(`Range must be at least ${minDays} days`);
      return false;
    }

    if (maxDays && days > maxDays) {
      setRangeValidationMessage(`Range cannot exceed ${maxDays} days`);
      return false;
    }

    // Exclude specific dates within range
    if (excludeWeekends || excludeDates.length > 0) {
      let current = new Date(startDate);
      const end = new Date(endDate);

      while (current <= end) {
        const dateStr = formatDate(current);

        if (isExcluded(dateStr)) {
          setRangeValidationMessage(`Range contains excluded dates`);
          return false;
        }

        current.setDate(current.getDate() + 1);
      }
    }

    setRangeValidationMessage(null);
    return true;
  };

  // Apply a preset range
  const applyPreset = (preset: (typeof presetRanges)[0]) => {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    if (preset.type === "month") {
      // This month
      startDate = new Date(today.getFullYear(), today.getMonth(), 1);
      endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
    } else if (preset.type === "lastMonth") {
      // Last month
      startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      endDate = new Date(today.getFullYear(), today.getMonth(), 0);
    } else if (preset.type === "year") {
      // This year
      startDate = new Date(today.getFullYear(), 0, 1);
      endDate = new Date(today.getFullYear(), 11, 31);
    } else if (preset.type === "custom") {
      // Don't change dates, just open the popover
      setIsOpen(true);
      setSelectedPreset("Custom");
      return;
    } else {
      // X days ago until today
      startDate = new Date();
      startDate.setDate(today.getDate() - (preset.days || 0));
      endDate = today;
    }

    updateDates(formatDate(startDate), formatDate(endDate));
    setSelectedPreset(preset.label);
    setIsOpen(false);
  };

  // Handle date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    startDateField.onChange(newStartDate);
    validateRange(newStartDate, endDateField.value);
    setSelectedPreset("Custom");

    if (onChange) {
      onChange({
        startDate: newStartDate,
        endDate: endDateField.value,
      });
    }
  };

  const handleEndDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEndDate = e.target.value;
    endDateField.onChange(newEndDate);
    validateRange(startDateField.value, newEndDate);
    setSelectedPreset("Custom");

    if (onChange) {
      onChange({
        startDate: startDateField.value,
        endDate: newEndDate,
      });
    }
  };

  // Update both dates at once
  const updateDates = (start: string, end: string) => {
    startDateField.onChange(start);
    endDateField.onChange(end);
    validateRange(start, end);

    if (onChange) {
      onChange({ startDate: start, endDate: end });
    }
  };

  // Calculate popover close date
  const getMinEndDate = (): string => {
    if (!startDateField.value) return "";

    const startDate = new Date(startDateField.value);
    if (minDays) {
      startDate.setDate(startDate.getDate() + minDays);
    } else {
      startDate.setDate(startDate.getDate() + 1);
    }
    return formatDate(startDate);
  };

  const getMaxEndDate = (): string => {
    if (!startDateField.value || !maxDays) return "";

    const startDate = new Date(startDateField.value);
    startDate.setDate(startDate.getDate() + maxDays);
    return formatDate(startDate);
  };

  // Format date range for display
  const getDisplayRange = (): string => {
    if (!startDateField.value && !endDateField.value)
      return "Select a date range";

    if (startDateField.value && !endDateField.value)
      return `From ${formatForDisplay(startDateField.value)}`;

    if (!startDateField.value && endDateField.value)
      return `Until ${formatForDisplay(endDateField.value)}`;

    const days = daysBetween(startDateField.value, endDateField.value);

    return `${formatForDisplay(startDateField.value)} - ${formatForDisplay(
      endDateField.value
    )} (${days} days)`;
  };

  // Set initial selected preset on mount if dates match a preset
  useEffect(() => {
    if (startDateField.value && endDateField.value) {
      const days = daysBetween(startDateField.value, endDateField.value);

      // Check if matches any preset
      const preset = presetRanges.find(
        (p) => p.days !== undefined && p.days === days
      );

      if (preset) {
        setSelectedPreset(preset.label);
      } else {
        setSelectedPreset("Custom");
      }
    }
  }, []);

  return (
    <FormControl
      isInvalid={
        !!startDateError ||
        !!endDateError ||
        !!rangeError ||
        !!rangeValidationMessage
      }
      isRequired={isRequired}
    >
      <FormLabel color={textColor}>{label}</FormLabel>

      <VStack spacing={3} align="stretch">
        <HStack>
          {/* Preset selector */}
          <Popover placement="bottom-start">
            <PopoverTrigger>
              <Button
                rightIcon={<ChevronDownIcon />}
                variant="outline"
                size="sm"
                width="150px"
              >
                {selectedPreset || "Presets"}
              </Button>
            </PopoverTrigger>
            <PopoverContent p={0} width="200px" bg={popoverBg}>
              <PopoverArrow />
              <PopoverHeader borderBottomWidth="1px" fontWeight="medium">
                Select a range
              </PopoverHeader>
              <PopoverBody p={0}>
                <VStack spacing={0} align="stretch">
                  {presetRanges.map((preset, idx) => (
                    <Button
                      key={idx}
                      variant={
                        selectedPreset === preset.label ? "solid" : "ghost"
                      }
                      colorScheme={
                        selectedPreset === preset.label ? "brand" : "gray"
                      }
                      justifyContent="flex-start"
                      size="sm"
                      onClick={() => applyPreset(preset)}
                      width="100%"
                      borderRadius={0}
                    >
                      {preset.label}
                    </Button>
                  ))}
                </VStack>
              </PopoverBody>
            </PopoverContent>
          </Popover>

          {/* Calendar button - opens popover */}
          <Popover
            isOpen={isOpen}
            onClose={() => setIsOpen(false)}
            placement="bottom"
            closeOnBlur={true}
          >
            <PopoverTrigger>
              <IconButton
                icon={<CalendarIcon />}
                aria-label="Select dates"
                onClick={() => setIsOpen(!isOpen)}
                variant="outline"
                size="sm"
              />
            </PopoverTrigger>
            <PopoverContent p={0} width="auto" minWidth="300px" bg={popoverBg}>
              <PopoverArrow />
              <PopoverHeader borderBottomWidth="0px" fontWeight="medium">
                Select a date range
              </PopoverHeader>
              <PopoverBody pt={0}>
                <VStack spacing={4} align="stretch">
                  {/* Date inputs inside popover */}
                  <SimpleGrid columns={2} spacing={2}>
                    <Box>
                      <Text fontSize="xs" fontWeight="medium" mb={1}>
                        Start Date
                      </Text>
                      <Input
                        type="date"
                        size="sm"
                        value={startDateField.value || ""}
                        onChange={handleStartDateChange}
                        max={endDateField.value || undefined}
                      />
                    </Box>
                    <Box>
                      <Text fontSize="xs" fontWeight="medium" mb={1}>
                        End Date
                      </Text>
                      <Input
                        type="date"
                        size="sm"
                        value={endDateField.value || ""}
                        onChange={handleEndDateChange}
                        min={getMinEndDate()}
                        max={getMaxEndDate() || undefined}
                      />
                    </Box>
                  </SimpleGrid>

                  {/* Quick select buttons */}
                  <Box>
                    <Text fontSize="xs" fontWeight="medium" mb={1}>
                      Quick Select
                    </Text>
                    <Flex flexWrap="wrap" gap={1}>
                      {presetRanges.slice(0, 4).map((preset, index) => (
                        <Button
                          key={index}
                          size="xs"
                          onClick={() => applyPreset(preset)}
                          colorScheme="brand"
                          variant="outline"
                        >
                          {preset.label}
                        </Button>
                      ))}
                    </Flex>
                  </Box>
                </VStack>
              </PopoverBody>
              <PopoverFooter
                borderTopWidth="1px"
                justifyContent="flex-end"
                display="flex"
                py={2}
              >
                <Button
                  size="sm"
                  onClick={() => setIsOpen(false)}
                  colorScheme="brand"
                >
                  Done
                </Button>
              </PopoverFooter>
            </PopoverContent>
          </Popover>

          {/* Selected range display */}
          <Box
            flex={1}
            borderWidth="1px"
            borderColor={borderColor}
            borderRadius="md"
            p={2}
          >
            <Text color={textColor} fontSize="sm">
              {getDisplayRange()}
            </Text>
          </Box>
        </HStack>

        {/* Hidden inputs for form submission */}
        <HStack spacing={2}>
          <FormControl isInvalid={!!startDateError}>
            <FormLabel
              htmlFor={startDateName}
              fontSize="xs"
              fontWeight="normal"
              mb={1}
              color={textColor}
            >
              Start Date
            </FormLabel>
            <Input
              id={startDateName}
              type="date"
              size="sm"
              {...register(startDateName)}
              value={startDateField.value || ""}
              onChange={handleStartDateChange}
              max={endDateField.value || undefined}
            />
            {startDateError && (
              <FormErrorMessage fontSize="xs">
                {startDateError.message}
              </FormErrorMessage>
            )}
          </FormControl>

          <FormControl isInvalid={!!endDateError}>
            <FormLabel
              htmlFor={endDateName}
              fontSize="xs"
              fontWeight="normal"
              mb={1}
              color={textColor}
            >
              End Date
            </FormLabel>
            <Input
              id={endDateName}
              type="date"
              size="sm"
              {...register(endDateName)}
              value={endDateField.value || ""}
              onChange={handleEndDateChange}
              min={startDateField.value || undefined}
            />
            {endDateError && (
              <FormErrorMessage fontSize="xs">
                {endDateError.message}
              </FormErrorMessage>
            )}
          </FormControl>
        </HStack>

        {/* Range validation error message */}
        {(rangeValidationMessage || rangeError) && (
          <Text color={errorColor} fontSize="xs">
            {rangeError || rangeValidationMessage}
          </Text>
        )}

        {/* Constraints information */}
        <Flex gap={2} wrap="wrap">
          {minDays > 0 && (
            <Badge colorScheme="blue" variant="subtle">
              Min: {minDays} days
            </Badge>
          )}
          {maxDays && (
            <Badge colorScheme="blue" variant="subtle">
              Max: {maxDays} days
            </Badge>
          )}
          {excludeWeekends && (
            <Badge colorScheme="red" variant="subtle">
              Weekends excluded
            </Badge>
          )}
          {excludeDates.length > 0 && (
            <Badge colorScheme="red" variant="subtle">
              {excludeDates.length} date(s) excluded
            </Badge>
          )}
        </Flex>
      </VStack>
    </FormControl>
  );
};

export default DateRangePicker;
