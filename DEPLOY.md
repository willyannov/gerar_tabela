# 🚀 DEPLOY NA VERCEL - PASSO A PASSO

## Opção 1: Deploy via GitHub (Recomendado)

### 1. Criar repositório no GitHub

```bash
# Inicializar git (se ainda não foi feito)
git init

# Adicionar todos os arquivos
git add .

# Fazer commit
git commit -m "Initial commit - Gerador de Tabela de Demandas"

# Criar repositório no GitHub e adicionar como remote
git remote add origin https://github.com/SEU_USUARIO/gerador-tabela-demandas.git

# Enviar para o GitHub
git branch -M main
git push -u origin main
```

### 2. Deploy na Vercel

1. Acesse https://vercel.com
2. Faça login com sua conta GitHub
3. Clique em **"New Project"**
4. Selecione o repositório **gerador-tabela-demandas**
5. Clique em **"Deploy"**
6. Aguarde o build finalizar ✅
7. Seu site estará no ar! 🎉

---

## Opção 2: Deploy via Vercel CLI

```bash
# Instalar Vercel CLI globalmente
npm install -g vercel

# Fazer login
vercel login

# Deploy
vercel

# Para fazer deploy em produção
vercel --prod
```

---

## 📋 Checklist Pré-Deploy

- [x] Dependências instaladas (`npm install`)
- [x] Build funcionando localmente (`npm run build`)
- [x] Aplicação testada em dev (`npm run dev`)
- [x] Arquivo `.gitignore` configurado
- [x] Arquivo `vercel.json` criado
- [x] README.md com documentação

---

## 🌐 Variáveis de Ambiente (se necessário)

Caso precise adicionar variáveis de ambiente:

1. No painel da Vercel, vá em **Settings > Environment Variables**
2. Adicione as variáveis necessárias
3. Faça redeploy

---

## 📝 Comandos Úteis

```bash
# Testar build de produção localmente
npm run build
npm run start

# Ver logs de deploy
vercel logs

# Ver lista de deploys
vercel ls

# Remover projeto da Vercel
vercel remove
```

---

## 🔗 URLs Após Deploy

- **Production:** https://seu-projeto.vercel.app
- **Preview:** Criado automaticamente para cada push no GitHub

---

## 🐛 Troubleshooting

### Erro no build?
- Verifique se todas as dependências estão no `package.json`
- Rode `npm run build` localmente primeiro
- Verifique os logs no painel da Vercel

### Deploy não atualiza?
- Faça um novo commit e push
- Ou force redeploy no painel da Vercel

### Página em branco?
- Verifique o console do navegador (F12)
- Veja os logs de runtime na Vercel

---

## 📚 Documentação Oficial

- [Next.js](https://nextjs.org/docs)
- [Vercel](https://vercel.com/docs)
- [Deploy Next.js na Vercel](https://vercel.com/docs/frameworks/nextjs)
