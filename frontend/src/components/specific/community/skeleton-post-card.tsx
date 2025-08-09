import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonPostCard(){
    return (
        <div className="flex flex-col w-2/3">
                <div className='flex justify-start p-3 px-4 gap-3'>
                <Skeleton className='w-[40px] h-[40px] rounded-full ' />
        
                <div className='w-full flex flex-col pt-3 gap-4'>
                    <Skeleton className=" w-1/3 h-[18px]"/>
                    <Skeleton className='w-full h-[18px]' />
                    <Skeleton className='w-2/3 h-[18px]' />
                    <div className='w-1/6 flex flex-row justify-between'>
                    <Skeleton className='w-[30px] h-[10px]' />
                    <Skeleton className='w-[30px] h-[10px]' />
                    <Skeleton className='w-[30px] h-[10px]' />
                    </div>
                </div>
                </div>
            </div>

    )
} 