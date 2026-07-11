import { useEffect, useMemo, useState } from "react";
import { Check, ListChecks, Plus, Trash2 } from "lucide-react";
import { useTasksStore } from "@/stores/tasksStore";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Card from "@/components/dashboard/Card";
import Button from "@/components/ui/Button";
import EmptyState from "@/components/dashboard/EmptyState";
import { TasksSkeleton } from "@/components/dashboard/PageSkeletons";
import TaskFormModal from "@/components/dashboard/TaskFormModal";

function isToday(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return (
    d.getFullYear() === now.getFullYear() &&
    d.getMonth() === now.getMonth() &&
    d.getDate() === now.getDate()
  );
}

export default function Tasks() {
  const { tasks, listLoaded, listLoading, fetchTasks, createTask, toggleTask, deleteTask } = useTasksStore();
  const [formOpen, setFormOpen] = useState(false);

  useEffect(() => {
    if (!listLoaded) fetchTasks();
  }, [listLoaded, fetchTasks]);

  const taskGroups = useMemo(() => {
    const today = [];
    const week = [];
    const done = [];
    for (const task of tasks) {
      if (task.done) done.push(task);
      else if (isToday(task.dueDate)) today.push(task);
      else week.push(task);
    }
    return [
      { id: "today", title: "Today", tasks: today },
      { id: "week", title: "This Week", tasks: week },
      { id: "done", title: "Completed", tasks: done },
    ];
  }, [tasks]);

  if (listLoading && !listLoaded) {
    return (
      <div>
        <SectionHeader title="Tasks" subtitle="Track what you need to study and review" />
        <TasksSkeleton />
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title="Tasks"
        subtitle="Track what you need to study and review"
        action={
          <Button onClick={() => setFormOpen(true)}>
            <Plus size={18} /> New task
          </Button>
        }
      />

      {tasks.length === 0 ? (
        <EmptyState
          icon={ListChecks}
          title="No tasks yet"
          description="Add a task to start tracking what you need to study and review."
          action={
            <Button onClick={() => setFormOpen(true)}>
              <Plus size={18} /> New task
            </Button>
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {taskGroups.map((group) => (
            <Card key={group.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-mauve-800">{group.title}</h3>
                <span className="rounded-full bg-mauve-100 px-2 py-0.5 text-xs font-medium text-mauve-500">
                  {group.tasks.length}
                </span>
              </div>
              <ul className="space-y-2">
                {group.tasks.map((task) => (
                  <li
                    key={task._id}
                    className="group flex items-center gap-3 rounded-xl bg-cream-100/70 px-3 py-2.5"
                  >
                    <button
                      onClick={() => toggleTask(task._id, task.done)}
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                        task.done
                          ? "border-accent-500 bg-accent-500 text-white"
                          : "border-mauve-300 bg-surface"
                      }`}
                      aria-label={task.done ? "Mark as not done" : "Mark as done"}
                    >
                      {task.done && <Check size={13} />}
                    </button>
                    <span
                      className={`flex-1 text-sm ${
                        task.done ? "text-mauve-400 line-through" : "text-mauve-700"
                      }`}
                    >
                      {task.text}
                    </span>
                    <button
                      onClick={() => deleteTask(task._id)}
                      className="rounded-lg p-1 text-mauve-300 opacity-0 transition hover:bg-danger-50 hover:text-danger-600 group-hover:opacity-100"
                      aria-label="Delete task"
                    >
                      <Trash2 size={14} />
                    </button>
                  </li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}

      <TaskFormModal
        key={formOpen ? "open" : "closed"}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={createTask}
      />
    </div>
  );
}
