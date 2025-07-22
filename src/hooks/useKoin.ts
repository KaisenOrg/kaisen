import { useActor } from "@/lib/agent";
import { Principal } from "@dfinity/principal";
import { useState, useEffect } from "react";

export function useKoin(principal: Principal | null) {
  const koinActor = useActor("icrc1_ledger");
  const [balance, setBalance] = useState<bigint>(0n);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const formattedBalance = Number(balance) / 1e8;

  const fetchBalance = async () => {
    if (!koinActor || !principal) return;

    try {
      setLoading(true);
      setError(null);
      const res = await koinActor.icrc1_balance_of({ owner: principal, subaccount: [] });
      setBalance(res);
    } catch (err) {
      setError("Falha ao carregar saldo");
    } finally {
      setLoading(false);
    }
  };

  const transfer = async (to: Principal, amount: bigint) => {
    if (!koinActor || !principal) return;

    return await koinActor.icrc1_transfer({
      to: { owner: to, subaccount: [] },
      amount,
      fee: [], // usa transfer_fee do token por padrão se passar vazio
      memo: [],
      from_subaccount: [],
      created_at_time: [],
    });
  };

  return { balance, formattedBalance, fetchBalance, transfer, loading, error };
}
