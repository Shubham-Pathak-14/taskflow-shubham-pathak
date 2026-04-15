import {
  Flex,
  Select,
  Button,
  createListCollection,
  Portal,
} from "@chakra-ui/react";
import type { Task, TaskStatus } from "../../types";
// import { users } from "../../mocks/db";
import { db } from "../../mocks/db";

interface Props {
  statusFilter: TaskStatus | "";
  assigneeFilter: string;
  tasks: Task[];
  onStatusChange: (s: TaskStatus | "") => void;
  onAssigneeChange: (id: string) => void;
}

export function TaskFilters({
  statusFilter,
  assigneeFilter,
  onStatusChange,
  onAssigneeChange,
}: Props) {
  const statusOptions = createListCollection({
    items: [
      { label: "All Statuses", value: "" },
      { label: "To Do", value: "todo" },
      { label: "In Progress", value: "in_progress" },
      { label: "Done", value: "done" },
    ],
  });

  const assigneeOptions = createListCollection({
    items: [
      { label: "All Assignees", value: "" },
      ...db.users.map((u) => ({ label: u.name, value: u.id })),
    ],
  });

  const hasFilters = statusFilter || assigneeFilter;

  return (
    <Flex gap={3} mt={6} wrap="wrap" align="center">
      <Select.Root
        collection={statusOptions}
        value={[statusFilter]}
        onValueChange={(e) => onStatusChange(e.value[0] as TaskStatus | "")}
        size="sm"
        width="160px"
        bg="select_bg"
      >
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>

          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>

        <Portal>
          <Select.Positioner>
            <Select.Content>
              {statusOptions.items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

      <Select.Root
        collection={assigneeOptions}
        value={[assigneeFilter]}
        onValueChange={(e) => onAssigneeChange(e.value[0])}
        size="sm"
        width="180px"
        bg="select_bg"
      >
        <Select.Control>
          <Select.Trigger>
            <Select.ValueText />
          </Select.Trigger>

          <Select.IndicatorGroup>
            <Select.Indicator />
          </Select.IndicatorGroup>
        </Select.Control>
        <Portal>
          <Select.Positioner>
            <Select.Content>
              {assigneeOptions.items.map((item) => (
                <Select.Item key={item.value} item={item}>
                  {item.label}
                </Select.Item>
              ))}
            </Select.Content>
          </Select.Positioner>
        </Portal>
      </Select.Root>

      {hasFilters && (
        <Button
          size="sm"
          variant="ghost"
          onClick={() => {
            onStatusChange("");
            onAssigneeChange("");
          }}
        >
          Clear filters
        </Button>
      )}
    </Flex>
  );
}
