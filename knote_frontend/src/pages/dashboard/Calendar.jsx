import { useEffect, useMemo, useState } from "react";
import {
  startOfMonth,
  getDaysInMonth,
  getDay,
  addMonths,
  subMonths,
  isSameMonth,
  getDate,
  format,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCalendarEventsStore } from "@/stores/calendarEventsStore";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Card from "@/components/dashboard/Card";
import Button from "@/components/ui/Button";
import { CalendarSkeleton } from "@/components/dashboard/PageSkeletons";
import CalendarEventFormModal from "@/components/dashboard/CalendarEventFormModal";
import ConfirmDialog from "@/components/ui/ConfirmDialog";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const eventTone = {
  accent: "bg-accent-50 text-accent-700",
  success: "bg-success-50 text-success-600",
  mauve: "bg-mauve-100 text-mauve-600",
};

function toISODate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export default function Calendar() {
  const { events, listLoaded, listLoading, fetchEvents, createEvent, updateEvent, deleteEvent } =
    useCalendarEventsStore();

  const [cursor, setCursor] = useState(new Date());
  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [createDate, setCreateDate] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (!listLoaded) fetchEvents();
  }, [listLoaded, fetchEvents]);

  const eventsByDay = useMemo(() => {
    const map = {};
    for (const e of events) {
      const eventDate = new Date(e.date);
      if (!isSameMonth(eventDate, cursor)) continue;
      const day = getDate(eventDate);
      if (!map[day]) map[day] = [];
      map[day].push(e);
    }
    return map;
  }, [events, cursor]);

  const cells = useMemo(() => {
    const monthStart = startOfMonth(cursor);
    const daysInMonth = getDaysInMonth(cursor);
    const firstWeekday = getDay(monthStart);
    const list = [];
    for (let i = 0; i < firstWeekday; i++) list.push(null);
    for (let d = 1; d <= daysInMonth; d++) list.push(d);
    return list;
  }, [cursor]);

  const openCreate = (day) => {
    const date = new Date(cursor.getFullYear(), cursor.getMonth(), day);
    setEditing(null);
    setCreateDate(toISODate(date));
    setFormOpen(true);
  };

  const openEdit = (e, event) => {
    e.stopPropagation();
    setEditing(event);
    setCreateDate(null);
    setFormOpen(true);
  };

  const handleSubmit = async (values) => {
    if (editing) await updateEvent(editing._id, values);
    else await createEvent(values);
  };

  const requestDelete = (event) => {
    setFormOpen(false);
    setDeleting(event);
  };

  if (listLoading && !listLoaded) {
    return (
      <div>
        <SectionHeader title="Calendar" subtitle="Your study schedule at a glance" />
        <CalendarSkeleton />
      </div>
    );
  }

  return (
    <div>
      <SectionHeader
        title={format(cursor, "MMMM yyyy")}
        subtitle="Your study schedule at a glance"
        action={
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCursor(new Date())}
              className="btn-ghost px-3 py-1.5 text-sm"
            >
              Today
            </button>
            <button
              onClick={() => setCursor((c) => subMonths(c, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-mauve-500 transition hover:bg-mauve-50"
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={() => setCursor((c) => addMonths(c, 1))}
              className="flex h-9 w-9 items-center justify-center rounded-lg text-mauve-500 transition hover:bg-mauve-50"
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        }
      />

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
              onClick={() => day && openCreate(day)}
              className={`min-h-21 rounded-xl p-2 ${
                day ? "cursor-pointer bg-cream-100/70 transition hover:bg-mauve-50" : ""
              }`}
            >
              {day && (
                <>
                  <span className="text-sm font-medium text-mauve-600">{day}</span>
                  <div className="mt-1 space-y-1">
                    {(eventsByDay[day] || []).slice(0, 3).map((ev) => (
                      <button
                        key={ev._id}
                        onClick={(e) => openEdit(e, ev)}
                        className={`block w-full truncate rounded-md px-1.5 py-1 text-left text-[11px] font-medium ${
                          eventTone[ev.tone] || eventTone.accent
                        }`}
                      >
                        {ev.title}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </Card>

      <CalendarEventFormModal
        key={`${formOpen ? "open" : "closed"}-${editing?._id || createDate || "new"}`}
        open={formOpen}
        onClose={() => setFormOpen(false)}
        onSubmit={handleSubmit}
        onRequestDelete={requestDelete}
        event={editing}
        defaultDate={createDate}
      />

      <ConfirmDialog
        open={!!deleting}
        onClose={() => setDeleting(null)}
        onConfirm={() => deleteEvent(deleting._id)}
        title="Delete event?"
        message={`"${deleting?.title}" will be permanently deleted.`}
        confirmLabel="Delete event"
      />
    </div>
  );
}
