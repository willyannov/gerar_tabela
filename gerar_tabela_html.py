import re

# Ler o arquivo de texto
with open('textoteste.txt', 'r', encoding='utf-8') as f:
    linhas = f.readlines()

dados = []

for linha in linhas:
    linha = linha.strip()
    if not linha:
        continue
    
    parts = linha.split('\t')
    
    if len(parts) >= 5 and '#' in parts[0]:
        match = re.match(r'(.+?)\s+#(\d+):\s+(.+)', parts[0])
        if not match:
            continue
        
        tipo = match.group(1).strip()
        numero = match.group(2)
        descricao = match.group(3).strip()
        responsavel = parts[2].strip() if parts[2].strip() else ''
        data_inicio = parts[3].strip()
        data_fim = parts[4].strip()
        
        solicitacao = f'{tipo}: {descricao}'
        
        dados.append({
            'numero': numero,
            'solicitacao': solicitacao,
            'data_abertura': data_inicio,
            'data_encerramento': data_fim,
            'tecnico': responsavel
        })

print(f"Processados {len(dados)} registros")

# Gerar HTML
html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tabela de Demandas - Janeiro 2026</title>
    <style>
        body {{
            font-family: 'Calibri', Arial, sans-serif;
            padding: 20px;
        }}
        table {{
            border-collapse: collapse;
            width: 100%;
        }}
        th, td {{
            border: 1px solid black;
            padding: 8px;
            text-align: left;
        }}
        th {{
            background-color: #D9D9D9;
            font-weight: bold;
            text-align: center;
        }}
        td:nth-child(1) {{
            text-align: center;
        }}
        td:nth-child(3), td:nth-child(4) {{
            text-align: center;
        }}
        a {{
            color: #0563C1;
            text-decoration: underline;
        }}
        .info {{
            background-color: #FFF3CD;
            border: 1px solid #FFC107;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 5px;
        }}
        .negrito {{
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class="info">
        <strong>Instruções:</strong> Selecione toda a tabela abaixo (clique em qualquer célula e pressione Ctrl+A), 
        copie (Ctrl+C) e cole no Word (Ctrl+V). Os hyperlinks serão mantidos!<br>
        <strong>Total de registros:</strong> {len(dados)} linhas de dados
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Nº</th>
                <th>Solicitação</th>
                <th>Data<br>Abertura</th>
                <th>Data<br>Encerramento</th>
                <th>Técnico</th>
            </tr>
        </thead>
        <tbody>
"""

for item in dados:
    url = f"https://redmine.deltapoint.com.br/issues/{item['numero']}"
    
    # Verificar se é Demanda ou Fase para aplicar negrito
    tipo = item['solicitacao'].split(':')[0].strip()
    classe_negrito = ' class="negrito"' if tipo.startswith('Demanda') or tipo.startswith('Fase') else ''
    
    html += f"""            <tr{classe_negrito}>
                <td><a href="{url}">#{item['numero']}</a></td>
                <td>{item['solicitacao']}</td>
                <td>{item['data_abertura']}</td>
                <td>{item['data_encerramento']}</td>
                <td>{item['tecnico']}</td>
            </tr>
"""

html += """        </tbody>
    </table>
</body>
</html>
"""

# Salvar HTML
with open('tabela_janeiro_2026.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✓ Arquivo HTML gerado: tabela_janeiro_2026.html")
print("\nAbra o arquivo no navegador, selecione a tabela completa e copie!")
