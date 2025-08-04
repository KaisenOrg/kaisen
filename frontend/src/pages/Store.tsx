import { Principal } from '@dfinity/principal'
import { useKoin } from '@/hooks/useKoin'
import { useUser } from '@/hooks/useUser'
import ItemCard from '@/components/specific/store/item-card'

export default function Store() {

  const { user } = useUser()
  const STORE_PRINCIPAL = Principal.fromText('aaaaa-aa')
  const { transfer } = useKoin(user?.principal || null)

  const handleBuy = async () => {
    if (!user?.principal) {
      alert('User not authenticated!')
      return
    }
    try {
      const amount = BigInt(200_00000000)
      await transfer(STORE_PRINCIPAL, amount)
      alert('Compra realizada com sucesso! 250 Koins pagos.')
    } catch (err) {
      alert('Erro ao realizar pagamento: ' + (err instanceof Error ? err.message : String(err)))
    }
  }

  return (
    <main
      className="max-w-7xl mx-auto px-8"
      style={{
        background: 'var(--background)',
        color: 'var(--foreground)',
        minHeight: '100vh',
        transition: 'background 0.3s, color 0.3s',
      }}
    >

      <div className="mt-6">
        <h2 className="text-lg font-semibold" style={{ color: 'var(--foreground)' }}>
          Kai's Store
        </h2>
        <h3
          className="text-sm font-medium"
          style={{ color: 'var(--muted-foreground)' }}
        >
          Exchange your KOINS for incredible items!
        </h3>
      </div>

      <div className="mt-4 flex flex-wrap gap-3 w-full">
        <ItemCard
          title="Item 1"
          description="Description for item 1"
          price={100}
          onBuy={handleBuy}
        />
        <ItemCard
          title="Item 2"
          description="Description for item 2 with more details and information. This item is very special and has unique features that make it stand out in the store."
          price={200}
          onBuy={handleBuy}
          imageSrc="/kai-sitting.svg"
        />
        <ItemCard
          title="Item 3"
          description="Description for item 3"
          price={300}
          imageSrc="/kai-hidding.svg"
        />
      </div>
    </main>
  )
}
