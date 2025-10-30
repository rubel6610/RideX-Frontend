export default function ComplaintStats({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-accent/20 rounded-lg border border-accent p-4 sm:p-6">
        <div className="text-xl sm:text-2xl font-bold">{stats.total}</div>
        <div className="text-xs sm:text-sm text-muted-foreground">Total Complaints</div>
      </div>
      <div className="bg-accent/20 rounded-lg border border-accent p-4 sm:p-6">
        <div className="text-xl sm:text-2xl font-bold text-destructive">{stats.pending}</div>
        <div className="text-xs sm:text-sm text-muted-foreground">Pending</div>
      </div>
      <div className="bg-accent/20 rounded-lg border border-accent p-4 sm:p-6">
        <div className="text-xl sm:text-2xl font-bold text-primary">{stats.inReview}</div>
        <div className="text-xs sm:text-sm text-muted-foreground">In Review</div>
      </div>
      <div className="bg-accent/20 rounded-lg border border-accent p-4 sm:p-6">
        <div className="text-xl sm:text-2xl font-bold text-green-600">{stats.resolved}</div>
        <div className="text-xs sm:text-sm text-muted-foreground">Resolved</div>
      </div>
    </div>
  );
}
