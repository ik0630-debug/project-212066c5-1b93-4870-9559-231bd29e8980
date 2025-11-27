import { Skeleton } from "@/components/ui/skeleton";

interface LoadingSkeletonProps {
  type?: "home" | "program" | "location";
}

export const LoadingSkeleton = ({ type = "home" }: LoadingSkeletonProps) => {
  if (type === "program") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-[800px] mx-auto">
          {/* Header Skeleton */}
          <div className="sticky top-0 z-40 bg-primary py-4 px-6 text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-2 bg-primary-foreground/20" />
            <Skeleton className="h-4 w-64 mx-auto bg-primary-foreground/20" />
          </div>

          {/* Hero Image Skeleton */}
          <Skeleton className="w-full h-48 -mt-4" />

          {/* Program Cards Skeleton */}
          <main className="px-6 py-8 space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-card rounded-lg p-5 border border-border">
                <div className="flex items-start gap-4">
                  <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-6 w-full" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                  </div>
                </div>
              </div>
            ))}
          </main>
        </div>
      </div>
    );
  }

  if (type === "location") {
    return (
      <div className="min-h-screen bg-background pb-20">
        <div className="max-w-[800px] mx-auto">
          {/* Header Skeleton */}
          <div className="sticky top-0 z-40 bg-primary py-4 px-6 text-center">
            <Skeleton className="h-8 w-48 mx-auto mb-2 bg-primary-foreground/20" />
            <Skeleton className="h-4 w-64 mx-auto bg-primary-foreground/20" />
          </div>
        </div>

        {/* Hero Image Skeleton */}
        <Skeleton className="w-full h-64" />

        <div className="max-w-[800px] mx-auto">
          <main className="px-6 py-8 space-y-8">
            {/* Description Section Skeleton */}
            <div className="rounded-lg p-6 border border-border">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Location Info Skeleton */}
            <div className="bg-card rounded-lg p-6 border border-border">
              <div className="flex items-start gap-4">
                <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-6 w-48" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-32" />
                </div>
              </div>
            </div>

            {/* Transport Info Skeleton */}
            <div className="space-y-4">
              <Skeleton className="h-6 w-32" />
              {[1, 2].map((i) => (
                <div key={i} className="bg-card rounded-lg p-5 border border-border">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Home type
  return (
    <div className="min-h-screen bg-background pb-20">
      <div className="max-w-[800px] mx-auto">
        <main className="px-6 py-4">
          <div className="space-y-6">
            {/* Hero Image Skeleton */}
            <Skeleton className="w-full h-64 -mx-6 -mt-4" />

            {/* Info Cards Skeleton */}
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="rounded-lg p-5 border border-border">
                  <div className="flex items-start gap-4">
                    <Skeleton className="w-12 h-12 rounded-full flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-5 w-32" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-3/4" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Description Skeleton */}
            <div className="rounded-lg p-6 border border-border">
              <Skeleton className="h-6 w-48 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4" />
            </div>

            {/* Buttons Skeleton */}
            <div className="flex justify-center gap-4">
              <Skeleton className="h-10 w-32" />
              <Skeleton className="h-10 w-32" />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
