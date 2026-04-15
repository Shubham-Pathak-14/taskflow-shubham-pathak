import {
  Box,
  Button,
  Container,
  Flex,
  Heading,
  Text,
  VStack,
  HStack,
  Spinner,
  Alert,
  SimpleGrid,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { projectsApi } from "../api/projects.api";
import { tasksApi } from "../api/tasks.api";
import type { ProjectWithTasks, Task, TaskStatus } from "../types";
import { TaskDrawer } from "../components/tasks/TaskDrawer";
import { TaskFilters } from "../components/tasks/TaskFilters";

// ── Design tokens (mirrors LoginPage / ProjectsPage) ──────────────
const FONT = "'Sora', sans-serif";
// const PAGE_BG = "#f8fafc";
const C_HEADING = "#0f172a";
const C_MUTED = "#64748b";
const C_SUBTLE = "#94a3b8";
const C_BORDER = "#e2e8f0";
const GRADIENT_BTN = "linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)";

// ── Column definitions ────────────────────────────────────────────
const STATUS_COLUMNS: TaskStatus[] = ["todo", "in_progress", "done"];

const STATUS_META: Record<
  TaskStatus,
  {
    label: string;
    dot: string;
    colBg: string;
    badgeBg: string;
    badgeText: string;
  }
> = {
  todo: {
    label: "To Do",
    dot: "#94a3b8",
    colBg: "rgba(148,163,184,0.06)",
    badgeBg: "rgba(148,163,184,0.12)",
    badgeText: "#475569",
  },
  in_progress: {
    label: "In Progress",
    dot: "#3b82f6",
    colBg: "rgba(59,130,246,0.05)",
    badgeBg: "rgba(59,130,246,0.10)",
    badgeText: "#1d4ed8",
  },
  done: {
    label: "Done",
    dot: "#10b981",
    colBg: "rgba(16,185,129,0.05)",
    badgeBg: "rgba(16,185,129,0.10)",
    badgeText: "#065f46",
  },
};

const PRIORITY_META: Record<
  string,
  { bg: string; text: string; label: string }
> = {
  low: { bg: "rgba(148,163,184,0.12)", text: "#475569", label: "Low" },
  medium: { bg: "rgba(234,179,8,0.12)", text: "#854d0e", label: "Medium" },
  high: { bg: "rgba(239,68,68,0.12)", text: "#991b1b", label: "High" },
};

// ── Shared button props ───────────────────────────────────────────
const gradientBtnProps = {
  h: "40px",
  px: "16px",
  borderRadius: "10px",
  fontSize: "0.85rem",
  fontWeight: "600" as const,
  fontFamily: FONT,
  color: "white",
  bg: GRADIENT_BTN,
  border: "none",
  boxShadow: "0 4px 14px rgba(37,99,235,0.28)",
  _hover: {
    transform: "translateY(-1px)",
    boxShadow: "0 6px 20px rgba(37,99,235,0.38)",
  },
  _active: { transform: "translateY(0)" },
  transition: "transform 0.15s, box-shadow 0.15s",
} as const;

export function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [project, setProject] = useState<ProjectWithTasks | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [statusFilter, setStatusFilter] = useState<TaskStatus | "">("");
  const [assigneeFilter, setAssigneeFilter] = useState<string>("");

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  // const [tasksLoading, setTasksLoading] = useState(false);

  useEffect(() => {
    if (!id) return;
    projectsApi
      .get(id)
      .then(setProject)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [id]);

  // Re-fetch tasks whenever filters change
  useEffect(() => {
    if (!id) return;
    tasksApi
      .list(id, {
        status: statusFilter || undefined,
        assignee: assigneeFilter || undefined,
      })
      .then(setTasks);
  }, [id, statusFilter, assigneeFilter]);

  // Using Optimistic UI Update
  const handleStatusChange = async (taskId: string, status: TaskStatus) => {
    const previous = tasks;
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t)),
    );
    try {
      await tasksApi.update(taskId, { status });
    } catch {
      setTasks(previous);
    }
  };

  const handleTaskSaved = (savedTask: Task) => {
    setTasks((prev) => {
      const exists = prev.find((t) => t.id === savedTask.id);
      return exists
        ? prev.map((t) => (t.id === savedTask.id ? savedTask : t))
        : [...prev, savedTask];
    });
    setDrawerOpen(false);
    setEditingTask(null);
  };

  const handleDeleteTask = async (taskId: string) => {
    await tasksApi.delete(taskId);
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  const openCreate = () => {
    setEditingTask(null);
    setDrawerOpen(true);
  };
  const openEdit = (task: Task) => {
    setEditingTask(task);
    setDrawerOpen(true);
  };

  // const filteredTasks =
  //   project?.tasks.filter((t) => {
  //     if (statusFilter && t.status !== statusFilter) return false;
  //     if (assigneeFilter && t.assignee_id !== assigneeFilter) return false;
  //     return true;
  //   }) ?? [];

  // ── Loading ────────────────────────────────────────────────────
  if (loading)
    return (
      <Flex justify="center" align="center" minH="100vh" bg="main_container.bg">
        <VStack gap="12px">
          <Spinner size="lg" color="#3b82f6" borderWidth="3px" />
          <Text fontSize="0.83rem" color={C_MUTED} fontFamily={FONT}>
            Loading project…
          </Text>
        </VStack>
      </Flex>
    );

  // ── Error ──────────────────────────────────────────────────────
  if (error)
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

  if (!project) return null;

  const totalTasks = project.tasks.length;

  return (
    <Box
      bg="main_container.bg"
      py="16px"
      minH="100vh"
      fontFamily={FONT}
      borderRadius="xl"
      border="1px solid"
      borderColor="main_container.border"
    >
      <Container py="8px">
        {/* ── Page Header ─────────────────────────────────────── */}
        <Box
          bg="card.bg"
          border={`1px solid`}
          borderColor="main_container.border"
          borderRadius="lg"
          px="28px"
          py="22px"
          mb="24px"
          boxShadow="0 1px 4px rgba(0,0,0,0.04)"
        >
          <Flex justify="space-between" align="center">
            <VStack align="start" gap="6px">
              {/* Back link */}
              <HStack
                gap="5px"
                cursor="pointer"
                onClick={() => navigate("/projects")}
                _hover={{ opacity: 0.75 }}
                transition="opacity 0.15s"
              >
                <Text fontSize="0.78rem" color="#3b82f6" fontWeight="500">
                  ← All Projects
                </Text>
              </HStack>

              {/* Title row */}
              <HStack gap="10px" align="center">
                <Heading
                  fontSize="1.4rem"
                  fontWeight="700"
                  color={C_HEADING}
                  letterSpacing="-0.025em"
                  fontFamily={FONT}
                  _dark={{
                    color: "whiteAlpha.800",
                  }}
                >
                  {project.name}
                </Heading>
                {/* Task count pill */}
                <Box
                  px="8px"
                  py="2px"
                  borderRadius="full"
                  bg="rgba(59,130,246,0.08)"
                  border="1px solid rgba(59,130,246,0.15)"
                >
                  <Text fontSize="0.72rem" fontWeight="600" color="#1d4ed8">
                    {totalTasks} {totalTasks === 1 ? "task" : "tasks"}
                  </Text>
                </Box>
              </HStack>

              {project.description && (
                <Text
                  fontSize="0.83rem"
                  color={C_MUTED}
                  lineHeight="1.5"
                  maxW="520px"
                  _dark={{
                    color: "",
                  }}
                >
                  {project.description}
                </Text>
              )}
            </VStack>

            <Button {...gradientBtnProps} onClick={openCreate}>
              + Add Task
            </Button>
          </Flex>
        </Box>

        {/* ── Filters (external component, unstyled wrapper) ── */}
        <Box mb="20px">
          <TaskFilters
            statusFilter={statusFilter}
            assigneeFilter={assigneeFilter}
            tasks={project.tasks}
            onStatusChange={setStatusFilter}
            onAssigneeChange={setAssigneeFilter}
          />
        </Box>

        {/* ── Empty state ──────────────────────────────────────── */}
        {tasks.length === 0 ? (
          <Flex
            direction="column"
            align="center"
            justify="center"
            minH="40vh"
            textAlign="center"
          >
            <Box
              w="64px"
              h="64px"
              borderRadius="16px"
              bg="white"
              border={`1.5px dashed ${C_BORDER}`}
              display="flex"
              alignItems="center"
              justifyContent="center"
              mb="16px"
              boxShadow="0 2px 8px rgba(0,0,0,0.04)"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <rect
                  x="9"
                  y="3"
                  width="6"
                  height="4"
                  rx="1"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                />
                <path
                  d="M9 12h6M9 16h4"
                  stroke="#cbd5e1"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </Box>
            <Text
              fontSize="0.95rem"
              fontWeight="600"
              color={C_HEADING}
              mb="4px"
            >
              No tasks found
            </Text>
            <Text fontSize="0.82rem" color={C_MUTED}>
              {statusFilter || assigneeFilter
                ? "Try adjusting your filters"
                : "Add your first task to get started"}
            </Text>
          </Flex>
        ) : (
          /* ── Kanban Columns ─────────────────────────────────── */
          <SimpleGrid columns={{ base: 1, md: 3 }} gap="14px">
            {STATUS_COLUMNS.map((status) => {
              const meta = STATUS_META[status];
              const columnTasks = tasks.filter((t) => t.status === status);

              return (
                <Box key={status}>
                  {/* Column header */}
                  <HStack
                    justify="space-between"
                    align="center"
                    px="4px"
                    mb="10px"
                  >
                    <HStack gap="7px">
                      <Box w="8px" h="8px" borderRadius="full" bg={meta.dot} />
                      <Text
                        fontSize="0.8rem"
                        fontWeight="600"
                        color={C_HEADING}
                        letterSpacing="0.01em"
                        _dark={{
                          color: "whiteAlpha.500",
                        }}
                      >
                        {meta.label}
                      </Text>
                    </HStack>
                    <Box
                      px="7px"
                      py="1px"
                      borderRadius="full"
                      bg={meta.badgeBg}
                      _dark={{
                        bg: "black",
                      }}
                    >
                      <Text
                        fontSize="0.72rem"
                        fontWeight="600"
                        color={meta.badgeText}
                        _dark={{
                          color: "whiteAlpha.600",
                        }}
                      >
                        {columnTasks.length}
                      </Text>
                    </Box>
                  </HStack>

                  {/* Column body */}
                  <Box
                    bg={meta.colBg}
                    borderRadius="14px"
                    border={`1px solid ${C_BORDER}`}
                    p="10px"
                    minH="200px"
                    _dark={{
                      border: "1px solid",
                      borderColor: "whiteAlpha.200",
                    }}
                  >
                    <VStack gap="8px" align="stretch">
                      {columnTasks.length === 0 ? (
                        <Flex
                          align="center"
                          justify="center"
                          h="80px"
                          borderRadius="10px"
                          border={`1.5px dashed ${C_BORDER}`}
                        >
                          <Text fontSize="0.78rem" color={C_SUBTLE}>
                            No tasks
                          </Text>
                        </Flex>
                      ) : (
                        columnTasks.map((task) => {
                          const pMeta =
                            PRIORITY_META[task.priority] ?? PRIORITY_META.low;
                          const isOverdue =
                            task.due_date &&
                            new Date(task.due_date) < new Date() &&
                            task.status !== "done";

                          return (
                            <Box
                              key={task.id}
                              bg="card.bg"
                              borderRadius="12px"
                              border={`1px solid`}
                              borderColor="card.border"
                              p="14px"
                              boxShadow="0 1px 3px rgba(0,0,0,0.04)"
                              transition="all 0.18s ease"
                              _hover={{
                                transform: "translateY(-2px)",
                                boxShadow: "0 6px 16px rgba(0,0,0,0.08)",
                                borderColor: "#c7d2fe",
                              }}
                            >
                              <VStack align="start" gap="10px">
                                {/* Title */}
                                <Text
                                  fontSize="0.85rem"
                                  fontWeight="600"
                                  color={C_HEADING}
                                  lineHeight="1.4"
                                  lineClamp={2}
                                  _dark={{
                                    color: "whiteAlpha.900",
                                  }}
                                >
                                  {task.title}
                                </Text>

                                {/* Description */}
                                {task.description && (
                                  <Text
                                    fontSize="0.78rem"
                                    color={C_MUTED}
                                    lineHeight="1.5"
                                    lineClamp={2}
                                    _dark={{
                                      color: "gray.400",
                                    }}
                                  >
                                    {task.description}
                                  </Text>
                                )}

                                {/* Priority + due date */}
                                <HStack gap="6px" flexWrap="wrap">
                                  <Box
                                    px="7px"
                                    py="2px"
                                    borderRadius="full"
                                    bg={pMeta.bg}
                                  >
                                    <Text
                                      fontSize="0.68rem"
                                      fontWeight="600"
                                      color={pMeta.text}
                                      _dark={{
                                        color: "",
                                      }}
                                    >
                                      {pMeta.label}
                                    </Text>
                                  </Box>

                                  {task.due_date && (
                                    <Box
                                      px="7px"
                                      py="2px"
                                      borderRadius="full"
                                      bg={
                                        isOverdue
                                          ? "rgba(239,68,68,0.08)"
                                          : "rgba(148,163,184,0.10)"
                                      }
                                    >
                                      <Text
                                        fontSize="0.68rem"
                                        fontWeight="500"
                                        color={isOverdue ? "#991b1b" : C_MUTED}
                                      >
                                        {isOverdue ? "Overdue · " : "Due · "}
                                        {new Date(
                                          task.due_date,
                                        ).toLocaleDateString("en-US", {
                                          month: "short",
                                          day: "numeric",
                                        })}
                                      </Text>
                                    </Box>
                                  )}
                                </HStack>

                                {/* Divider */}
                                <Box
                                  h="1px"
                                  bg={C_BORDER}
                                  w="full"
                                  _dark={{
                                    bg: "whiteAlpha.300",
                                  }}
                                />

                                {/* Actions */}
                                <HStack gap="4px" flexWrap="wrap">
                                  {status !== "done" && (
                                    <Button
                                      size="xs"
                                      h="26px"
                                      px="10px"
                                      borderRadius="7px"
                                      fontSize="0.72rem"
                                      fontWeight="600"
                                      fontFamily={FONT}
                                      color="white"
                                      bg={
                                        status === "todo"
                                          ? "#3b82f6"
                                          : "#10b981"
                                      }
                                      border="none"
                                      _hover={{ opacity: 0.88 }}
                                      onClick={() =>
                                        handleStatusChange(
                                          task.id,
                                          status === "todo"
                                            ? "in_progress"
                                            : "done",
                                        )
                                      }
                                    >
                                      {status === "todo" ? "Start" : "Complete"}
                                    </Button>
                                  )}
                                  <Button
                                    size="xs"
                                    h="26px"
                                    px="10px"
                                    borderRadius="7px"
                                    fontSize="0.72rem"
                                    fontWeight="500"
                                    fontFamily={FONT}
                                    color={C_MUTED}
                                    bg="transparent"
                                    border={`1px solid ${C_BORDER}`}
                                    _hover={{ bg: "#f1f5f9", color: C_HEADING }}
                                    _dark={{
                                      border: "1px solid gray",
                                    }}
                                    onClick={() => openEdit(task)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="xs"
                                    h="26px"
                                    px="10px"
                                    borderRadius="7px"
                                    fontSize="0.72rem"
                                    fontWeight="500"
                                    fontFamily={FONT}
                                    color="#dc2626"
                                    bg="transparent"
                                    border="1px solid rgba(239,68,68,0.2)"
                                    _hover={{ bg: "rgba(239,68,68,0.06)" }}
                                    onClick={() => handleDeleteTask(task.id)}
                                  >
                                    Delete
                                  </Button>
                                </HStack>
                              </VStack>
                            </Box>
                          );
                        })
                      )}
                    </VStack>
                  </Box>
                </Box>
              );
            })}
          </SimpleGrid>
        )}
      </Container>

      {/* ── Task Drawer ──────────────────────────────────────────── */}
      <TaskDrawer
        isOpen={drawerOpen}
        onClose={() => {
          setDrawerOpen(false);
          setEditingTask(null);
        }}
        projectId={id!}
        task={editingTask}
        onSaved={handleTaskSaved}
      />
    </Box>
  );
}
