import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { PencilIcon } from "@heroicons/react/20/solid";
import { useState } from "react";
import { useUser } from "@/hooks/useUser";
import ItemCard from "@/components/specific/store/item-card";
import { useKoin } from "@/hooks/useKoin";
import { Principal } from "@dfinity/principal";

export default function SettingsProfilePage() {
  const { user } = useUser();
  const [avatarUrl] = useState<string | null>(user?.picture || null);
  const [avatarInitials] = useState(user?.username?.slice(0, 2) || "");

  // Store principal (replace with real one if available)
  const STORE_PRINCIPAL = Principal.fromText("aaaaa-aa");
  const { transfer } = useKoin(user?.principal || null);

  const handleBuy = async () => {
    if (!user?.principal) {
      alert("User not authenticated!");
      return;
    }
    try {
      const amount = BigInt(250_00000000); // 250 koins (assuming 8 decimals)
      await transfer(STORE_PRINCIPAL, amount);
      alert("Compra realizada com sucesso! 250 Koins pagos.");
    } catch (err) {
      alert("Erro ao realizar pagamento: " + (err instanceof Error ? err.message : String(err)));
    }
  };

  return (
    <div className="max-w-7xl mx-auto py-12 px-8">
      <h1 className="text-2xl font-semibold mb-4">Personal information</h1>
      <div className="flex flex-col md:flex-row md:items-start gap-8">
        <form className="flex-1 space-y-6 text-zinc-400">
          <div className="flex gap-8">
            <div className="flex flex-col w-full gap-8">
              <div>
                <label htmlFor="fullName" className="block text-sm font-medium mb-1">Full name</label>
                <Input
                  id="fullName"
                  placeholder="Placeholder"
                  className="bg-zinc-900 border-zinc-800"
                  value={user?.username || ""}
                />
              </div>
              <div>
                <label htmlFor="displayName" className="block text-sm font-medium mb-1">Display name</label>
                <Input
                  id="displayName"
                  placeholder="Placeholder"
                  className="bg-zinc-900 border-zinc-800"
                  value={user?.nickname || ""}
                />
              </div>
            </div>
            <div className="relative w-36 h-36 flex items-center justify-center">
              <Avatar className="w-36 h-36 text-white">
                {avatarUrl ? (
                  <AvatarImage src={avatarUrl} alt="Avatar" />
                ) : (
                  <AvatarFallback className="text-2xl font-medium">{avatarInitials}</AvatarFallback>
                )}
              </Avatar>
              <Button
                type="button"
                size="icon"
                className="absolute bottom-1 right-1 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 p-2 rounded-[40%] shadow-lg"
                aria-label="Edit profile picture"
              >
                <PencilIcon className="w-5 h-5" />
              </Button>
            </div>
          </div>
          <div>
            <label htmlFor="whatDoYouDo" className="block text-sm font-medium mb-1">What do you do?</label>
            <Input
              id="whatDoYouDo"
              placeholder="Placeholder"
              className="bg-zinc-900 border-zinc-800"
              value={user?.role || ""}
            />
          </div>
          <div>
            <label htmlFor="aboutMe" className="block text-sm font-medium mb-1">About me</label>
            <Textarea
              id="aboutMe"
              placeholder="Placeholder"
              className="bg-zinc-900 border-zinc-800 min-h-[96px]"
              value={user?.about || ""}
            />
          </div>
          <div className="flex gap-4 pt-2">
            <Button type="submit" className="bg-orange-500 hover:bg-orange-600 text-white">Save changes</Button>
            <Button type="button" variant="outline" className="border-zinc-700 text-white">Cancel</Button>
          </div>
        </form>
        <div className="flex flex-col items-center gap-4">
        </div>
      </div>

      <ItemCard
        title="Example Item"
        description="This is an example item description that is quite long and should be truncated if it exceeds two lines."
        price={250}
        onBuy={handleBuy}
      />
    </div>
  );
}