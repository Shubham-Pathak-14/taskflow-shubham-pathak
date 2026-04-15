import { HStack, Box, Text } from "@chakra-ui/react";

const TaskFlowLogo = () => {
  return (
    <>
      <HStack gap="12px" position="relative" zIndex={1}>
        <Box
          w="48px"
          h="48px"
          borderRadius="12px"
          bgGradient="to-br"
          gradientFrom="#3b82f6"
          gradientTo="#60a5fa"
          display="flex"
          alignItems="center"
          justifyContent="center"
          boxShadow="0 8px 24px rgba(59,130,246,0.35)"
          flexShrink={0}
        >
          <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
            <rect
              x="3"
              y="3"
              width="9"
              height="9"
              rx="2.5"
              fill="white"
              fillOpacity="0.9"
            />
            <rect
              x="14"
              y="3"
              width="9"
              height="9"
              rx="2.5"
              fill="white"
              fillOpacity="0.45"
            />
            <rect
              x="3"
              y="14"
              width="9"
              height="9"
              rx="2.5"
              fill="white"
              fillOpacity="0.45"
            />
            <rect
              x="14"
              y="14"
              width="9"
              height="9"
              rx="2.5"
              fill="white"
              fillOpacity="0.2"
            />
          </svg>
        </Box>
        <Text
          color="logo_color"
          fontWeight="700"
          fontSize="1.35rem"
          letterSpacing="-0.01em"
        >
          TaskFlow
        </Text>
      </HStack>
    </>
  );
};

export default TaskFlowLogo;
