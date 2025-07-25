#!/bin/bash

echo "🚀 Iniciando o setup do projeto Kaisen..."

# 1. Solicita a API Key do Gemini
read -p "🔑 Digite sua GEMINI_API_KEY: " GEMINI_API_KEY

# 2. Cria o arquivo env.mo automaticamente
cat <<EOF > backend/env.mo
module {
  public let GEMINI_API_KEY = "$GEMINI_API_KEY";
}
EOF
echo "✅ env.mo criado com sucesso."

# 3. Inicia o DFX em segundo plano
dfx start --background --clean
echo "🟢 DFX iniciado."

# 4. Cria e compila os canisters
dfx canister create --all
dfx build
dfx generate

# 5. Solicita o principal do usuário
read -p "👤 Digite seu principal (output de 'dfx identity get-principal'): " PRINCIPAL

# 6. Deploy do ledger ICRC-1 com argumentos
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

# 7. Deploy do restante
dfx deploy

echo "🎉 Projeto Kaisen configurado com sucesso!"
