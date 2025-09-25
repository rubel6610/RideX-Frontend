import ProtectedRoute from "../hooks/ProtectedRoute";

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <div>
      <h1 className="text-3xl font-bold mb-4">Welcome Back, John!</h1>
      <p className="text-muted-foreground">Here's what's happening with your rides today</p>
      {/* Your stat cards, charts, etc */}
    </div>
    </ProtectedRoute>
    
  );
}
