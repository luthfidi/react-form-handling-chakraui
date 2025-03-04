import {
  Box,
  Flex,
  Text,
  Circle,
  useColorModeValue,
  VStack,
} from "@chakra-ui/react";
import { CheckIcon } from "@chakra-ui/icons";

interface StepProgressProps {
  activeStep: number;
  steps: Array<{
    title: string;
    description: string;
  }>;
  isCompleted?: boolean;
}

const StepProgress = ({
  activeStep,
  steps,
  isCompleted = false,
}: StepProgressProps) => {
  const activeBg = useColorModeValue("brand.500", "brand.400");
  const completedBg = useColorModeValue("green.500", "green.400");
  const inactiveBg = useColorModeValue("gray.200", "gray.700");
  const activeText = useColorModeValue("white", "white");
  const inactiveText = useColorModeValue("gray.700", "gray.200");
  const lineColor = useColorModeValue("gray.200", "gray.700");
  const activeLineColor = useColorModeValue("green.500", "green.400");

  return (
    <Flex width="100%" justifyContent="space-between" position="relative">
      {/* Connector Lines */}
      {steps.length > 1 && (
        <Box
          position="absolute"
          top="25px"
          left="calc(10% + 25px)"
          width="calc(80% - 50px)"
          height="2px"
          bg={lineColor}
          zIndex={0}
        />
      )}

      {/* Active/Completed Connector Lines */}
      {activeStep > 0 && (
        <Box
          position="absolute"
          top="25px"
          left="calc(10% + 25px)"
          width={`calc(${(activeStep / (steps.length - 1)) * 80}% - 50px)`}
          height="2px"
          bg={activeLineColor}
          zIndex={1}
          transition="width 0.3s ease-in-out"
        />
      )}

      {steps.map((step, index) => {
        const isActive = activeStep === index;
        const isCompleted2 = isCompleted || activeStep > index;

        return (
          <VStack
            key={index}
            spacing={2}
            width={`${100 / steps.length}%`}
            position="relative"
            zIndex={2}
            align="center"
          >
            <Circle
              size="50px"
              bg={isCompleted2 ? completedBg : isActive ? activeBg : inactiveBg}
              color={isActive || isCompleted2 ? activeText : inactiveText}
              fontWeight="bold"
            >
              {isCompleted2 ? <CheckIcon boxSize={5} /> : index + 1}
            </Circle>

            <Text
              fontWeight={isActive ? "bold" : "medium"}
              fontSize="sm"
              color={isActive ? "brand.500" : inactiveText}
              textAlign="center"
            >
              {step.title}
            </Text>

            <Text
              fontSize="xs"
              color={useColorModeValue("gray.500", "gray.400")}
              textAlign="center"
              display={{ base: "none", md: "block" }}
            >
              {step.description}
            </Text>
          </VStack>
        );
      })}
    </Flex>
  );
};

export default StepProgress;
