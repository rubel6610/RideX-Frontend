import { Button } from "@/components/ui/button";

export default function ComplaintTabs({ currentTab, setCurrentTab }) {
  const tabs = ["all", "pending", "resolved"];

  return (
    <div className="flex gap-2 mb-4">
      {tabs.map((tab) => (
        <Button
          key={tab}
          variant={currentTab === tab ? "default" : "outline"}
          onClick={() => setCurrentTab(tab)}
        >
          {tab === "all" && "All Complaints"}
          {tab === "pending" && "Pending Complaints"}
          {tab === "resolved" && "Resolved Complaints"}
        </Button>
      ))}
    </div>
  );
}