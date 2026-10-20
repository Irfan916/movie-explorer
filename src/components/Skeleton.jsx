export default function Skeleton() {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden animate-pulse">
      <div className="aspect-2/3 bg-slate-200 dark:bg-slate-700" />
      <div className="p-3 space-y-2">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4" />
        <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/3" />
      </div>
    </div>
  );
}