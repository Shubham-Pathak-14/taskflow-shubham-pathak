import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
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

export function RegisterPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!name || !email || !password) {
      setError("All fields are required");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const data = await authApi.register(name, email, password);
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
      {/* ── LEFT PANEL ── */}
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
        <Box
          position="absolute"
          inset={0}
          backgroundImage="linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)"
          backgroundSize="40px 40px"
        />

        <Box
          position="absolute"
          w="340px"
          h="340px"
          borderRadius="full"
          top="-80px"
          right="-80px"
          background="radial-gradient(circle, rgba(96,165,250,0.15) 0%, transparent 70%)"
        />
        <Box
          position="absolute"
          w="260px"
          h="260px"
          borderRadius="full"
          bottom="60px"
          left="-60px"
          background="radial-gradient(circle, rgba(147,197,253,0.10) 0%, transparent 70%)"
        />

        {/* Logo */}
        <TaskFlowLogo />

        {/* Content */}
        <Box zIndex={1}>
          <HStack
            gap="8px"
            bg="rgba(255,255,255,0.07)"
            border="1px solid rgba(255,255,255,0.1)"
            borderRadius="full"
            px="14px"
            py="6px"
            mb="28px"
          >
            <Box
              w="7px"
              h="7px"
              borderRadius="full"
              bg="#34d399"
              animation={`${pulseDot} 2.2s ease-in-out infinite`}
            />
            <Text color="rgba(191,219,254,0.85)" fontSize="0.78rem">
              Join teams building faster
            </Text>
          </HStack>

          <Text
            as="h1"
            fontFamily="'Lora', serif"
            fontStyle="italic"
            fontSize="2.2rem"
            color="white"
            lineHeight="1.3"
          >
            Build faster,
            <br />
            collaborate{" "}
            <Text as="span" color="#93c5fd">
              smarter.
            </Text>
          </Text>

          <VStack mt="30px" align="stretch" gap="14px">
            {FEATURES.map((f) => (
              <HStack key={f.label} gap="10px">
                <Text color="rgba(191,219,254,0.75)" fontSize="0.8rem">
                  {f.icon}
                </Text>
                <Text color="rgba(191,219,254,0.75)" fontSize="0.8rem">
                  {f.label}
                </Text>
              </HStack>
            ))}
          </VStack>
        </Box>

        <Text fontSize="0.72rem" color="rgba(148,163,184,0.5)">
          © {new Date().getFullYear()} TaskFlow
        </Text>
      </Box>

      {/* ── RIGHT FORM ── */}
      <Box
        bg="#f8fafc"
        display="flex"
        alignItems="center"
        justifyContent="center"
        p="32px"
      >
        <Box
          bg="white"
          borderRadius="20px"
          boxShadow="0 4px 40px rgba(0,0,0,0.07)"
          p={{ base: "32px 24px", sm: "44px 40px" }}
          w="full"
          maxW="400px"
        >
          <VStack gap={5} align="stretch">
            {/* Header */}
            <Box>
              <Heading
                fontWeight="700"
                fontSize="1.6rem"
                color="#0f172a"
                letterSpacing="-0.025em"
                mb="6px"
              >
                Create account
              </Heading>
              <Text fontSize="0.83rem" color="#64748b">
                Start managing your work with TaskFlow
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
                <Alert.Title>{error}</Alert.Title>
              </Alert.Root>
            )}

            {/* Name */}
            <Field.Root>
              <Field.Label
                fontSize="0.8rem"
                fontWeight="500"
                color="#475569"
                mb="6px"
              >
                Name
              </Field.Label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jane Doe"
                fontSize="0.875rem"
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
              />
            </Field.Root>

            {/* Email */}
            <Field.Root>
              <Field.Label
                fontSize="0.8rem"
                fontWeight="500"
                color="#475569"
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
              />
            </Field.Root>

            {/* Password */}
            <Field.Root>
              <Field.Label
                fontSize="0.8rem"
                fontWeight="500"
                color="#475569"
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
              />
            </Field.Root>

            {/* Button */}
            <Button
              onClick={handleSubmit}
              loading={loading}
              loadingText="Creating account..."
              w="full"
              h="44px"
              borderRadius="10px"
              fontSize="0.875rem"
              fontWeight="600"
              color="white"
              bg="linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)"
              boxShadow="0 4px 16px rgba(37,99,235,0.3)"
              _hover={{
                transform: "translateY(-1px)",
                boxShadow: "0 6px 22px rgba(37,99,235,0.38)",
              }}
            >
              Create account
            </Button>

            {/* Footer */}
            <Text textAlign="center" color="#94a3b8" fontSize="0.8rem">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#2563eb", fontWeight: 600 }}>
                Sign in
              </Link>
            </Text>
          </VStack>
        </Box>
      </Box>
    </Grid>
  );
}
