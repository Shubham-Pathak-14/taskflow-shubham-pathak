import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  SimpleGrid,
  Text,
  VStack,
  HStack,
  Spinner,
  Alert,
  Input,
  Textarea,
  Dialog,
  Field,
  CloseButton,
  Badge,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { projectsApi } from "../api/projects.api";
import type { Project } from "../types";
import { useAuth } from "../contexts/AuthContext";

// ── Design tokens (mirrors LoginPage) ────────────────────────────
const FONT = "'Sora', sans-serif";
const COLOR_HEADING = "#0f172a";
const COLOR_MUTED = "#64748b";
const COLOR_SUBTLE = "#94a3b8";
const COLOR_LABEL = "#475569";
const COLOR_BORDER = "#e2e8f0";
const GRADIENT_BTN = "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)";

// Per-card accent palette — hue only, applied at low opacity
const CARD_ACCENTS = [
  {
    from: "rgba(59,130,246,0.08)",
    dot: "#3b82f6",
    badge: "rgba(59,130,246,0.10)",
    badgeText: "#1d4ed8",
  },
  {
    from: "rgba(16,185,129,0.08)",
    dot: "#10b981",
    badge: "rgba(16,185,129,0.10)",
    badgeText: "#065f46",
  },
  {
    from: "rgba(168,85,247,0.08)",
    dot: "#a855f7",
    badge: "rgba(168,85,247,0.10)",
    badgeText: "#6b21a8",
  },
  {
    from: "rgba(244,63,94,0.08)",
    dot: "#f43f5e",
    badge: "rgba(244,63,94,0.10)",
    badgeText: "#9f1239",
  },
  {
    from: "rgba(234,179,8,0.08)",
    dot: "#eab308",
    badge: "rgba(234,179,8,0.10)",
    badgeText: "#854d0e",
  },
  {
    from: "rgba(20,184,166,0.08)",
    dot: "#14b8a6",
    badge: "rgba(20,184,166,0.10)",
    badgeText: "#134e4a",
  },
];

function getInitials(name: string) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

// ── Shared Input style props ──────────────────────────────────────
const inputProps = {
  fontSize: "0.875rem",
  fontFamily: FONT,
  color: COLOR_HEADING,
  borderColor: COLOR_BORDER,
  borderWidth: "1.5px",
  borderRadius: "10px",
  h: "42px",
  px: "14px",
  _placeholder: { color: COLOR_SUBTLE },
  _focusVisible: {
    borderColor: "#3b82f6",
    boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
  },
  _hover: { borderColor: "#cbd5e1" },
} as const;

// ── Gradient button props ─────────────────────────────────────────
const gradientBtnProps = {
  h: "42px",
  px: "18px",
  borderRadius: "10px",
  fontSize: "0.85rem",
  fontWeight: "600",
  fontFamily: FONT,
  color: "white",
  bg: GRADIENT_BTN,
  border: "none",
  boxShadow: "0 4px 16px rgba(37,99,235,0.28)",
  _hover: {
    transform: "translateY(-1px)",
    boxShadow: "0 6px 22px rgba(37,99,235,0.38)",
  },
  _active: { transform: "translateY(0)" },
  transition: "transform 0.15s, box-shadow 0.15s",
} as const;

export function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDesc, setNewDesc] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState<string | null>(null);

  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    projectsApi
      .list()
      .then(setProjects)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async () => {
    if (!newName.trim()) {
      setCreateError("Project name is required");
      return;
    }
    try {
      setCreating(true);
      setCreateError(null);
      const project = await projectsApi.create({
        name: newName,
        description: newDesc,
      });
      setProjects((prev) => [...prev, project]);
      setIsOpen(false);
      setNewName("");
      setNewDesc("");
    } catch (e: any) {
      setCreateError(e.message);
    } finally {
      setCreating(false);
    }
  };

  // Loading State
  if (loading) {
    return (
      <Flex justify="center" align="center" minH="100vh" bg="main_container.bg">
        <VStack gap="12px">
          <Spinner size="lg" color="#3b82f6" borderWidth="3px" />
          <Text fontSize="0.83rem" color={COLOR_MUTED} fontFamily={FONT}>
            Loading your projects…
          </Text>
        </VStack>
      </Flex>
    );
  }

  // ── Error ────────────────────────────────────────────────────────
  if (error) {
    return (
      <Box bg="main_container.bg" minH="100vh" py="40px" fontFamily={FONT}>
        <Container maxW="6xl">
          <Alert.Root status="error" borderRadius="10px">
            <Alert.Indicator />
            <Alert.Description>{error}</Alert.Description>
          </Alert.Root>
        </Container>
      </Box>
    );
  }

  // ── Main ─────────────────────────────────────────────────────────
  return (
    <Box
      bg="main_container.bg"
      minH="100vh"
      fontFamily={FONT}
      borderRadius="xl"
      border="1px solid"
      borderColor="main_container.border"
    >
      <Container maxW="6xl" py="24px">
        {/* ── Page Header ── */}
        <Flex justify="space-between" align="center" mb="36px">
          <VStack align="start" gap="4px">
            <HStack gap="10px" align="center">
              {/* Logo mark — mirrors LoginPage logo */}
              <Box
                w="32px"
                h="32px"
                borderRadius="8px"
                bg={GRADIENT_BTN}
                display="flex"
                alignItems="center"
                justifyContent="center"
                boxShadow="0 4px 12px rgba(59,130,246,0.3)"
                flexShrink={0}
              >
                <svg width="18" height="18" viewBox="0 0 26 26" fill="none">
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
              <Heading
                fontSize="1.5rem"
                fontWeight="700"
                color={COLOR_HEADING}
                letterSpacing="-0.025em"
                fontFamily={FONT}
                _dark={{
                  color: "whiteAlpha.800",
                }}
              >
                Projects
              </Heading>
            </HStack>
            <Text
              fontSize="0.83rem"
              color={COLOR_MUTED}
              ml="42px"
              _dark={{
                color: "gray.400",
              }}
            >
              Welcome back,{" "}
              <Text
                as="span"
                fontWeight="500"
                color={COLOR_LABEL}
                _dark={{
                  color: "gray.400",
                }}
              >
                {user?.name}
              </Text>
            </Text>
          </VStack>

          <Button {...gradientBtnProps} onClick={() => setIsOpen(true)}>
            + New Project
          </Button>
        </Flex>

        {/* ── Stats strip (only when there are projects) ── */}
        {projects.length > 0 && (
          <HStack
            gap="1px"
            mb="32px"
            bg="main_container.bg"
            borderRadius="14px"
            overflow="hidden"
            boxShadow="0 1px 4px rgba(0,0,0,0.04)"
            border="1px solid"
            borderColor="main_container.bg"
          >
            {[
              { label: "Total projects", value: projects.length },
              {
                label: "Created this month",
                value: projects.filter(
                  (p) =>
                    new Date(p.created_at).getMonth() === new Date().getMonth(),
                ).length,
              },
              {
                label: "Oldest",
                value: projects.length
                  ? new Date(
                      Math.min(
                        ...projects.map((p) =>
                          new Date(p.created_at).getTime(),
                        ),
                      ),
                    ).toLocaleDateString("en-US", {
                      month: "short",
                      year: "numeric",
                    })
                  : "—",
              },
            ].map((stat) => (
              <Box key={stat.label} flex={1} bg="card.bg" px="20px" py="14px">
                <Text
                  fontSize="0.72rem"
                  color={COLOR_SUBTLE}
                  fontWeight="400"
                  mb="2px"
                >
                  {stat.label}
                </Text>
                <Text
                  fontSize="1.25rem"
                  fontWeight="700"
                  color={COLOR_HEADING}
                  letterSpacing="-0.02em"
                  _dark={{
                    color: "whiteAlpha.700",
                  }}
                >
                  {stat.value}
                </Text>
              </Box>
            ))}
          </HStack>
        )}

        {/* ── Empty State ── */}
        {projects.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH="52vh"
            textAlign="center"
          >
            {/* Decorative placeholder */}
            <Box
              w="72px"
              h="72px"
              borderRadius="20px"
              bg="white"
              border={`1.5px dashed ${COLOR_BORDER}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb="20px"
              boxShadow="0 2px 8px rgba(0,0,0,0.04)"
            >
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <rect
                  x="3"
                  y="3"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
                <rect
                  x="13"
                  y="3"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
                <rect
                  x="3"
                  y="13"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
                <rect
                  x="13"
                  y="13"
                  width="8"
                  height="8"
                  rx="2"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeDasharray="2 2"
                />
              </svg>
            </Box>

            <Text
              fontSize="1rem"
              fontWeight="600"
              color={COLOR_HEADING}
              mb="6px"
            >
              No projects yet
            </Text>
            <Text
              fontSize="0.83rem"
              color={COLOR_MUTED}
              maxW="240px"
              lineHeight="1.6"
            >
              Create your first project and start organizing your work.
            </Text>
            <Button
              {...gradientBtnProps}
              mt="20px"
              onClick={() => setIsOpen(true)}
            >
              Create your first project
            </Button>
          </Flex>
        ) : (
          /* ── Project Grid ── */
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} gap="18px">
            {projects.map((project, index) => {
              const accent = CARD_ACCENTS[index % CARD_ACCENTS.length];
              const initials = getInitials(project.name);

              return (
                <Box
                  key={project.id}
                  bg="card.bg"
                  borderRadius="16px"
                  border={`1px solid`}
                  borderColor="main_container.border"
                  boxShadow="0 1px 4px rgba(0,0,0,0.04)"
                  overflow="hidden"
                  cursor="pointer"
                  transition="all 0.2s ease"
                  _hover={{
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 28px rgba(0,0,0,0.08)",
                    borderColor: "#c7d2fe",
                  }}
                  onClick={() => navigate(`/projects/${project.id}`)}
                >
                  {/* Coloured top band */}
                  <Box
                    h="6px"
                    w="full"
                    bg={`linear-gradient(90deg, ${accent.dot}, transparent)`}
                    opacity={0.7}
                  />

                  <Box p="20px">
                    <HStack
                      justify="space-between"
                      align="flex-start"
                      mb="12px"
                    >
                      {/* Initials avatar */}
                      <Box
                        w="40px"
                        h="40px"
                        borderRadius="10px"
                        bg={accent.from}
                        display="flex"
                        alignItems="center"
                        justifyContent="center"
                        flexShrink={0}
                      >
                        <Text
                          fontSize="0.75rem"
                          fontWeight="700"
                          color={accent.badgeText}
                          letterSpacing="0.03em"
                        >
                          {initials}
                        </Text>
                      </Box>

                      {/* Active dot */}
                      <Box
                        w="8px"
                        h="8px"
                        borderRadius="full"
                        bg={accent.dot}
                        boxShadow={`0 0 6px ${accent.dot}`}
                        mt="4px"
                      />
                    </HStack>

                    {/* Title */}
                    <Text
                      fontSize="0.95rem"
                      fontWeight="600"
                      color={COLOR_HEADING}
                      letterSpacing="-0.01em"
                      mb="6px"
                      lineClamp={1}
                      _dark={{
                        color: "whiteAlpha.900",
                      }}
                    >
                      {project.name}
                    </Text>

                    {/* Description */}
                    {project.description ? (
                      <Text
                        fontSize="0.8rem"
                        color={COLOR_MUTED}
                        lineHeight="1.55"
                        lineClamp={2}
                        mb="16px"
                        minH="36px"
                      >
                        {project.description}
                      </Text>
                    ) : (
                      <Text
                        fontSize="0.8rem"
                        color={COLOR_SUBTLE}
                        fontStyle="italic"
                        mb="16px"
                        minH="36px"
                      >
                        No description
                      </Text>
                    )}

                    {/* Footer row */}
                    <Box h="1px" bg={COLOR_BORDER} mb="12px" />
                    <HStack justify="space-between" align="center">
                      <Text
                        fontSize="0.72rem"
                        color={COLOR_SUBTLE}
                        fontWeight="400"
                      >
                        {new Date(project.created_at).toLocaleDateString(
                          "en-US",
                          {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          },
                        )}
                      </Text>
                      <Badge
                        px="8px"
                        py="3px"
                        borderRadius="full"
                        fontSize="0.68rem"
                        fontWeight="600"
                        bg={accent.badge}
                        color={accent.badgeText}
                        fontFamily={FONT}
                      >
                        Active
                      </Badge>
                    </HStack>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Container>

      {/* ── Create Project Modal ── */}
      <Dialog.Root open={isOpen} onOpenChange={(e) => setIsOpen(e.open)}>
        <Dialog.Backdrop backdropFilter="blur(2px)" bg="rgba(15,23,42,0.4)" />
        <Dialog.Positioner>
          <Dialog.Content
            borderRadius="20px"
            boxShadow="0 24px 60px rgba(0,0,0,0.14)"
            border={`1px solid ${COLOR_BORDER}`}
            fontFamily={FONT}
            maxW="420px"
            w="full"
            _dark={{
              border: "1px solid",
              borderColor: "whiteAlpha.400",
            }}
          >
            {/* Modal header */}
            <Dialog.Header
              pt="24px"
              px="28px"
              pb="0"
              borderBottom={`1px solid ${COLOR_BORDER}`}
              mb="0"
              _dark={{
                borderBottom: "1px solid",
                borderColor: "whiteAlpha.400",
              }}
            >
              <HStack justify="space-between" align="center" pb="16px">
                <VStack align="start" gap="2px">
                  <Dialog.Title
                    fontSize="1rem"
                    fontWeight="700"
                    color={COLOR_HEADING}
                    letterSpacing="-0.01em"
                    fontFamily={FONT}
                    _dark={{
                      color: "whiteAlpha.800",
                    }}
                  >
                    New Project
                  </Dialog.Title>
                  <Text fontSize="0.78rem" color={COLOR_MUTED}>
                    Fill in the details to get started
                  </Text>
                </VStack>
                <Dialog.CloseTrigger asChild>
                  <CloseButton
                    size="sm"
                    borderRadius="8px"
                    color={COLOR_MUTED}
                    _hover={{ bg: "#f1f5f9", color: COLOR_HEADING }}
                  />
                </Dialog.CloseTrigger>
              </HStack>
            </Dialog.Header>

            <Dialog.Body px="28px" py="20px">
              <VStack gap="16px">
                {createError && (
                  <Alert.Root
                    status="error"
                    borderRadius="10px"
                    fontSize="0.82rem"
                  >
                    <Alert.Indicator />
                    <Alert.Description fontFamily={FONT}>
                      {createError}
                    </Alert.Description>
                  </Alert.Root>
                )}

                <Field.Root w="full">
                  <Field.Label
                    fontSize="0.8rem"
                    fontWeight="500"
                    color={COLOR_LABEL}
                    letterSpacing="0.01em"
                    mb="6px"
                    _dark={{
                      color: "gray.400",
                    }}
                  >
                    Project Name
                  </Field.Label>
                  <Input
                    {...inputProps}
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Website Redesign"
                    onKeyDown={(e) => e.key === "Enter" && handleCreate()}
                    color="input.color"
                    _placeholder={{
                      color: "input.placeholder",
                    }}
                    border="1px solid"
                    borderColor="input.border"
                  />
                </Field.Root>

                <Field.Root w="full">
                  <Field.Label
                    fontSize="0.8rem"
                    fontWeight="500"
                    color={COLOR_LABEL}
                    letterSpacing="0.01em"
                    mb="6px"
                  >
                    Description{" "}
                    <Text
                      as="span"
                      color={COLOR_SUBTLE}
                      fontWeight="400"
                      border="1px solid"
                      borderColor="input.border"
                    >
                      (optional)
                    </Text>
                  </Field.Label>
                  <Textarea
                    value={newDesc}
                    onChange={(e) => setNewDesc(e.target.value)}
                    placeholder="What's this project about?"
                    fontSize="0.875rem"
                    fontFamily={FONT}
                    // color={COLOR_HEADING}
                    // borderColor={COLOR_BORDER}
                    borderWidth="1px"
                    borderRadius="10px"
                    px="14px"
                    py="10px"
                    minH="90px"
                    resize="none"
                    // _placeholder={{ color: COLOR_SUBTLE }}
                    _focusVisible={{
                      borderColor: "#3b82f6",
                      boxShadow: "0 0 0 3px rgba(59,130,246,0.12)",
                    }}
                    _hover={{ borderColor: "#cbd5e1" }}
                    color="input.color"
                    _placeholder={{
                      color: "input.placeholder",
                    }}
                    border="1px solid"
                    borderColor="input.border"
                  />
                </Field.Root>
              </VStack>
            </Dialog.Body>

            <Dialog.Footer
              px="28px"
              pb="24px"
              pt="0"
              borderTop={`1px solid ${COLOR_BORDER}`}
              mt="4px"
              paddingTop="16px"
            >
              <HStack gap="10px" justify="flex-end" w="full">
                <Button
                  variant="ghost"
                  onClick={() => setIsOpen(false)}
                  h="40px"
                  px="16px"
                  borderRadius="10px"
                  fontSize="0.85rem"
                  fontFamily={FONT}
                  color={COLOR_MUTED}
                  _hover={{ bg: "#f1f5f9", color: COLOR_HEADING }}
                >
                  Cancel
                </Button>
                <Button
                  {...gradientBtnProps}
                  loading={creating}
                  loadingText="Creating…"
                  onClick={handleCreate}
                  h="40px"
                >
                  Create project
                </Button>
              </HStack>
            </Dialog.Footer>
          </Dialog.Content>
        </Dialog.Positioner>
      </Dialog.Root>
    </Box>
  );
}
