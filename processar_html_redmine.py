import re
from html.parser import HTMLParser

class RedmineHTMLParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.dados = []
        self.current_row = {}
        self.current_tag = None
        self.in_subject = False
        self.in_link = False
        
    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)
        
        if tag == 'tr' and 'class' in attrs_dict and 'issue' in attrs_dict['class']:
            self.current_row = {}
            
        elif tag == 'td':
            if 'class' in attrs_dict:
                self.current_tag = attrs_dict['class']
                if 'subject' in attrs_dict['class']:
                    self.in_subject = True
                    
        elif tag == 'a' and self.in_subject:
            self.in_link = True
            # Extrair número da issue do href
            if 'href' in attrs_dict:
                match = re.search(r'/issues/(\d+)', attrs_dict['href'])
                if match:
                    self.current_row['numero'] = match.group(1)
    
    def handle_data(self, data):
        data = data.strip()
        if not data:
            return
            
        if self.in_link and self.in_subject:
            # Extrair tipo e número (ex: "Demanda #45983")
            match = re.match(r'(.+?)\s+#\d+', data)
            if match:
                self.current_row['tipo'] = match.group(1)
                
        elif self.in_subject and not self.in_link and ':' in data:
            # Descrição depois dos dois pontos
            self.current_row['descricao'] = data.replace(':', '').strip()
            
        elif self.current_tag:
            if 'status' in self.current_tag and 'status' not in self.current_row:
                self.current_row['status'] = data
            elif 'assigned_to' in self.current_tag:
                self.current_row['tecnico'] = data
            elif 'start_date' in self.current_tag:
                self.current_row['data_inicio'] = data
            elif 'due_date' in self.current_tag:
                self.current_row['data_fim'] = data
    
    def handle_endtag(self, tag):
        if tag == 'a' and self.in_link:
            self.in_link = False
            
        elif tag == 'td':
            if self.in_subject:
                self.in_subject = False
            self.current_tag = None
            
        elif tag == 'tr' and self.current_row:
            # Salvar linha se tiver dados completos
            if all(k in self.current_row for k in ['numero', 'tipo', 'descricao', 'data_inicio', 'data_fim']):
                if 'tecnico' not in self.current_row:
                    self.current_row['tecnico'] = ''
                self.dados.append(self.current_row.copy())
            self.current_row = {}

# Ler o arquivo HTML
with open('htmlpagina.txt', 'r', encoding='utf-8') as f:
    html_content = f.read()

# Parsear HTML
parser = RedmineHTMLParser()
parser.feed(html_content)
dados = parser.dados

print(f"Processados {len(dados)} registros do HTML")

# Gerar HTML formatado
html = f"""<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tabela de Demandas - Janeiro 2026 (HTML)</title>
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
        <strong>Total de registros:</strong> {len(dados)} linhas de dados<br>
        <strong>Arquivo fonte:</strong> htmlpagina.txt (HTML do Redmine)
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
    solicitacao = f"{item['tipo']}: {item['descricao']}"
    
    # Verificar se é Demanda ou Fase para aplicar negrito
    tipo = item['tipo']
    classe_negrito = ' class="negrito"' if tipo.startswith('Demanda') or tipo.startswith('Fase') else ''
    
    html += f"""            <tr{classe_negrito}>
                <td><a href="{url}">#{item['numero']}</a></td>
                <td>{solicitacao}</td>
                <td>{item['data_inicio']}</td>
                <td>{item['data_fim']}</td>
                <td>{item['tecnico']}</td>
            </tr>
"""

html += """        </tbody>
    </table>
</body>
</html>
"""

# Salvar HTML
with open('tabela_html.html', 'w', encoding='utf-8') as f:
    f.write(html)

print("✓ Arquivo HTML gerado: tabela_html.html")
print("\nAbra o arquivo no navegador para visualizar!")
print(f"\nPrimeiros 5 registros processados:")
for i, item in enumerate(dados[:5], 1):
    print(f"  {i}. #{item['numero']} - {item['tipo']}: {item['descricao'][:50]}...")
