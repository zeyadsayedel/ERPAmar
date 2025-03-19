import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function PermissionSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Skeleton className="h-9 w-[150px]" />
      </div>

      <div className="grid gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <Skeleton className="h-6 w-[150px] mb-2" />
                <Skeleton className="h-4 w-[100px]" />
              </div>
              <Skeleton className="h-8 w-[100px]" />
            </div>

            <div className="flex flex-wrap gap-2">
              {[1, 2, 3, 4, 5].map((j) => (
                <Skeleton key={j} className="h-6 w-[80px]" />
              ))}
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}