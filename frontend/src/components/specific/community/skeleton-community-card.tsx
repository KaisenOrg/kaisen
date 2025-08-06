import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCommunityCard(){
    return(
        <div className='p-6 border border-gray-800 shadow-gray-900 animate-pulse max-w-xs w-full rounded-2xl'>
              <div className='flex w-full gap-2 items-center'>
                <Skeleton className='h-[30px] w-[30px]'/>
                <Skeleton className='h-[15px] w-2/3' />
              </div>
              <div className='flex flex-col mt-2 gap-2'>
                <Skeleton className='h-[15px] w-full' />  
                <Skeleton className='h-[15px] w-2/3' />  
                <Skeleton className='h-[10px] w-1/3' />  
              </div>
              <div className='flex justify-end gap-2'>
                <Skeleton className='h-[30px] w-[30px]'/>
                <Skeleton className='h-[30px] w-[30px]'/>
              </div>
            </div>
    )
}