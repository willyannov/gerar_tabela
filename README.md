# Gerador de Tabela de Demandas 📊

Aplicação web para converter dados de demandas do Redmine em tabelas HTML formatadas para uso no Microsoft Word.

## 🚀 Deploy na Vercel

### Passo a Passo:

1. **Instalar dependências**
   ```bash
   npm install
   ```

2. **Testar localmente**
   ```bash
   npm run dev
   ```
   Acesse: http://localhost:3000

3. **Fazer deploy na Vercel**
   
   **Opção A - Via CLI:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

   **Opção B - Via GitHub:**
   - Crie um repositório no GitHub
   - Faça push do código
   - Acesse [vercel.com](https://vercel.com)
   - Clique em "New Project"
   - Importe seu repositório
   - Clique em "Deploy"

## 📝 Como Usar

1. Exporte os dados do Redmine (formato texto com tabs)
2. Cole os dados no campo de texto
3. Clique em "Processar Dados"
4. Visualize a preview da tabela
5. Clique em "Baixar HTML para Word"
6. Abra o arquivo HTML no navegador
7. Copie a tabela (Ctrl+A, Ctrl+C)
8. Cole no Word (Ctrl+V) - os hyperlinks serão mantidos!

## 🛠️ Tecnologias

- **Next.js 14** - Framework React
- **TypeScript** - Tipagem estática
- **CSS Modules** - Estilos isolados
- **Vercel** - Hospedagem e deploy

## 📂 Estrutura

```
testedocx/
├── app/
│   ├── layout.tsx          # Layout principal
│   ├── page.tsx            # Página inicial
│   ├── page.module.css     # Estilos da página
│   └── globals.css         # Estilos globais
├── package.json            # Dependências
├── next.config.js          # Configuração Next.js
├── tsconfig.json           # Configuração TypeScript
├── vercel.json             # Configuração Vercel
└── README.md               # Documentação
```

## 🐍 Scripts Python Originais

Os scripts Python originais ainda estão disponíveis:
- `gerar_tabela_html.py` - Gerador original
- `testar_textoteste.py` - Script de teste
- `texto.txt` - Dados de exemplo

Para usar os scripts Python:
```bash
python gerar_tabela_html.py
```

## 📄 Licença

Uso interno - Projeto privado
