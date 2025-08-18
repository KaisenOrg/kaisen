// frontend/src/components/specific/tracks/nftModal.tsx

import { useState, useEffect } from "react";
import { ArrowDownTrayIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { Button } from "@radix-ui/react-toolbar";

import { useActor } from "@/lib/agent";
// Supondo que você tenha os tipos gerados pelo `dfx`
import type { NFT } from "../../../declarations/nft_certificates/nft_certificates.did";

interface NftModalProps {
    username: string;
    trackName: string;
    timeSpent: bigint;
    onClose: () => void;
}

export default function NftModal({ username, trackName, timeSpent, onClose }: NftModalProps) {
    const nftActor = useActor("nft_certificates");
    // É uma boa prática tipar o estado
    const [svgCode, setSvgCode] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    useEffect(() => {
        const mintAndFetchNFT = async () => {
            if (!nftActor) return;

            try {
                setIsLoading(true);
                const mintResult = await nftActor.mintNFT(username, trackName, timeSpent);
                
                if ('ok' in mintResult) {
                    const nftId = mintResult.ok;
                    
                    // A variável nftDataResult será do tipo [NFT] ou []
                    const nftDataResult: NFT[] = await nftActor.getNFTById(nftId);
                    
                    // --- AQUI ESTÁ A CORREÇÃO ---
                    // 1. Verificamos se o array não está vazio.
                    if (nftDataResult.length > 0) {
                        // 2. Se não estiver vazio, sabemos que nftDataResult[0] é seguro de acessar.
                        const nft = nftDataResult[0]; 
                        setSvgCode(nft.img);
                    } else {
                        // Isso garante que nunca tentaremos acessar um índice inválido.
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
        if (!svgCode) return;
        const blob = new Blob([svgCode], { type: "image/svg+xml" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `certificado-${username}.svg`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4">
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
        </div>
    );
}