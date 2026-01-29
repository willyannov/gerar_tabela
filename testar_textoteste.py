import re

# Ler o arquivo textoteste.txt
with open('textoteste.txt', 'r', encoding='utf-8') as f:
    linhas = f.readlines()

print(f"Total de linhas no arquivo: {len(linhas)}\n")

dados_ok = 0
dados_erro = 0

for idx, linha in enumerate(linhas, 1):
    linha = linha.strip()
    if not linha:
        continue
    
    parts = linha.split('\t')
    
    print(f"Linha {idx}: {len(parts)} colunas")
    print(f"  Primeira coluna: {parts[0][:50]}...")
    
    if len(parts) >= 5 and '#' in parts[0]:
        match = re.match(r'(.+?)\s+#(\d+):\s+(.+)', parts[0])
        if match:
            print(f"  ✓ PROCESSADO - Número: {match.group(2)}")
            dados_ok += 1
        else:
            print(f"  ✗ ERRO no regex")
            dados_erro += 1
    else:
        print(f"  ✗ IGNORADO (menos de 5 colunas ou sem #)")
        dados_erro += 1
    print()

print(f"\n{'='*50}")
print(f"Resumo:")
print(f"  ✓ Processados com sucesso: {dados_ok}")
print(f"  ✗ Erros/Ignorados: {dados_erro}")
