import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export default function SociosLoading() {
  return (
    <div className="mx-auto max-w-7xl space-y-6 p-4">
      {/* Header Skeleton */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64" />
          <Skeleton className="h-4 w-96" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Stats Cards Skeleton */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 w-48" />
            <Skeleton className="h-10 w-48" />
          </div>
        </CardContent>
      </Card>

      {/* Table Skeleton */}
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Table Header */}
            <div className="grid grid-cols-7 gap-4 pb-2 border-b">
              {Array.from({ length: 7 }).map((_, i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
            
            {/* Table Rows */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-4 py-3">
                {Array.from({ length: 7 }).map((_, colIndex) => (
                  <div key={colIndex} className="space-y-2">
                    {colIndex === 1 ? (
                      <>
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </>
                    ) : colIndex === 6 ? (
                      <div className="flex space-x-2">
                        <Skeleton className="h-8 w-8" />
                        <Skeleton className="h-8 w-8" />
                      </div>
                    ) : (
                      <Skeleton className="h-4 w-20" />
                    )}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
