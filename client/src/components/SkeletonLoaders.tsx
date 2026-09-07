/**
 * Token-based loading skeletons for data-heavy routes.
 * Their shapes mirror final layout while retaining the shared warm luxury palette.
 */

function SkeletonBlock({ className = "" }: { className?: string }) {
  return <div className={`rounded bg-muted ${className}`} aria-hidden="true" />;
}

function PageSkeleton({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`min-h-screen animate-pulse bg-background p-4 ${className}`}>{children}</div>;
}

export function WatchCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-lg bg-card animate-pulse">
      <SkeletonBlock className="aspect-square" />
      <div className="space-y-3 p-4">
        <SkeletonBlock className="h-4 w-3/4" />
        <SkeletonBlock className="h-4 w-1/2" />
        <SkeletonBlock className="h-3 w-full" />
        <SkeletonBlock className="h-3 w-4/5" />
      </div>
    </div>
  );
}

export function WatchGridSkeleton({ count = 12 }: { count?: number }) {
  return <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{Array.from({ length: count }).map((_, index) => <WatchCardSkeleton key={index} />)}</div>;
}

export function WatchDetailSkeleton() {
  return (
    <PageSkeleton>
      <div className="mx-auto max-w-7xl space-y-8 py-8">
        <SkeletonBlock className="h-8 w-1/2" />
        <div className="grid gap-8 md:grid-cols-2">
          <SkeletonBlock className="aspect-square" />
          <div className="space-y-4">
            <SkeletonBlock className="h-6 w-3/4" />
            <SkeletonBlock className="h-4 w-full" />
            <SkeletonBlock className="h-4 w-5/6" />
            <div className="space-y-2 pt-4">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="flex justify-between"><SkeletonBlock className="h-4 w-1/3" /><SkeletonBlock className="h-4 w-1/2" /></div>)}</div>
          </div>
        </div>
      </div>
    </PageSkeleton>
  );
}

export function CollectionSkeleton() {
  return <PageSkeleton className="space-y-8"><div className="flex gap-2 overflow-x-auto pb-4">{Array.from({ length: 5 }).map((_, index) => <SkeletonBlock key={index} className="h-10 w-24 shrink-0 rounded-full" />)}</div><WatchGridSkeleton count={12} /></PageSkeleton>;
}

export function CompareSkeleton() {
  return <PageSkeleton className="space-y-8"><SkeletonBlock className="h-8 w-1/2" /><div className="space-y-4">{Array.from({ length: 8 }).map((_, index) => <div key={index} className="grid grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, column) => <SkeletonBlock key={column} className="h-12" />)}</div>)}</div></PageSkeleton>;
}

export function GallerySkeleton() {
  return <PageSkeleton className="space-y-8"><SkeletonBlock className="aspect-video" /><div className="flex gap-4 overflow-x-auto">{Array.from({ length: 6 }).map((_, index) => <SkeletonBlock key={index} className="h-20 w-20 shrink-0" />)}</div><div className="space-y-3"><SkeletonBlock className="h-4 w-full" /><SkeletonBlock className="h-4 w-5/6" /><SkeletonBlock className="h-4 w-4/5" /></div></PageSkeleton>;
}

export function TimelineSkeleton() {
  return <PageSkeleton className="space-y-8">{Array.from({ length: 5 }).map((_, index) => <div key={index} className="flex gap-4"><SkeletonBlock className="h-24 w-24 shrink-0" /><div className="flex-1 space-y-2"><SkeletonBlock className="h-4 w-1/2" /><SkeletonBlock className="h-3 w-full" /><SkeletonBlock className="h-3 w-5/6" /></div></div>)}</PageSkeleton>;
}

export function AdminTableSkeleton() {
  return <div className="space-y-4 animate-pulse"><div className="grid grid-cols-5 gap-4 border-b border-border pb-4">{Array.from({ length: 5 }).map((_, index) => <SkeletonBlock key={index} className="h-4" />)}</div>{Array.from({ length: 8 }).map((_, row) => <div key={row} className="grid grid-cols-5 gap-4">{Array.from({ length: 5 }).map((_, column) => <SkeletonBlock key={column} className="h-4" />)}</div>)}</div>;
}

export function SearchResultsSkeleton() {
  return <PageSkeleton className="space-y-4"><SkeletonBlock className="h-12" /><div className="space-y-4">{Array.from({ length: 6 }).map((_, index) => <div key={index} className="flex gap-4 rounded-lg bg-card p-4"><SkeletonBlock className="h-24 w-24 shrink-0" /><div className="flex-1 space-y-2"><SkeletonBlock className="h-4 w-3/4" /><SkeletonBlock className="h-3 w-full" /><SkeletonBlock className="h-3 w-1/2" /></div></div>)}</div></PageSkeleton>;
}
