import React from "react";

export default function DashboardLayout({ children }) {
  return (
    <div className="max-w-[1440px] mx-auto min-h-screen bg-background">
      {/* All dashboard content will be rendered here, without navbar or footer */}
      {children}
    </div>
  );
}
