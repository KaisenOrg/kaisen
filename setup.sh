#!/bin/bash

echo "🚀 Iniciando o setup do projeto Kaisen..."

# Verifica se o dfx está instalado
command -v dfx >/dev/null 2>&1 || {
  echo "❌ DFX não encontrado. Instale com: sh -ci \"\$(curl -fsSL https://sdk.dfinity.org/install.sh)\""
  exit 1
}

# 1. Solicita a API Key do Gemini
read -p "🔑 Digite sua GEMINI_API_KEY: " GEMINI_API_KEY
if [ -z "$GEMINI_API_KEY" ]; then
  echo "❌ API KEY não informada. Encerrando..."
  exit 1
fi

# 2. Solicita o principal do usuário
read -p "👤 Digite seu principal (output de 'dfx identity get-principal'): " PRINCIPAL
if [ -z "$PRINCIPAL" ]; then
  echo "❌ Principal não informado. Encerrando..."
  exit 1
fi

# 3. Cria o arquivo env.mo automaticamente
cat <<EOF > backend/env.mo
module {
  public let GEMINI_API_KEY = "$GEMINI_API_KEY";
}
EOF
echo "✅ env.mo criado com sucesso."

# 4. Inicia o DFX em segundo plano
dfx start --background --clean
echo "🟢 DFX iniciado."

# 5. Cria e compila os canisters
dfx canister create --all
dfx build
dfx generate

# 6. Instala e compila o frontend
cd frontend
npm install
cd ..

# 7. Deploy do ledger ICRC-1 com argumentos
dfx deploy icrc1_ledger --argument "(variant { Init = record {
  token_symbol = \"KAI\";
  token_name = \"Koin\";
  minting_account = record { owner = principal \"$PRINCIPAL\" };
  transfer_fee = 10_000;
  initial_balances = vec { record { record { owner = principal \"$PRINCIPAL\" }; 100_000_000_000 } };
  metadata = vec {};
  archive_options = record {
    num_blocks_to_archive = 1000;
    trigger_threshold = 2000;
    controller_id = principal \"$PRINCIPAL\"
  }
} })"

# 8. Deploy do restante
dfx deploy

cd frontend
npm run build

dfx deploy kaisen_frontend

echo "🎉 Projeto Kaisen configurado com sucesso!"
