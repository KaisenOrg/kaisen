import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { ArrowDownTrayIcon } from "@heroicons/react/24/outline";
import confetti from "canvas-confetti";

import { useActor } from "@/lib/agent";
import type { NFT } from "../../../declarations/nft_certificates/nft_certificates.did";
import { Button } from "@/components/ui/button";

interface NftModalProps {
  username: string;
  trackName: string;
  timeSpent: bigint;
  onClose: () => void;
}

export default function NftModal({
  username,
  trackName,
  timeSpent,
  onClose,
}: NftModalProps) {
  const nftActor = useActor("nft_certificates");
  const [svgCode, setSvgCode] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const formatTimeInHours = (secondsBigInt: bigint) => {
    const totalSeconds = Number(secondsBigInt);
    if (isNaN(totalSeconds) || totalSeconds === 0) {
      return "0.00";
    }
    const totalHours = totalSeconds / 3600;
    return totalHours.toFixed(2);
  };

  const timeInHours = formatTimeInHours(timeSpent);


  useEffect(() => {
    const mintAndFetchNFT = async () => {
      if (!nftActor) return;
      setIsLoading(true);
      try {
        const mintResult = await nftActor.mintNFT(
          username,
          trackName,
          timeInHours
        );
        if ("ok" in mintResult) {
          const nftId = mintResult.ok;
          const nftDataResult: NFT[] = await nftActor.getNFTById(nftId);
          if (nftDataResult.length > 0) {
            setSvgCode(nftDataResult[0].img);
            confetti({
              particleCount: 300,
              spread: 360,
              origin: { y: 0.5 },
            });
          } else {
            console.error("NFT não encontrado após o mint.");
          }
        } else {
          console.error("Erro ao mintar o NFT:", mintResult.err);
        }
      } catch (error) {
        console.error("Ocorreu um erro:", error);
      } finally {
        setIsLoading(false);
      }
    };
    mintAndFetchNFT();
  }, [nftActor, username, trackName, timeSpent]);

  const handleDownload = () => {
    console.log("Botão de download apertado");
  };

  return createPortal(
    <div className="fixed inset-0 bg-[rgba(0,0,0,0.9)] flex justify-center items-center p-4 z-50">
      <div className="bg-black rounded-lg shadow-xl p-6 w-fit">
        <div className=" rounded-md p-4 mb-4 flex justify-center items-center min-h-[200px]">
          {isLoading ? (
            <p>Gerando seu certificado...</p>
          ) : svgCode ? (
            <div dangerouslySetInnerHTML={{ __html: svgCode }} />
          ) : (
            <p>Não foi possível carregar o certificado.</p>
          )}
        </div>

        {!isLoading && (
          <div className="flex w-full  gap-4">
            <Button
              onClick={handleDownload}
              disabled={!svgCode}
              className="flex items-center gap-2 w-1/2"
            >
              <ArrowDownTrayIcon className="w-5 h-5" /> Download
            </Button>
            <Button
              onClick={onClose}
              className="flex items-center gap-2 w-1/2"
              variant={"outline"}
            >
              Close
            </Button>
          </div>
        )}
      </div>
    </div>,
    document.body
  );
}
