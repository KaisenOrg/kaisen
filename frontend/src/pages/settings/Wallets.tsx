import { Button } from "@/components/ui/button";
import { ExpandableText } from "@/components/ui/expandable-text";

export default function WalletsPage() {
  return (
    <div className="max-w-7xl mx-auto py-12 px-8">
      <h1 className="text-2xl font-semibold mb-4">Wallets</h1>
      <div className="mb-6">
        <h2 className="text-base font-medium text-zinc-400 mb-2">
          Connected wallets
        </h2>
        <div className="p-10 gap-y-5 border-input dark:bg-input/30 flex items-center justify-center flex-col field-sizing-content min-h-16 w-full rounded-md border bg-transparent text-base shadow-xs outline-none md:text-sm">
          <h3 className="text-base font-normal">No wallets connected</h3>
          <h4 className="text-xs font-regular text-zinc-400 w-sm text-center">
            Connect a wallet to manage your digital assets and interact with
            decentralized applications
          </h4>
          <Button variant="tertiary" size="lg">
            Connect wallets
          </Button>
        </div>
      </div>
      <div className="mb-6 flex flex-col items-center justify-cente gap-y-6">
        <ExpandableText title="View wallet balance">
          Aqui está o balanço da sua carteira.
        </ExpandableText>
        <ExpandableText title="View transaction history">
          Aqui está seu histórico de transações com valores e datas.
        </ExpandableText>
      </div>
    </div>
  );
}
