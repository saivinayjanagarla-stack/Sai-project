import React from 'react';

export default function Skeleton({ className = 'h-4 w-full rounded-xl' }) {
  return (
    <div className={`skeleton-shimmer ${className}`} />
  );
}

export function CardSkeleton() {
  return (
    <div className="glass-card-light p-5 rounded-3xl border border-slate-200 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-28 rounded-lg" />
        <Skeleton className="h-8 w-8 rounded-2xl" />
      </div>
      <Skeleton className="h-8 w-36 rounded-xl" />
      <Skeleton className="h-3 w-24 rounded-lg" />
    </div>
  );
}
