import { Outlet, useNavigate } from "react-router-dom";
import { Box, Button, Flex, Text, Spacer } from "@chakra-ui/react";
import { useAuth } from "../../contexts/AuthContext";
import { ColorModeButton } from "../ui/color-mode";
import TaskFlowLogo from "../Logo";

export function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <Box minH="100vh">
      <Flex
        as="nav"
        bg="navbar_bg"
        px={6}
        py={4}
        shadow="sm"
        align="center"
        position="sticky"
        top={0}
        zIndex={10}
      >
        <TaskFlowLogo />

        {/* <Heading
          size="md"
          as={Link}
          to="/projects"
          color="blue.600"
          _hover={{ textDecoration: "none", color: "blue.700" }}
        >
          TaskFlow
        </Heading> */}

        <Spacer />

        <Flex align="center" gap={4}>
          <ColorModeButton />

          <Text
            fontSize="sm"
            color="gray.700"
            _dark={{
              color: "gray.400",
            }}
          >
            {user?.name}
          </Text>
          <Button
            size="sm"
            variant="solid"
            onClick={handleLogout}
            colorPalette="red"
          >
            Logout
          </Button>
        </Flex>
      </Flex>

      {/* All protected pages render here */}
      <Box maxW="1100px" mx="auto" px={6} py={8}>
        <Outlet />
      </Box>
    </Box>
  );
}
