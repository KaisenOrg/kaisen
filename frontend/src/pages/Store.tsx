import ItemCard from "@/components/specific/store/item-card";

export default function Store() {
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
        <h2
          className="text-lg font-semibold"
          style={{ color: 'var(--foreground)' }}
        >
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
        />
        <ItemCard
          title="Item 2"
          description="Description for item 2 with more details and information. This item is very special and has unique features that make it stand out in the store."
          price={200}
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
  );
}
