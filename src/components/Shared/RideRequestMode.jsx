import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import React from "react";

export default function RideRequestMode({ mode, setMode }) {
  return (
    <div className="mb-2 w-full max-w-xs">
      <label className="block text-sm font-semibold mb-1 text-primary tracking-wide">
        Ride Mode
      </label>
      <Select value={mode} onValueChange={setMode}>
        <SelectTrigger className="w-full border-primary focus:ring-2 focus:ring-primary/60 bg-accent/30 text-primary rounded-lg font-semibold shadow-sm">
          <SelectValue placeholder="Select mode" className="text-primary" />
        </SelectTrigger>
        <SelectContent className="bg-background border-primary text-primary rounded-lg shadow-lg">
          <SelectItem value="auto" className="hover:bg-primary/10 focus:bg-primary/20 text-primary font-medium">
            Auto
          </SelectItem>
          <SelectItem value="manual" className="hover:bg-primary/10 focus:bg-primary/20 text-primary font-medium">
            Manual
          </SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
