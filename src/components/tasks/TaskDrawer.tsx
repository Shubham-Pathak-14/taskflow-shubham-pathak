import {
  Drawer,
  Button,
  Input,
  Textarea,
  VStack,
  Field,
  CloseButton,
  createListCollection,
  Select,
  Alert,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import type { Task, TaskStatus, TaskPriority } from "../../types";
import { tasksApi } from "../../api/tasks.api";
// import { users } from "../../mocks/db";
import { db } from "../../mocks/db";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  projectId: string;
  task: Task | null; // null = create mode, Task = edit mode
  onSaved: (task: Task) => void;
}

export function TaskDrawer({
  isOpen,
  onClose,
  projectId,
  task,
  onSaved,
}: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState<TaskStatus>("todo");
  const [priority, setPriority] = useState<TaskPriority>("medium");
  const [assigneeId, setAssigneeId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Populate fields when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description ?? "");
      setStatus(task.status);
      setPriority(task.priority);
      setAssigneeId(task.assignee_id ?? "");
      setDueDate(task.due_date ?? "");
    } else {
      setTitle("");
      setDescription("");
      setStatus("todo");
      setPriority("medium");
      setAssigneeId("");
      setDueDate("");
    }
    setError(null);
  }, [task, isOpen]);

  const handleSave = async () => {
    if (!title.trim()) {
      setError("Title is required");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      const payload = {
        title,
        description,
        status,
        priority,
        assignee_id: assigneeId || undefined,
        due_date: dueDate || undefined,
      };
      const saved = task
        ? await tasksApi.update(task.id, payload)
        : await tasksApi.create(projectId, payload);

      onSaved(saved);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = createListCollection({
    items: [
      { label: "To Do", value: "todo" },
      { label: "In Progress", value: "in_progress" },
      { label: "Done", value: "done" },
    ],
  });

  const priorityOptions = createListCollection({
    items: [
      { label: "Low", value: "low" },
      { label: "Medium", value: "medium" },
      { label: "High", value: "high" },
    ],
  });

  const assigneeOptions = createListCollection({
    items: [
      { label: "Unassigned", value: "" },
      ...db.users.map((u) => ({ label: u.name, value: u.id })),
    ],
  });

  return (
    <Drawer.Root
      open={isOpen}
      onOpenChange={(e) => !e.open && onClose()}
      placement="end"
    >
      <Drawer.Backdrop />
      <Drawer.Positioner>
        <Drawer.Content maxW="420px">
          <Drawer.Header>
            <Drawer.Title>{task ? "Edit Task" : "New Task"}</Drawer.Title>
            <Drawer.CloseTrigger asChild>
              <CloseButton size="sm" />
            </Drawer.CloseTrigger>
          </Drawer.Header>

          <Drawer.Body>
            <VStack gap={4} align="stretch">
              {error && (
                <Alert.Root status="error" borderRadius="md">
                  <Alert.Indicator />
                  <Alert.Description>{error}</Alert.Description>
                </Alert.Root>
              )}

              <Field.Root>
                <Field.Label>Title</Field.Label>
                <Input
                  placeholder="Task title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Description</Field.Label>
                <Textarea
                  placeholder="Optional description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </Field.Root>

              <Field.Root>
                <Field.Label>Status</Field.Label>
                <Select.Root
                  collection={statusOptions}
                  value={[status]}
                  onValueChange={(e) => setStatus(e.value[0] as TaskStatus)}
                >
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.Content>
                    {statusOptions.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Priority</Field.Label>
                <Select.Root
                  collection={priorityOptions}
                  value={[priority]}
                  onValueChange={(e) => setPriority(e.value[0] as TaskPriority)}
                >
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.Content>
                    {priorityOptions.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Assignee</Field.Label>
                <Select.Root
                  collection={assigneeOptions}
                  value={[assigneeId]}
                  onValueChange={(e) => setAssigneeId(e.value[0])}
                >
                  <Select.Trigger>
                    <Select.ValueText />
                  </Select.Trigger>
                  <Select.Content>
                    {assigneeOptions.items.map((item) => (
                      <Select.Item key={item.value} item={item}>
                        {item.label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              </Field.Root>

              <Field.Root>
                <Field.Label>Due Date</Field.Label>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </Field.Root>
            </VStack>
          </Drawer.Body>

          <Drawer.Footer>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button colorPalette="blue" loading={loading} onClick={handleSave}>
              {task ? "Save Changes" : "Create Task"}
            </Button>
          </Drawer.Footer>
        </Drawer.Content>
      </Drawer.Positioner>
    </Drawer.Root>
  );
}
