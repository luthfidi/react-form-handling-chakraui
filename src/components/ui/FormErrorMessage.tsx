import { Text } from "@chakra-ui/react";
import { ReactNode } from "react";

interface FormErrorMessageProps {
  children: ReactNode;
}

export default function FormErrorMessage({ children }: FormErrorMessageProps) {
  return (
    <Text color="red.500" fontSize="sm" mt={1}>
      {children}
    </Text>
  );
}
