import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  FormErrorMessage,
  HStack,
  Input,
  Button,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
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
  rangeError?: string; // Changed from string | null to string | undefined
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
  const [rangeValidationMessage, setRangeValidationMessage] = useState<
    string | null
  >(null);

  // Colors
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");
  const errorColor = useColorModeValue("red.500", "red.400");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const popoverBg = useColorModeValue("white", "gray.700");
  const hoverBg = useColorModeValue("gray.100", "gray.600");

  // Use React Hook Form controllers
  const { field: startDateField, fieldState: startDateFieldState } =
    useController({
      name: startDateName,
      control,
    });

  const { field: endDateField, fieldState: endDateFieldState } = useController({
    name: endDateName,
    control,
  });

  // Format date to string (YYYY-MM-DD)
  const formatDate = (date: Date): string => {
    return date.toISOString().split("T")[0];
  };

  // Parse string to date
  const parseDate = (dateStr: string): Date => {
    return dateStr ? new Date(dateStr) : new Date();
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
      return;
    } else {
      // X days ago until today
      startDate = new Date();
      startDate.setDate(today.getDate() - (preset.days || 0));
      endDate = today;
    }

    updateDates(formatDate(startDate), formatDate(endDate));
    setIsOpen(false);
  };

  // Handle date changes
  const handleStartDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newStartDate = e.target.value;
    startDateField.onChange(newStartDate);
    validateRange(newStartDate, endDateField.value);

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
    if (!startDateField.value || !endDateField.value)
      return "Select a date range";

    const start = new Date(startDateField.value);
    const end = new Date(endDateField.value);
    const days = daysBetween(startDateField.value, endDateField.value);

    return `${start.toLocaleDateString()} - ${end.toLocaleDateString()} (${days} days)`;
  };

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
          <Menu>
            <MenuButton
              as={Button}
              rightIcon={<ChevronDownIcon />}
              size="sm"
              variant="outline"
              width="150px"
            >
              Presets
            </MenuButton>
            <MenuList>
              {presetRanges.map((preset, index) => (
                <MenuItem key={index} onClick={() => applyPreset(preset)}>
                  {preset.label}
                </MenuItem>
              ))}
            </MenuList>
          </Menu>

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
          <Text color={mutedTextColor} fontSize="sm" flex={1}>
            {getDisplayRange()}
          </Text>
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
        {(minDays > 0 || maxDays) && (
          <Text fontSize="xs" color={mutedTextColor}>
            {minDays > 0 && `Minimum ${minDays} days`}
            {minDays > 0 && maxDays && " | "}
            {maxDays && `Maximum ${maxDays} days`}
          </Text>
        )}

        {/* Exclusion information */}
        {(excludeWeekends || excludeDates.length > 0) && (
          <Text fontSize="xs" color={mutedTextColor}>
            {excludeWeekends && "Weekends excluded"}
            {excludeWeekends && excludeDates.length > 0 && " | "}
            {excludeDates.length > 0 &&
              `${excludeDates.length} specific date(s) excluded`}
          </Text>
        )}
      </VStack>
    </FormControl>
  );
};

export default DateRangePicker;
