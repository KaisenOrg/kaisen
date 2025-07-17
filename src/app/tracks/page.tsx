'use client'
import { Button } from '@/components/ui/button'
import { DraggableBackground } from '@/components/ui/draggable-bg'
import Link from 'next/link'

export default function TracksPage() {
  const screenHeight = window.innerHeight

  return (
    <article className='flex-1 flex'>
      <DraggableBackground
        className="h-full w-full bg-gradient-to-t from-primary/5 to-transparent select-none"
        canvasWidth={2000}
        canvasHeight={screenHeight * 0.8}
        canvasClassName="place-items-center flex gap-10 p-15 bg-[radial-gradient(theme(colors.gray.600/0.2)_1px,transparent_0)] bg-[length:20px_20px]"
      >

        <Link href="/tracks">
          <div className='relative flex flex-col gap-2 bg-card w-80 p-6 border-2 border-zinc-800 rounded-2xl'>
            <strong>Lorem ipsum</strong>

            <p className='text-sm text-zinc-400'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>

            <Button variant='outline' className='mt-4'>
              Read
            </Button>
          </div>
        </Link>

        <Link href="/tracks">
          <div className='relative flex flex-col gap-2 bg-card w-80 p-6 border-2 border-zinc-800 rounded-2xl'>
            <strong>Lorem ipsum</strong>

            <p className='text-sm text-zinc-400'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>

            <Button variant='outline' className='mt-4'>
              Watch
            </Button>
          </div>
        </Link>

        <Link href="/tracks">
          <div className='relative flex flex-col gap-2 bg-card w-80 p-6 border-2 border-zinc-800 rounded-2xl'>
            <strong>Lorem ipsum</strong>

            <p className='text-sm text-zinc-400'>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua
            </p>

            <Button variant='outline' className='mt-4'>
              Answer
            </Button>
          </div>
        </Link>

      </DraggableBackground>

      <div>
        <p>chat</p>
      </div>
    </article>
  )
}