"use client";
import { Button } from "@/components/ui/button";
import { Car, Settings } from "lucide-react";

const ModeSelector = ({ mode, setMode }) => {
  const modes = [
    {
      id: "auto",
      label: "Auto Mode",
      description: "Automatic ride",
      icon: <Car className="w-5 h-5" />,
    },
    {
      id: "manual",
      label: "Manual Mode", 
      description: "Own rider",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Choose A Ride Mode</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {modes.map((modeOption) => (
          <Button
            key={modeOption.id}
            variant={mode === modeOption.id ? "primary" : "outline"}
            onClick={() => setMode(modeOption.id)}
            className={`h-auto p-4 justify-start gap-3 ${
              mode === modeOption.id
                ? "border border-border bg-primary/40 text-foreground"
                : "text-primary-foreground border-border "
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              {modeOption.icon}
              <div className="text-left">
                <div className="font-semibold text-sm">{modeOption.label}</div>
                <div className={`text-xs ${
                  mode === modeOption.id 
                    ? "text-foreground" 
                    : "text-primary-foreground"
                }`}>
                  {modeOption.description}
                </div>
              </div>
            </div>
          </Button>
        ))}
      </div>
      
      {mode === "manual" && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center gap-2 text-yellow-800">
            <Settings className="w-4 h-4" />
            <span className="font-medium text-sm">
              Manual mode implementation coming soon!
            </span>
          </div>
          <p className="text-xs text-yellow-700 mt-1">
            এইখানে কোনো manual mood implement করা হয়নি। upcoming।
          </p>
        </div>
      )}
    </div>
  );
};

export default ModeSelector;

