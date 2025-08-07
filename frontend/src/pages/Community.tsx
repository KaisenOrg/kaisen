import { useEffect, useState } from "react"
import { PostCard } from "@/components/specific/community/post-card"
import { SkeletonPostCard } from "@/components/specific/community/skeleton-post-card"

export default function CommunityPage() {
  const [loading, setLoading] = useState(true)

  // Dados mockados para simular conteúdo vindo do backend
  const mockPosts = Array(4).fill({
    avatarInitials: "GT",
    username: "Goat",
    handle: "goat",
    content: `Acabei de migrar um projeto React GIGANTE de create-react-app para Vite e os resultados foram:

✅ npm start: De 32s para 400ms (sim, demorava 30s)
✅ npm build: De 120s para 22s

Além disso, troquei do Yarn para o PNPM e o install das deps mudou de 24s para 8s 🔥`,
    comments: 32,
    retweets: 32,
    likes: 32,
  })

  useEffect(() => {
    // Simula carregamento
    const timeout = setTimeout(() => {
      setLoading(false)
    }, 2000)

    return () => clearTimeout(timeout)
  }, [])

  return (
    <main className="max-w-7xl mx-auto px-8 py-2 flex flex-col items-start gap-4">
      <h2 className="text-lg font-semibold mt-2">Community</h2>

      <div className="mt-2 flex flex-col gap-4 w-full">
        {loading
          ? Array(4).fill(0).map((_, index) => <SkeletonPostCard key={index} />)
          : mockPosts.map((post, index) => (
              <PostCard key={index} {...post} />
            ))}
      </div>
    </main>
  )
}
