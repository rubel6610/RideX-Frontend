import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function ComplaintFilters({ searchTerm, setSearchTerm }) {
  return (
    <div className="bg-background rounded-lg border border-accent p-4">
      <div className="flex flex-col lg:flex-row gap-4 items-end">
        <div className="flex-1">
          <label className="text-sm font-medium mb-2 block">Search</label>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search complaints..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
