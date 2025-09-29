import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import React from "react";

export default function RideRequestMode({ mode, setMode }) {
  return (
    <div className="mb-2 w-full max-w-xs">
      <label className="block text-sm font-medium text-foreground mb-1">Select Ride Mode</label>
      <Select value={mode} onValueChange={setMode}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Select mode" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="auto">Auto</SelectItem>
          <SelectItem value="manual">Manual</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
