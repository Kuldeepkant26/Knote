import { ExternalLink, Plus, Bookmark } from "lucide-react";
import SectionHeader from "@/components/dashboard/SectionHeader";
import Card from "@/components/dashboard/Card";
import Badge from "@/components/ui/Badge";
import { bookmarks } from "@/lib/mockData";

export default function Bookmarks() {
  return (
    <div>
      <SectionHeader
        title="Bookmarks"
        subtitle="Saved links and resources per subject"
        action={
          <button className="btn-primary">
            <Plus size={18} /> Add bookmark
          </button>
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {bookmarks.map((bm) => (
          <Card key={bm.id} className="flex items-start gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent-50 text-accent-600">
              <Bookmark size={18} />
            </span>
            <div className="min-w-0 flex-1">
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-medium text-mauve-800">{bm.title}</h3>
                <ExternalLink size={15} className="mt-0.5 shrink-0 text-mauve-300" />
              </div>
              <p className="mt-0.5 truncate text-sm text-mauve-400">{bm.url}</p>
              <div className="mt-2">
                <Badge tone="mauve">{bm.subject}</Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
