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
  Progress,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { DeleteIcon } from "@chakra-ui/icons";
import {
  FaFile,
  FaFileImage,
  FaFilePdf,
  FaFileWord,
  FaFileExcel,
  FaFileAlt,
} from "react-icons/fa";
import { Control, useController } from "react-hook-form";

interface SingleFileUploadProps {
  name: string;
  label: string;
  accept: string;
  maxSize: number;
  control: Control<any>;
  isRequired?: boolean;
  helperText?: string;
}

const SingleFileUpload: React.FC<SingleFileUploadProps> = ({
  name,
  label,
  accept,
  maxSize,
  control,
  isRequired = false,
  helperText,
}) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const {
    field: { value, onChange },
    fieldState: { error },
  } = useController({
    name,
    control,
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const file = e.dataTransfer.files[0];
      handleFile(file);
    }
  }, []);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      handleFile(file);
    }
  }, []);

  const handleFile = (file: File) => {
    // Check file type
    if (
      !accept
        .split(",")
        .some(
          (type) =>
            file.type === type.trim() ||
            (type.trim().startsWith(".") && file.name.endsWith(type.trim()))
        )
    ) {
      // Invalid file type
      console.error("Invalid file type");
      return;
    }

    // Check file size
    if (file.size > maxSize) {
      // File too large
      console.error("File too large");
      return;
    }

    onChange(file);
  };

  const onButtonClick = () => {
    if (inputRef.current) {
      inputRef.current.click();
    }
  };

  const removeFile = () => {
    onChange(null);
    if (inputRef.current) {
      inputRef.current.value = "";
    }
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
      <FormLabel color={textColor}>{label}</FormLabel>

      <Input
        ref={inputRef}
        type="file"
        accept={accept}
        onChange={handleChange}
        display="none"
      />

      {!value ? (
        <Box
          border="2px dashed"
          borderColor={dragActive ? "brand.500" : borderColor}
          borderRadius="md"
          py={10}
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
          <VStack spacing={2}>
            <Icon as={FaFile} boxSize={8} color={mutedTextColor} />
            <Text color={textColor} fontWeight="medium">
              Drag and drop your file here, or click to browse
            </Text>
            <Text fontSize="sm" color={mutedTextColor}>
              {helperText ||
                `Accepted file types: ${accept}. Maximum size: ${getReadableFileSizeString(
                  maxSize
                )}`}
            </Text>
          </VStack>
        </Box>
      ) : (
        <Box borderWidth="1px" borderRadius="md" p={4} bg={bgColor}>
          <Flex align="center" justify="space-between">
            <HStack spacing={4}>
              <Icon
                as={getFileTypeIcon(value.type)}
                boxSize={6}
                color="brand.500"
              />
              <Box>
                <Text fontWeight="medium" color={textColor} noOfLines={1}>
                  {value.name}
                </Text>
                <Text fontSize="sm" color={mutedTextColor}>
                  {getReadableFileSizeString(value.size)}
                </Text>
              </Box>
            </HStack>
            <IconButton
              aria-label="Remove file"
              icon={<DeleteIcon />}
              variant="ghost"
              colorScheme="red"
              size="sm"
              onClick={removeFile}
            />
          </Flex>
          <Progress
            value={100}
            size="sm"
            colorScheme="brand"
            mt={2}
            borderRadius="full"
          />
        </Box>
      )}

      {error && <FormErrorMessage>{error.message}</FormErrorMessage>}
    </FormControl>
  );
};

export default SingleFileUpload;
