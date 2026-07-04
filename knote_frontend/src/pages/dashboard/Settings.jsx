import { useAuthStore } from "@/stores/authStore";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Card from "@/components/dashboard/Card";
import Avatar from "@/components/ui/Avatar";
import Button from "@/components/ui/Button";

export default function Settings() {
  const user = useAuthStore((s) => s.user);

  return (
    <div className="max-w-2xl space-y-8">
      {/* Profile */}
      <div>
        <SectionHeader title="Profile" subtitle="Your account information" />
        <Card className="space-y-5">
          <div className="flex items-center gap-4">
            <Avatar name={user?.name} size="lg" />
            <div>
              <p className="font-medium text-mauve-800">{user?.name}</p>
              <p className="text-sm text-mauve-400">{user?.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label">Name</label>
              <input className="input" defaultValue={user?.name || ""} />
            </div>
            <div>
              <label className="field-label">Email</label>
              <input className="input" defaultValue={user?.email || ""} readOnly />
            </div>
          </div>

          <div className="flex justify-end">
            <Button>Save changes</Button>
          </div>
        </Card>
      </div>

      {/* Preferences */}
      <div>
        <SectionHeader title="Preferences" subtitle="Customize your experience" />
        <Card padding={false} className="divide-y divide-mauve-100">
          <PreferenceRow
            title="Email notifications"
            desc="Get notified about reminders and updates"
            enabled
          />
          <PreferenceRow
            title="Weekly digest"
            desc="A summary of your study activity every Monday"
          />
        </Card>
      </div>
    </div>
  );
}

function PreferenceRow({ title, desc, enabled = false }) {
  return (
    <div className="flex items-center justify-between px-6 py-4">
      <div>
        <p className="font-medium text-mauve-800">{title}</p>
        <p className="text-sm text-mauve-400">{desc}</p>
      </div>
      <span
        className={`flex h-6 w-11 items-center rounded-full p-0.5 transition ${
          enabled ? "bg-accent-500" : "bg-mauve-200"
        }`}
      >
        <span
          className={`h-5 w-5 rounded-full bg-white shadow-sm transition ${
            enabled ? "translate-x-5" : ""
          }`}
        />
      </span>
    </div>
  );
}
