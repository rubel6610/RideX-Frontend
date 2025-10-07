export default function ComplaintStats({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <div className="bg-accent/20 rounded-lg border p-4">
        <div className="text-2xl font-bold">{stats.total}</div>
        <div className="text-sm text-foreground/50">Total Complaints</div>
      </div>
      <div className="bg-accent/20 rounded-lg border p-4">
        <div className="text-2xl font-bold text-destructive">{stats.pending}</div>
        <div className="text-sm text-foreground/50">Pending</div>
      </div>
      <div className="bg-accent/20 rounded-lg border p-4">
        <div className="text-2xl font-bold text-primary">{stats.inReview}</div>
        <div className="text-sm text-foreground/50">In Review</div>
      </div>
      <div className="bg-accent/20 rounded-lg border p-4">
        <div className="text-2xl font-bold text-green-600">{stats.resolved}</div>
        <div className="text-sm text-foreground/50">Resolved</div>
      </div>
    </div>
  );
}
