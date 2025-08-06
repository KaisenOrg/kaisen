import { Skeleton } from "../ui/skeleton";

export function SkeletonContinueCard(){
    return(
        <div className='p-6 border border-gray-800 shadow shadow-gray-900 animate-pulse rounded-2xl max-w-xs flex flex-col gap-2 w-full'>
              <div className='flex w-full gap-2 items-center'>
                <Skeleton className='h-[30px] w-[30px]'/>
                <Skeleton className='h-[15px] w-full' />
              </div>
              <div className='flex flex-col gap-2'>
                <Skeleton className='w-full h-[15px]' />
                <Skeleton className='w-full h-[15px]' />
              </div>
          </div>
    )
}