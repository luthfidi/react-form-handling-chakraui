import React, { useCallback, useRef, useState } from "react";
import {
  Box,
  Flex,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Text,
  useColorModeValue,
  VStack,
  HStack,
  IconButton,
  SimpleGrid,
} from "@chakra-ui/react";
import { AddIcon, DeleteIcon } from "@chakra-ui/icons";
import {
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileAlt,
} from "react-icons/fa";
import { Control, useController } from "react-hook-form";

interface MultiFileUploadProps {
  name: string;
  label: string;
  accept: string;
  maxSize: number;
  maxFiles: number;
  control: Control<any>;
  isRequired?: boolean;
  helperText?: string;
}

const MultiFileUpload: React.FC<MultiFileUploadProps> = ({
  name,
  label,
  accept,
  maxSize,
  maxFiles,
  control,
  isRequired = false,
  helperText,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    field: { value = [], onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
    defaultValue: [],
  });

  const borderColor = useColorModeValue("gray.200", "gray.600");
  const bgColor = useColorModeValue("gray.50", "gray.700");
  const dragBgColor = useColorModeValue("gray.100", "gray.600");
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.500", "gray.400");

  const getFileTypeIcon = (fileType: string) => {
    if (fileType.includes("image")) return FaFileImage;
    if (fileType.includes("pdf")) return FaFilePdf;
    if (fileType.includes("word")) return FaFileWord;
    if (fileType.includes("excel") || fileType.includes("sheet"))
      return FaFileExcel;
    if (fileType.includes("text")) return FaFileAlt;
    return FaFile;
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);

      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        const files = Array.from(e.dataTransfer.files);
        handleFiles(files);
      }
    },
    [value]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();

      if (e.target.files && e.target.files.length > 0) {
        const files = Array.from(e.target.files);
        handleFiles(files);
      }
    },
    [value]
  );

  const handleFiles = (files: File[]) => {
    // Check if adding these files would exceed the maximum
    if (value.length + files.length > maxFiles) {
      console.error(`Cannot add more than ${maxFiles} files`);
      return;
    }

    // Filter valid files
    const validFiles = files.filter((file) => {
      // Check file type
      const isValidType = accept
        .split(",")
        .some(
          (type) =>
            file.type === type.trim() ||
            (type.trim().startsWith(".") && file.name.endsWith(type.trim()))
        );

      // Check file size
      const isValidSize = file.size <= maxSize;

      return isValidType && isValidSize;
    });

    // Add valid files to the current value
    onChange([...value, ...validFiles]);
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = (index: number) => {
    const newFiles = [...value];
    newFiles.splice(index, 1);
    onChange(newFiles);
  };

  const getReadableFileSizeString = (bytes: number) => {
    const units = ["B", "KB", "MB", "GB"];
    let i = 0;
    while (bytes >= 1024 && i < units.length - 1) {
      bytes /= 1024;
      i++;
    }
    return `${bytes.toFixed(2)} ${units[i]}`;
  };

  return (
    <FormControl isInvalid={!!error} isRequired={isRequired}>
      <Flex justify="space-between" align="center" mb={2}>
        <FormLabel color={textColor} mb={0}>
          {label}
        </FormLabel>
        <Text fontSize="sm" color={mutedTextColor}>
          {value.length} / {maxFiles} files
        </Text>
      </Flex>

      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        multiple
        display="none"
      />

      {value.length > 0 && (
        <SimpleGrid columns={{ base: 1, md: 2 }} spacing={4} mb={4}>
          {value.map((file: File, index: number) => (
            <Box
              key={`${file.name}-${index}`}
              borderWidth="1px"
              borderRadius="md"
              p={3}
              bg={bgColor}
            >
              <Flex align="center" justify="space-between">
                <HStack spacing={3}>
                  <Icon
                    as={getFileTypeIcon(file.type)}
                    boxSize={5}
                    color="brand.500"
                  />
                  <Box>
                    <Text
                      fontWeight="medium"
                      color={textColor}
                      fontSize="sm"
                      noOfLines={1}
                    >
                      {file.name}
                    </Text>
                    <Text fontSize="xs" color={mutedTextColor}>
                      {getReadableFileSizeString(file.size)}
                    </Text>
                  </Box>
                </HStack>
                <IconButton
                  aria-label="Remove file"
                  icon={<DeleteIcon />}
                  variant="ghost"
                  colorScheme="red"
                  size="xs"
                  onClick={() => removeFile(index)}
                />
              </Flex>
            </Box>
          ))}
        </SimpleGrid>
      )}

      {value.length < maxFiles && (
        <Box
          border="2px dashed"
          borderColor={dragActive ? "brand.500" : borderColor}
          borderRadius="md"
          py={6}
          px={4}
          bg={dragActive ? dragBgColor : bgColor}
          transition="all 0.2s"
          textAlign="center"
          cursor="pointer"
          onClick={onButtonClick}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <VStack spacing={1}>
            <Icon as={AddIcon} boxSize={6} color={mutedTextColor} />
            <Text color={textColor} fontWeight="medium">
              {value.length === 0
                ? "Drag and drop files here, or click to browse"
                : "Add more files"}
            </Text>
            <Text fontSize="sm" color={mutedTextColor}>
              {helperText ||
                `Accepted file types: ${accept}. Maximum size: ${getReadableFileSizeString(
                  maxSize
                )} per file`}
            </Text>
          </VStack>
        </Box>
      )}

      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export default MultiFileUpload;
