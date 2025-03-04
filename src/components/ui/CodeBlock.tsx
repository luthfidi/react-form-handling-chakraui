import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import {
  tomorrow,
  oneLight,
} from "react-syntax-highlighter/dist/esm/styles/prism";

interface CodeBlockProps {
  code: string;
  language?: string;
  showLineNumbers?: boolean;
}

const CodeBlock: React.FC<CodeBlockProps> = ({
  code,
  language = "typescript",
  showLineNumbers = false,
}) => {
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const codeStyle = useColorModeValue(oneLight, tomorrow);

  return (
    <Box
      p={4}
      rounded="md"
      w="full"
      overflowX="auto"
      fontSize="sm"
      borderWidth="1px"
      borderColor={borderColor}
    >
      <SyntaxHighlighter
        language={language}
        style={codeStyle}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: "0.375rem",
          fontSize: "0.875rem",
        }}
      >
        {code}
      </SyntaxHighlighter>
    </Box>
  );
};

export default CodeBlock;
