import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ItemCardProps {
  title: string;
  description: string;
  price: number;
  onBuy?: () => void;
  imageSrc?: string;
}

export default function ItemCard({
  title = "Lorem ipsum",
  description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do",
  price = 10,
  onBuy,
  imageSrc = "/kai-hidding.svg",
}: ItemCardProps) {
  return (
    <Card className="w-80 bg-card rounded-2xl border-3 border-border shadow-md p-0 flex flex-col items-center justify-between min-h-96 hover:border-primary/35 hover:bg-gradient-to-br hover:from-primary/1 hover:to-primary/2 transition-all duration-300">
      <div className="flex flex-col items-center pt-8 pb-2">
        <div className="relative flex items-center justify-center">
          <img
            src={imageSrc}
            alt="item"
            className="w-32 h-32 object-contain drop-shadow-lg"
            draggable={false}
          />
        </div>
      </div>
      <div className="w-full flex flex-col px-6 pb-4">
        <h3 className="text-white font-bold text-lg mb-1">{title}</h3>
        <p className="text-zinc-400 text-sm leading-snug mb-4 line-clamp-2">{description}</p>
      </div>
      <div className="w-full flex items-center justify-between px-6 pb-6 mt-auto">
        <div className="flex items-center gap-2">
          <img src="/koin.png" alt="Koin" className="w-6 h-6" />
          <span className="text-white font-medium text-base">{price} KOINS</span>
        </div>
        <Button
          variant="outline"
          className="text-orange-400 bg-transparent px-10 py-1 rounded-lg cursor-pointer"
          onClick={onBuy}
        >
          Buy
        </Button>
      </div>
    </Card>
  );
}
