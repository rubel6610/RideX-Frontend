import { GenericSkeleton } from "./GenericSkeleton";

export function ProfileSkeleton() {
  return (
    <div className="max-w-4xl mx-auto bg-background rounded-2xl shadow-lg p-0 border border-border/20 animate-pulse">
      <div className="flex flex-col items-center pt-10 pb-6 bg-background rounded-t-2xl">
        <GenericSkeleton shape="circle" width="7rem" height="7rem" />
        <GenericSkeleton width="12rem" height="2rem" />
        <GenericSkeleton width="8rem" height="1.25rem" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-8 py-10">
        <div>
          <GenericSkeleton width="10rem" height="1.5rem" />
          <div className="bg-accent/10 rounded-xl border border-border/10 divide-y divide-border/10 p-4">
            <GenericSkeleton count={7} height="1.25rem" />
          </div>
        </div>
        <div>
          <GenericSkeleton width="10rem" height="1.5rem" />
          <div className="bg-accent/10 rounded-xl border border-border/10 divide-y divide-border/10 p-4">
            <GenericSkeleton count={7} height="1.25rem" />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-4 px-8 pb-8">
        <GenericSkeleton width="8rem" height="2.5rem" />
        <GenericSkeleton width="8rem" height="2.5rem" />
      </div>
    </div>
  );
}
