import { Check, Plus } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Card from "@/components/dashboard/Card";
import { taskGroups } from "@/lib/mockData";

export default function Tasks() {
  return (
    <div>
      <SectionHeader
        title="Tasks"
        subtitle="Track what you need to study and review"
        action={
          <button className="btn-primary">
            <Plus size={18} /> New task
          </button>
        }
      />

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
                  key={task.id}
                  className="flex items-center gap-3 rounded-xl bg-cream-100/70 px-3 py-2.5"
                >
                  <span
                    className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition ${
                      task.done
                        ? "border-accent-500 bg-accent-500 text-white"
                        : "border-mauve-300 bg-surface"
                    }`}
                  >
                    {task.done && <Check size={13} />}
                  </span>
                  <span
                    className={`text-sm ${
                      task.done ? "text-mauve-400 line-through" : "text-mauve-700"
                    }`}
                  >
                    {task.text}
                  </span>
                </li>
              ))}
            </ul>
          </Card>
        ))}
      </div>
    </div>
  );
}
