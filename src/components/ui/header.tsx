"use client";

import Image from "next/image";
import { useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Bars3BottomLeftIcon, BellIcon } from "@heroicons/react/24/outline";
import { ActionSearchBar } from "../general/search-bar";
import { Popover, PopoverTrigger, PopoverContent } from "./popover";
import { useDevAuth } from "@/providers/dev-auth";
import { useKoin } from "@/hooks/useKoin";
import { Principal } from "@dfinity/principal";

export default function Header() {
  const { principal } = useDevAuth();

  const {
    formattedBalance: koinBalance,
    balance,
    fetchBalance,
    transfer,
    loading,
    error
  } = useKoin(principal || null);

  useEffect(() => {
    if (principal) {
      fetchBalance();
    }
  }, [principal]);

  const handleTestTransfer = async () => {
    try {
      const receiver = principal!; // Substitua pelo destinatário real
      const amount = BigInt(1_000_000_000); // 0.0001 Koin

      await transfer(receiver, amount);
      alert("Transferência realizada!");
      fetchBalance();
      console.log(balance, koinBalance)
    } catch (e) {
      console.error(e);
      alert("Erro na transferência");
    }
  };

  return (
    <header className="flex items-center h-1/11 px-4 border-b bg-background">
      {/* Left side: Menu and Logo */}
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Bars3BottomLeftIcon style={{ width: 24, height: 24 }} />
        </Button>
        <div className="flex items-center">
          <Image
            src="/logo-text.svg"
            alt="Kaizen Logo"
            width={100}
            height={40}
            className="h-auto"
          />
        </div>
      </div>

      {/* Center: Search Input */}
      <div className="flex-1 flex justify-center">
        <div className="w-full max-w-2xl">
          <ActionSearchBar />
        </div>
      </div>

      {/* Right side: Notifications and User Avatar */}
      <div className="flex items-center gap-4">

        {/* Tokenomics Popover */}
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="icon"
              className="w-fit p-2 h-10 gap-2 border border-border bg-popover hover:bg-accent/60 transition shadow-sm"
            >
              <span className="sr-only">Koin</span>
              <Image
                src="/koin.png"
                alt="Koin Icon"
                width={24}
                height={24}
                className="drop-shadow-sm"
              />
              <span className="text-sm font-semibold text-foreground">
                {loading ? "..." : koinBalance}
              </span>
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-80 max-w-full rounded-xl shadow-lg border border-border bg-popover flex flex-col p-0" side="bottom" align="end">
            <div className="flex flex-row items-center gap-2 p-5 pb-4">
              <span className="text-2xl font-bold text-foreground">
                {loading ? "Carregando..." : `${koinBalance} Koin`}
              </span>
              <Image src="/koin.png" alt="Koin Icon" width={24} height={24} className="drop-shadow-sm align-middle" style={{ marginBottom: 2 }} />
            </div>

            {error && (
              <div className="px-5 pb-2 text-sm text-red-500">
                {error}
              </div>
            )}

            <div className="px-5 pb-4 flex flex-col gap-2">
              <Button
                variant="secondary"
                className="w-full bg-primary/5 hover:bg-primary/10 font-semibold px-6 py-2 rounded-lg border border-primary/20 shadow-none"
                onClick={fetchBalance}
              >
                Fetch balance
              </Button>
              <Button
                variant="secondary"
                className="w-full bg-primary/5 hover:bg-primary/10 font-semibold px-6 py-2 rounded-lg border border-primary/20 shadow-none"
                onClick={handleTestTransfer}
              >
                Test transfer
              </Button>
            </div>

            <div className="px-5 pb-4">
              <span className="text-xs text-muted-foreground block text-left">
                Koins are your in-app currency. Earn more by completing tracks, challenges, or invite friends!
              </span>
            </div>
          </PopoverContent>
        </Popover>

        <Button variant="outline" size="icon" className="w-10 h-10">
          <BellIcon style={{ width: 24, height: 24 }} />
          <span className="sr-only">Notifications</span>
        </Button>

        <Avatar className="w-10 h-10">
          <AvatarImage src="https://github.com/shadcn.png" alt="@cn" />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
