import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { keyframes } from "@emotion/react";
import {
  Box,
  Button,
  Field,
  Grid,
  Heading,
  HStack,
  Input,
  Text,
  VStack,
  Alert,
  Fieldset,
} from "@chakra-ui/react";
import { useAuth } from "../contexts/AuthContext";
import { authApi } from "../api/auth.api";
import TaskFlowLogo from "../components/Logo";

const pulseDot = keyframes`
  0%, 100% { opacity: 1; transform: scale(1); }
  50%       { opacity: 0.55; transform: scale(0.8); }
`;

const FEATURES = [
  { icon: "◈", label: "Organize projects and tasks in one place" },
  { icon: "◎", label: "Assign tasks and track team progress" },
  { icon: "◇", label: "Stay focused with a clean, minimal interface" },
];

export function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email || !password) {
      setError("Email and password are required");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      console.log("Login called.");
      const data = await authApi.login(email, password);
      login(data.token, data.user);
      navigate("/projects");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid
      minH="100vh"
      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
      fontFamily="'Sora', sans-serif"
    >
      {/* ── LEFT BRANDING PANEL ── */}
      <Box
        display={{ base: "none", md: "flex" }}
        flexDirection="column"
        justifyContent="space-between"
        p="48px"
        position="relative"
        overflow="hidden"
        bgGradient="to-br"
        gradientFrom="#1a2f4e"
        gradientTo="#163352"
      >
        {/* Grid overlay */}
        <Box
          position="absolute"
          inset={0}
          backgroundImage="linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
          backgroundSize="40px 40px"
          pointerEvents="none"
        />

        {/* Orbs */}
        <Box
          position="absolute"
          w="340px"
          h="340px"
          borderRadius="full"
          top="-80px"
          right="-80px"
          background="radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)"
          pointerEvents="none"
        />
        <Box
          position="absolute"
          w="260px"
          h="260px"
          borderRadius="full"
          bottom="60px"
          left="-60px"
          background="radial-gradient(circle, rgba(147,197,253,0.10) 0%, transparent 70%)"
          pointerEvents="none"
        />

        {/* Logo  */}
        <TaskFlowLogo />

        {/* Headline + Features */}
        <Box position="relative" zIndex={1}>
          {/* Live pill badge */}
          <HStack
            display="inline-flex"
            gap="8px"
            bg="rgba(255,255,255,0.07)"
            border="1px solid rgba(255,255,255,0.1)"
            borderRadius="full"
            px="14px"
            py="6px"
            mb="28px"
            backdropFilter="blur(4px)"
          >
            <Box
              w="7px"
              h="7px"
              borderRadius="full"
              bg="#34d399"
              boxShadow="0 0 6px #34d399"
              animation={`${pulseDot} 2.2s ease-in-out infinite`}
            />
            <Text
              color="rgba(191,219,254,0.85)"
              fontSize="0.78rem"
              fontWeight="400"
            >
              Trusted by teams everywhere
            </Text>
          </HStack>

          {/* Serif italic headline */}
          <Text
            as="h1"
            fontFamily="'Lora', Georgia, serif"
            fontStyle="italic"
            fontWeight="400"
            fontSize="2.4rem"
            lineHeight="1.25"
            color="white"
            letterSpacing="-0.02em"
          >
            Work that flows,
            <br />
            teams that{" "}
            <Text as="span" color="#93c5fd" fontStyle="italic">
              thrive.
            </Text>
          </Text>

          <Text
            mt="20px"
            fontSize="0.875rem"
            color="rgba(191,219,254,0.7)"
            lineHeight="1.6"
            fontWeight="300"
            maxW="320px"
          >
            From solo sprints to cross-team projects — TaskFlow keeps everyone
            aligned, unblocked, and moving forward.
          </Text>

          <VStack mt="36px" align="stretch" gap="16px">
            {FEATURES.map((f) => (
              <HStack key={f.label} align="flex-start" gap="12px">
                <Box
                  w="24px"
                  h="24px"
                  borderRadius="6px"
                  bg="rgba(255,255,255,0.08)"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  fontSize="0.7rem"
                  color="rgba(191,219,254,0.75)"
                  flexShrink={0}
                  mt="1px"
                >
                  {f.icon}
                </Box>
                <Text
                  fontSize="0.8rem"
                  color="rgba(191,219,254,0.75)"
                  fontWeight="300"
                  lineHeight="1.5"
                >
                  {f.label}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        {/* Footer */}
        <Text
          position="relative"
          zIndex={1}
          fontSize="0.72rem"
          color="rgba(148,163,184,0.5)"
          fontWeight="300"
        >
          © {new Date().getFullYear()} TaskFlow. Built for builders.
        </Text>
      </Box>

      {/* ── RIGHT FORM PANEL ── */}
      <Box
        bg="#f8fafc"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="32px"
        minH={{ base: "100vh", md: "auto" }}
      >
        <Box
          bg="white"
          borderRadius="20px"
          boxShadow="0 4px 40px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)"
          p={{ base: "32px 24px", sm: "44px 40px" }}
          w="full"
          maxW="400px"
        >
          <VStack gap={5} align="stretch">
            {/* Header */}
            <Box mb="4px">
              <Heading
                fontFamily="'Sora', sans-serif"
                fontWeight="700"
                fontSize="1.6rem"
                color="#0f172a"
                letterSpacing="-0.025em"
                mb="6px"
              >
                Welcome back
              </Heading>
              <Text fontSize="0.83rem" color="#64748b" fontWeight="300">
                Sign in to your TaskFlow workspace
              </Text>
            </Box>

            {/* Divider */}
            <Box
              h="1px"
              bgGradient="to-r"
              gradientFrom="transparent"
              gradientVia="#e2e8f0"
              gradientTo="transparent"
            />

            {/* Error */}
            {error && (
              <Alert.Root status="error" borderRadius="10px" fontSize="0.82rem">
                <Alert.Indicator />
                <Alert.Title fontFamily="'Sora', sans-serif">
                  {error}
                </Alert.Title>
              </Alert.Root>
            )}

            <Fieldset.Root>
              {/* Email */}
              <Field.Root>
                <Field.Label
                  fontSize="0.8rem"
                  fontWeight="500"
                  color="#475569"
                  letterSpacing="0.01em"
                  mb="6px"
                >
                  Email address
                </Field.Label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  fontSize="0.875rem"
                  fontFamily="'Sora', sans-serif"
                  color="#1e293b"
                  borderColor="#e2e8f0"
                  borderWidth="1.5px"
                  borderRadius="10px"
                  px="14px"
                  h="42px"
                  _placeholder={{ color: "#94a3b8" }}
                  _focusVisible={{
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
                  }}
                  _hover={{ borderColor: "#cbd5e1" }}
                />
              </Field.Root>

              {/* Password */}
              <Field.Root>
                <Field.Label
                  fontSize="0.8rem"
                  fontWeight="500"
                  color="#475569"
                  letterSpacing="0.01em"
                  mb="6px"
                >
                  Password
                </Field.Label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                  fontSize="0.875rem"
                  fontFamily="'Sora', sans-serif"
                  color="#1e293b"
                  borderColor="#e2e8f0"
                  borderWidth="1.5px"
                  borderRadius="10px"
                  px="14px"
                  h="42px"
                  _placeholder={{ color: "#94a3b8" }}
                  _focusVisible={{
                    borderColor: "#3b82f6",
                    boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
                  }}
                  _hover={{ borderColor: "#cbd5e1" }}
                />
              </Field.Root>
            </Fieldset.Root>

            {/* Submit button */}
            <Button
              type="submit"
              onClick={handleSubmit}
              loading={loading}
              loadingText="Signing in..."
              w="full"
              h="44px"
              mt="4px"
              borderRadius="10px"
              fontFamily="'Sora', sans-serif"
              fontSize="0.875rem"
              fontWeight="600"
              letterSpacing="0.01em"
              color="white"
              bg="linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)"
              border="none"
              boxShadow="0 4px 16px rgba(37,99,235,0.3)"
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "0 6px 22px rgba(37,99,235,0.38)",
              }}
              _active={{ transform: "translateY(0)" }}
              transition="transform 0.15s, box-shadow 0.15s"
            >
              Sign in to TaskFlow
            </Button>

            {/* Register link */}
            <Text
              textAlign="center"
              color="#94a3b8"
              fontSize="0.8rem"
              fontWeight="300"
            >
              New to TaskFlow?{" "}
              <Link
                to="/register"
                style={{ color: "#2563eb", fontWeight: 600 }}
              >
                Create an account
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Grid>
  );
}
