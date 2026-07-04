import SectionHeader from "@/components/dashboard/SectionHeader";
import Card from "@/components/dashboard/Card";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// Static July 2026 grid. July 1 2026 falls on a Wednesday (index 3).
const FIRST_WEEKDAY = 3;
const DAYS_IN_MONTH = 31;

const events = {
  3: { label: "React review", tone: "accent" },
  9: { label: "Spanish quiz", tone: "success" },
  16: { label: "System design", tone: "mauve" },
  24: { label: "Finance check-in", tone: "accent" },
};

const eventTone = {
  accent: "bg-accent-50 text-accent-700",
  success: "bg-success-50 text-success-600",
  mauve: "bg-mauve-100 text-mauve-600",
};

export default function Calendar() {
  const cells = [];
  for (let i = 0; i < FIRST_WEEKDAY; i++) cells.push(null);
  for (let d = 1; d <= DAYS_IN_MONTH; d++) cells.push(d);

  return (
    <div>
      <SectionHeader title="July 2026" subtitle="Your study schedule at a glance" />

      <Card padding={false} className="overflow-hidden p-5">
        <div className="grid grid-cols-7 gap-2">
          {WEEKDAYS.map((w) => (
            <div
              key={w}
              className="pb-2 text-center text-xs font-medium uppercase tracking-wide text-mauve-400"
            >
              {w}
            </div>
          ))}

          {cells.map((day, i) => (
            <div
              key={i}
              className={`min-h-[84px] rounded-xl p-2 ${
                day ? "bg-cream-100/70" : ""
              }`}
            >
              {day && (
                <>
                  <span className="text-sm font-medium text-mauve-600">{day}</span>
                  {events[day] && (
                    <div
                      className={`mt-1 truncate rounded-md px-1.5 py-1 text-[11px] font-medium ${
                        eventTone[events[day].tone]
                      }`}
                    >
                      {events[day].label}
                    </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
