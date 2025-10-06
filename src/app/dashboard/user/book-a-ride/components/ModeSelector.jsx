"use client";
import { Button } from "@/components/ui/button";
import { Car, Settings } from "lucide-react";

const ModeSelector = ({ mode, setMode }) => {
  const modes = [
    {
      id: "auto",
      label: "Auto Mode",
      description: "Automatic ride matching",
      icon: <Car className="w-5 h-5" />,
    },
    {
      id: "manual",
      label: "Manual Mode", 
      description: "Choose your own rider",
      icon: <Settings className="w-5 h-5" />,
    },
  ];

  return (
    <div className="bg-accent/10 rounded-xl p-4 border border-border/20">
      <div className="flex items-center gap-2 mb-3">
        <Settings className="w-5 h-5 text-primary" />
        <h3 className="font-semibold text-foreground">Ride Mode</h3>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {modes.map((modeOption) => (
          <Button
            key={modeOption.id}
            variant={mode === modeOption.id ? "primary" : "outline"}
            onClick={() => setMode(modeOption.id)}
            className={`h-auto p-4 justify-start gap-3 ${
              mode === modeOption.id
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border/20 hover:border-primary/40"
            }`}
          >
            <div className="flex items-center gap-3 w-full">
              {modeOption.icon}
              <div className="text-left">
                <div className="font-semibold text-sm">{modeOption.label}</div>
                <div className={`text-xs ${
                  mode === modeOption.id 
                    ? "text-primary-foreground/80" 
                    : "text-muted-foreground"
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

