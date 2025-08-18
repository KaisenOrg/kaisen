// frontend/src/components/specific/tracks/nftModal.tsx

import { useState, useEffect } from "react";
import { createPortal } from "react-dom"; // 1. Importe o createPortal
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";

import { useActor } from "@/lib/agent";
import type { NFT } from "../../../declarations/nft_certificates/nft_certificates.did";
import { Button } from "@/components/ui/button";

interface NftModalProps {
    username: string;
    trackName: string;
    timeSpent: bigint;
    onClose: () => void;
}

export default function NftModal({ username, trackName, timeSpent, onClose }: NftModalProps) {
    const nftActor = useActor("nft_certificates");
    const [svgCode, setSvgCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    // Lógica para buscar o NFT (permanece a mesma)
    useEffect(() => {
        const mintAndFetchNFT = async () => {
            if (!nftActor) return;
            setIsLoading(true);
            try {
                const mintResult = await nftActor.mintNFT(username, trackName, timeSpent);
                if ('ok' in mintResult) {
                    const nftId = mintResult.ok;
                    const nftDataResult: NFT[] = await nftActor.getNFTById(nftId);
                    if (nftDataResult.length > 0) {
                        setSvgCode(nftDataResult[0].img);
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

    // 3. Envolva todo o JSX com createPortal
    return createPortal(
        // 2. Adicione a classe z-50 para garantir a sobreposição
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
            <div className="bg-white rounded-lg shadow-xl p-6 max-w-lg w-full">
                <h2 className="text-xl font-bold mb-4">Seu Certificado NFT! 📜</h2>
                
                <div className="border rounded-md p-4 mb-4 flex justify-center items-center min-h-[200px]">
                    {isLoading ? (
                        <p>Gerando seu certificado...</p>
                    ) : svgCode ? (
                        <div dangerouslySetInnerHTML={{ __html: svgCode }} />
                    ) : (
                        <p>Não foi possível carregar o certificado.</p>
                    )}
                </div>

                <div className="flex justify-end gap-4">
                    <Button onClick={handleDownload} disabled={!svgCode || isLoading} className="flex items-center gap-2">
                        <ArrowDownTrayIcon className="w-5 h-5" /> Download
                    </Button>
                    <Button onClick={onClose} className="flex items-center gap-2">
                         <XMarkIcon className="w-5 h-5" /> Fechar
                    </Button>
                </div>
            </div>
        </div>,
        document.body // O portal será renderizado no final do <body>
    );
}