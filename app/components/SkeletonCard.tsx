export default function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur animate-pulse">
      {/* Top row: ID + Status */}
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-4 w-8 rounded bg-white/10" />
          <div className="h-4 w-14 rounded-full bg-white/10" />
        </div>
        <div className="h-5 w-20 rounded-full bg-white/10" />
      </div>

      {/* Description */}
      <div className="mb-3 space-y-2">
        <div className="h-4 w-full rounded bg-white/10" />
        <div className="h-4 w-3/4 rounded bg-white/10" />
      </div>

      {/* Details grid */}
      <div className="mb-3 grid grid-cols-2 gap-2">
        <div>
          <div className="h-3 w-16 rounded bg-white/10 mb-1" />
          <div className="h-4 w-24 rounded bg-white/10" />
        </div>
        <div className="text-right">
          <div className="h-3 w-12 rounded bg-white/10 mb-1 ml-auto" />
          <div className="h-4 w-20 rounded bg-white/10 ml-auto" />
        </div>
      </div>

      {/* Bottom row */}
      <div className="border-t border-white/5 pt-3 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-white/10" />
        <div className="h-3 w-3 rounded bg-white/10" />
      </div>
    </div>
  );
}
