import { Skeleton } from '../../../components/ui/Skeleton';

export const NewsCardSkeleton = () => {
    return (
        <div className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 p-0">
            <Skeleton className="h-72 w-full rounded-none" />
            <div className="p-8 space-y-4">
                <Skeleton className="h-4 w-24 rounded-full" />
                <Skeleton className="h-8 w-full rounded-xl" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-5/6" />
                </div>
            </div>
        </div>
    );
};