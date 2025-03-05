import React from "react";
import {
  Box,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  VStack,
  Text,
  useColorModeValue,
  useClipboard,
  Flex,
} from "@chakra-ui/react";
import { CheckIcon, CopyIcon } from "@chakra-ui/icons";
import CodeBlock from "../../../components/ui/CodeBlock";
import { FormConfig } from "../../../schemas/dynamicFieldsSchema";

interface GenerateCodeProps {
  formConfig: FormConfig;
}

const GenerateCode: React.FC<GenerateCodeProps> = ({ formConfig }) => {
  const textColor = useColorModeValue("gray.700", "gray.200");
  const mutedTextColor = useColorModeValue("gray.600", "gray.400");

  // Generate the React code
  const reactCode = generateReactCode(formConfig);
  const { hasCopied: hasCopiedReact, onCopy: onCopyReact } =
    useClipboard(reactCode);

  // Generate the JSON config
  const jsonConfig = JSON.stringify(formConfig, null, 2);
  const { hasCopied: hasCopiedJson, onCopy: onCopyJson } =
    useClipboard(jsonConfig);

  // Generate the HTML code
  const htmlCode = generateHtmlCode(formConfig);
  const { hasCopied: hasCopiedHtml, onCopy: onCopyHtml } =
    useClipboard(htmlCode);

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <Text color={textColor} fontSize="lg" fontWeight="medium">
          Generated Code
        </Text>
        <Text color={mutedTextColor}>
          Use this code to implement your dynamically generated form in your
          application.
        </Text>

        <Tabs variant="enclosed" colorScheme="brand">
          <TabList>
            <Tab fontWeight="medium">React</Tab>
            <Tab fontWeight="medium">HTML</Tab>
            <Tab fontWeight="medium">JSON Config</Tab>
          </TabList>

          <TabPanels>
            <TabPanel p={0} pt={4}>
              <Box position="relative">
                <Flex justify="flex-end" mb={2}>
                  <Button
                    size="sm"
                    leftIcon={hasCopiedReact ? <CheckIcon /> : <CopyIcon />}
                    onClick={onCopyReact}
                    colorScheme={hasCopiedReact ? "green" : "gray"}
                  >
                    {hasCopiedReact ? "Copied!" : "Copy Code"}
                  </Button>
                </Flex>
                <CodeBlock
                  code={reactCode}
                  language="typescript"
                  showLineNumbers={true}
                />
              </Box>
            </TabPanel>

            <TabPanel p={0} pt={4}>
              <Box position="relative">
                <Flex justify="flex-end" mb={2}>
                  <Button
                    size="sm"
                    leftIcon={hasCopiedHtml ? <CheckIcon /> : <CopyIcon />}
                    onClick={onCopyHtml}
                    colorScheme={hasCopiedHtml ? "green" : "gray"}
                  >
                    {hasCopiedHtml ? "Copied!" : "Copy Code"}
                  </Button>
                </Flex>
                <CodeBlock
                  code={htmlCode}
                  language="html"
                  showLineNumbers={true}
                />
              </Box>
            </TabPanel>

            <TabPanel p={0} pt={4}>
              <Box position="relative">
                <Flex justify="flex-end" mb={2}>
                  <Button
                    size="sm"
                    leftIcon={hasCopiedJson ? <CheckIcon /> : <CopyIcon />}
                    onClick={onCopyJson}
                    colorScheme={hasCopiedJson ? "green" : "gray"}
                  >
                    {hasCopiedJson ? "Copied!" : "Copy JSON"}
                  </Button>
                </Flex>
                <CodeBlock
                  code={jsonConfig}
                  language="json"
                  showLineNumbers={true}
                />
              </Box>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

// Generate React component code
function generateReactCode(formConfig: FormConfig): string {
  return `import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

// Form configuration
const formConfig = ${JSON.stringify(formConfig, null, 2)};

// Generate validation schema based on config
const schema = z.object({
${formConfig.fields
  .map((field) => {
    let validation = `  ${field.name}: z.string()`;

    if (field.type === "checkbox") {
      validation = `  ${field.name}: z.boolean()`;
    } else if (field.type === "number") {
      validation = `  ${field.name}: z.number()`;
    }

    // Add validation rules
    if (field.validationRules && field.validationRules.length > 0) {
      field.validationRules.forEach((rule) => {
        switch (rule.type) {
          case "required":
            if (field.type === "checkbox") {
              validation += `.refine(val => val === true, { message: "${
                rule.message || "This field is required"
              }" })`;
            } else {
              validation += `.min(1, { message: "${
                rule.message || "This field is required"
              }" })`;
            }
            break;
          case "min":
            if (typeof rule.value === "number") {
              validation += `.min(${rule.value}, { message: "${
                rule.message || `Minimum ${rule.value} characters required`
              }" })`;
            }
            break;
          case "max":
            if (typeof rule.value === "number") {
              validation += `.max(${rule.value}, { message: "${
                rule.message || `Maximum ${rule.value} characters allowed`
              }" })`;
            }
            break;
          case "email":
            validation += `.email({ message: "${
              rule.message || "Invalid email address"
            }" })`;
            break;
          case "url":
            validation += `.url({ message: "${
              rule.message || "Invalid URL"
            }" })`;
            break;
          case "pattern":
            if (typeof rule.value === "string") {
              validation += `.regex(new RegExp("${rule.value}"), { message: "${
                rule.message || "Invalid format"
              }" })`;
            }
            break;
        }
      });
    }

    // Make optional if not required
    const isRequired = field.validationRules?.some(
      (rule) => rule.type === "required"
    );
    if (!isRequired) {
      validation += ".optional()";
    }

    return validation;
  })
  .join(",\n")}
});

// Define form types
type FormData = z.infer<typeof schema>;

const DynamicForm = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState<FormData | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
${formConfig.fields
  .map((field) => {
    let defaultValue =
      field.defaultValue !== undefined
        ? JSON.stringify(field.defaultValue)
        : field.type === "checkbox"
        ? "false"
        : '""';
    return `      ${field.name}: ${defaultValue}`;
  })
  .join(",\n")}
    }
  });
  
  const onSubmit = (data: FormData) => {
    console.log('Form submitted:', data);
    setFormData(data);
    setIsSubmitted(true);
    reset();
    // Send data to server or perform other actions
  };
  
  return (
    <div className="dynamic-form-container">
      {isSubmitted && (
        <div className="success-message">
          <h3>Form Submitted Successfully!</h3>
          <p>Thank you for your submission.</p>
          <pre>{JSON.stringify(formData, null, 2)}</pre>
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)}>
        <h2>${formConfig.title}</h2>
        {formConfig.description && <p>${formConfig.description}</p>}
        
${formConfig.fields
  .map((field) => {
    let fieldHtml = "";

    switch (field.type) {
      case "checkbox":
        fieldHtml = `        <div className="form-field checkbox-field">
          <label>
            <input
              type="checkbox"
              {...register("${field.name}")}
            />
            ${field.label}
          </label>
          {errors.${field.name} && <p className="error-message">{errors.${field.name}?.message}</p>}
        </div>`;
        break;

      case "textarea":
        fieldHtml = `        <div className="form-field">
          <label htmlFor="${field.id}">${field.label}</label>
          <textarea
            id="${field.id}"
            placeholder="${field.placeholder || ""}"
            {...register("${field.name}")}
          />
          {errors.${field.name} && <p className="error-message">{errors.${
          field.name
        }?.message}</p>}
        </div>`;
        break;

      case "select":
        fieldHtml = `        <div className="form-field">
          <label htmlFor="${field.id}">${field.label}</label>
          <select
            id="${field.id}"
            {...register("${field.name}")}
          >
${
  field.options
    ?.map(
      (opt) => `            <option value="${opt.value}">${opt.label}</option>`
    )
    .join("\n") || ""
}
          </select>
          {errors.${field.name} && <p className="error-message">{errors.${
          field.name
        }?.message}</p>}
        </div>`;
        break;

      default:
        fieldHtml = `        <div className="form-field">
          <label htmlFor="${field.id}">${field.label}</label>
          <input
            id="${field.id}"
            type="${field.type}"
            placeholder="${field.placeholder || ""}"
            {...register("${field.name}"${
          field.type === "number" ? ", { valueAsNumber: true }" : ""
        })}
          />
          {errors.${field.name} && <p className="error-message">{errors.${
          field.name
        }?.message}</p>}
        </div>`;
    }

    return fieldHtml;
  })
  .join("\n\n")}
        
        <button type="submit">${
          formConfig.submitButtonText || "Submit"
        }</button>
      </form>
    </div>
  );
};

export default DynamicForm;`;
}

// Generate HTML code
function generateHtmlCode(formConfig: FormConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${formConfig.title}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #333;
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
    }
    
    h2 {
      margin-bottom: 10px;
    }
    
    .form-description {
      margin-bottom: 20px;
      color: #666;
    }
    
    .form-field {
      margin-bottom: 20px;
    }
    
    label {
      display: block;
      margin-bottom: 5px;
      font-weight: 500;
    }
    
    input[type="text"],
    input[type="email"],
    input[type="tel"],
    input[type="number"],
    input[type="date"],
    select,
    textarea {
      width: 100%;
      padding: 8px 12px;
      border: 1px solid #ddd;
      border-radius: 4px;
      font-size: 16px;
      box-sizing: border-box;
    }
    
    textarea {
      min-height: 100px;
      resize: vertical;
    }
    
    .checkbox-field label {
      display: flex;
      align-items: center;
      font-weight: normal;
    }
    
    input[type="checkbox"] {
      margin-right: 10px;
    }
    
    .error-message {
      color: #e53e3e;
      font-size: 14px;
      margin-top: 5px;
    }
    
    button[type="submit"] {
      background-color: #3182ce;
      color: white;
      border: none;
      padding: 10px 20px;
      font-size: 16px;
      border-radius: 4px;
      cursor: pointer;
    }
    
    button[type="submit"]:hover {
      background-color: #2c5282;
    }
    
    .success-message {
      background-color: #c6f6d5;
      border: 1px solid #9ae6b4;
      border-radius: 4px;
      padding: 15px;
      margin-bottom: 20px;
    }
  </style>
</head>
<body>
  <div id="form-container">
    <h2>${formConfig.title}</h2>
    ${
      formConfig.description
        ? `<p class="form-description">${formConfig.description}</p>`
        : ""
    }
    
    <form id="dynamic-form">
${formConfig.fields
  .map((field) => {
    let fieldHtml = "";

    switch (field.type) {
      case "checkbox":
        fieldHtml = `      <div class="form-field checkbox-field">
        <label>
          <input
            type="checkbox"
            name="${field.name}"
            id="${field.id}"
            ${field.defaultValue === true ? "checked" : ""}
          >
          ${field.label}
        </label>
        <p class="error-message" id="${field.name}-error"></p>
      </div>`;
        break;

      default:
        fieldHtml = `      <div class="form-field">
        <label for="${field.id}">${field.label}</label>
        <input
          id="${field.id}"
          type="${field.type}"
          name="${field.name}"
          placeholder="${field.placeholder || ""}"
          ${field.defaultValue ? `value="${field.defaultValue}"` : ""}
        >
        <p class="error-message" id="${field.name}-error"></p>
      </div>`;
    }

    return fieldHtml;
  })
  .join("\n\n")}
      
      <button type="submit">${formConfig.submitButtonText || "Submit"}</button>
    </form>
    
    <div id="success-message" class="success-message" style="display: none;">
      <h3>Form Submitted Successfully!</h3>
      <p>Thank you for your submission.</p>
      <pre id="form-data"></pre>
    </div>
  </div>
  
  <script>
    document.addEventListener('DOMContentLoaded', function() {
      const form = document.getElementById('dynamic-form');
      const successMessage = document.getElementById('success-message');
      const formDataDisplay = document.getElementById('form-data');
      
      form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset error messages
        const errorElements = document.querySelectorAll('.error-message');
        errorElements.forEach(el => el.textContent = '');
        
        // Perform validation
        let isValid = true;
        const formData = {};
        
${formConfig.fields
  .map((field) => {
    let validationCode = "";

    // Only add validation code if there are validation rules
    if (field.validationRules && field.validationRules.length > 0) {
      let fieldValueCode = "";

      if (field.type === "checkbox") {
        fieldValueCode = `const ${field.name}Value = document.getElementById('${field.id}').checked;`;
      } else {
        fieldValueCode = `const ${field.name}Value = document.getElementById('${field.id}').value;`;
      }

      validationCode = `        // Validate ${field.name}
        ${fieldValueCode}
        formData['${field.name}'] = ${field.name}Value;
        ${field.validationRules
          .map((rule) => {
            let validationCondition = "";

            switch (rule.type) {
              case "required":
                if (field.type === "checkbox") {
                  validationCondition = `if (!${field.name}Value) {
            document.getElementById('${field.name}-error').textContent = "${
                    rule.message || "This field is required"
                  }";
            isValid = false;
          }`;
                } else {
                  validationCondition = `if (!${field.name}Value) {
            document.getElementById('${field.name}-error').textContent = "${
                    rule.message || "This field is required"
                  }";
            isValid = false;
          }`;
                }
                break;
              case "min":
                if (typeof rule.value === "number") {
                  if (field.type === "number") {
                    validationCondition = `if (Number(${field.name}Value) < ${
                      rule.value
                    }) {
            document.getElementById('${field.name}-error').textContent = "${
                      rule.message || `Minimum value is ${rule.value}`
                    }";
            isValid = false;
          }`;
                  } else {
                    validationCondition = `if (${field.name}Value.length < ${
                      rule.value
                    }) {
            document.getElementById('${field.name}-error').textContent = "${
                      rule.message ||
                      `Minimum ${rule.value} characters required`
                    }";
            isValid = false;
          }`;
                  }
                }
                break;
              case "max":
                if (typeof rule.value === "number") {
                  if (field.type === "number") {
                    validationCondition = `if (Number(${field.name}Value) > ${
                      rule.value
                    }) {
            document.getElementById('${field.name}-error').textContent = "${
                      rule.message || `Maximum value is ${rule.value}`
                    }";
            isValid = false;
          }`;
                  } else {
                    validationCondition = `if (${field.name}Value.length > ${
                      rule.value
                    }) {
            document.getElementById('${field.name}-error').textContent = "${
                      rule.message || `Maximum ${rule.value} characters allowed`
                    }";
            isValid = false;
          }`;
                  }
                }
                break;
              case "email":
                validationCondition = `if (${
                  field.name
                }Value && !/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(${
                  field.name
                }Value)) {
            document.getElementById('${field.name}-error').textContent = "${
                  rule.message || "Invalid email address"
                }";
            isValid = false;
          }`;
                break;
              case "pattern":
                if (typeof rule.value === "string") {
                  validationCondition = `if (${
                    field.name
                  }Value && !new RegExp('${rule.value}').test(${
                    field.name
                  }Value)) {
            document.getElementById('${field.name}-error').textContent = "${
                    rule.message || "Invalid format"
                  }";
            isValid = false;
          }`;
                }
                break;
            }

            return validationCondition;
          })
          .join("\n        ")}`;
    } else {
      // Just collect the value without validation
      if (field.type === "checkbox") {
        validationCode = `        // Collect ${field.name} value
        formData['${field.name}'] = document.getElementById('${field.id}').checked;`;
      } else {
        validationCode = `        // Collect ${field.name} value
        formData['${field.name}'] = document.getElementById('${field.id}').value;`;
      }
    }

    return validationCode;
  })
  .join("\n\n")}
        
        // Handle form submission
        if (isValid) {
          console.log('Form submitted:', formData);
          
          // Display success message
          successMessage.style.display = 'block';
          formDataDisplay.textContent = JSON.stringify(formData, null, 2);
          
          // Reset form
          form.reset();
          
          // Optionally submit the form data to a server
          // fetch('/api/submit-form', {
          //   method: 'POST',
          //   headers: {
          //     'Content-Type': 'application/json'
          //   },
          //   body: JSON.stringify(formData)
          // });
        }
      });
    });
  </script>
</body>
</html>`;
}

export default GenerateCode;
