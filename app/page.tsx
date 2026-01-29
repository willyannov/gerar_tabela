'use client'

import { useState } from 'react'
import styles from './page.module.css'

interface Registro {
  numero: string
  solicitacao: string
  data_abertura: string
  data_encerramento: string
  tecnico: string
}

export default function Home() {
  const [inputText, setInputText] = useState('')
  const [registros, setRegistros] = useState<Registro[]>([])

  const processarDados = () => {
    processarHTML()
  }

  const processarHTML = () => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(inputText, 'text/html')
    const dadosProcessados: Registro[] = []

    // Buscar apenas dentro do elemento com id="issue_tree"
    const issueTree = doc.getElementById('issue_tree')
    if (!issueTree) {
      alert('Não foi encontrado o elemento com id="issue_tree". Certifique-se de colar o HTML completo da página do Redmine.')
      return
    }

    // Buscar todas as linhas da tabela dentro do issue_tree
    const rows = issueTree.querySelectorAll('tr.issue, tr[class*="issue"]')
    
    rows.forEach(row => {
      try {
        // Extrair número da issue
        const linkElement = row.querySelector('td.subject a, td[class*="subject"] a')
        if (!linkElement) return

        const href = linkElement.getAttribute('href')
        const numeroMatch = href?.match(/\/issues\/(\d+)/)
        if (!numeroMatch) return
        const numero = numeroMatch[1]

        // Extrair tipo e descrição
        const linkText = linkElement.textContent?.trim() || ''
        const tipoMatch = linkText.match(/(.+?)\s+#\d+/)
        const tipo = tipoMatch ? tipoMatch[1] : ''

        const subjectTd = row.querySelector('td.subject, td[class*="subject"]')
        const fullText = subjectTd?.textContent?.trim() || ''
        const descricaoMatch = fullText.match(/:\s*(.+)/)
        const descricao = descricaoMatch ? descricaoMatch[1].trim() : ''

        // Extrair datas
        const dataInicio = row.querySelector('td.start_date, td[class*="start_date"]')?.textContent?.trim() || ''
        const dataFim = row.querySelector('td.due_date, td[class*="due_date"]')?.textContent?.trim() || ''

        // Extrair técnico
        const tecnico = row.querySelector('td.assigned_to, td[class*="assigned_to"]')?.textContent?.trim() || ''

        if (numero && tipo && descricao) {
          dadosProcessados.push({
            numero,
            solicitacao: `${tipo}: ${descricao}`,
            data_abertura: dataInicio,
            data_encerramento: dataFim,
            tecnico
          })
        }
      } catch (error) {
        console.error('Erro ao processar linha:', error)
      }
    })

    if (dadosProcessados.length === 0) {
      alert('Nenhum registro foi processado. Verifique se o HTML contém a estrutura esperada do Redmine.')
      return
    }

    setRegistros(dadosProcessados)
    abrirTabelaNovaAba(dadosProcessados)
  }

  const abrirTabelaNovaAba = (dados: Registro[]) => {
    const linhasTabela = dados.map(dado => {
      const tipos_negrito = ['Demanda', 'Fase de Planejamento', 'Fase de Execução', 'Fase de Entrega']
      const tipo = dado.solicitacao.split(':')[0]
      const isBold = tipos_negrito.includes(tipo)
      const fontWeight = isBold ? 'font-weight: bold;' : ''

      return `            <tr>
                <td style="border: 1px solid black; padding: 8px; text-align: center; font-family: Arial; font-size: 10pt; ${fontWeight}"><a href="https://redmine.deltapoint.com.br/issues/${dado.numero}" style="color: #0563C1; text-decoration: underline; font-family: Arial; font-size: 10pt;">#${dado.numero}</a></td>
                <td style="border: 1px solid black; padding: 8px; text-align: left; font-family: Arial; font-size: 10pt; ${fontWeight}">${dado.solicitacao}</td>
                <td style="border: 1px solid black; padding: 8px; text-align: center; font-family: Arial; font-size: 10pt; ${fontWeight}">${dado.data_abertura}</td>
                <td style="border: 1px solid black; padding: 8px; text-align: center; font-family: Arial; font-size: 10pt; ${fontWeight}">${dado.data_encerramento}</td>
                <td style="border: 1px solid black; padding: 8px; text-align: left; font-family: Arial; font-size: 10pt; ${fontWeight}">${dado.tecnico}</td>
            </tr>`
    }).join('\n')

    const html = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Tabela de Demandas - Janeiro 2026</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            padding: 20px;
        }
        table {
            border-collapse: collapse;
            width: 100%;
            font-family: Arial, sans-serif;
            font-size: 10pt;
        }
        th, td {
            border: 1px solid black;
            padding: 8px;
            text-align: left;
            font-family: Arial, sans-serif;
            font-size: 10pt;
        }
        th {
            background-color: #D9D9D9;
            font-weight: bold;
            text-align: center;
        }
        td:nth-child(1) {
            text-align: center;
        }
        td:nth-child(3), td:nth-child(4) {
            text-align: center;
        }
        a {
            color: #0563C1;
            text-decoration: underline;
            font-family: Arial, sans-serif;
            font-size: 10pt;
        }
        .info {
            background-color: #FFF3CD;
            border: 1px solid #FFC107;
            padding: 10px;
            margin-bottom: 20px;
            border-radius: 5px;
        }
        .negrito {
            font-weight: bold;
        }
        .button-container {
            margin-bottom: 20px;
            display: flex;
            align-items: center;
            gap: 15px;
        }
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: all 0.3s;
            background: #5a5a5a;
            color: white;
        }
        .btn:hover {
            background: #404040;
            transform: translateY(-2px);
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
        .feedback {
            display: none;
            background: #d4edda;
            border: 1px solid #c3e6cb;
            color: #155724;
            padding: 8px 16px;
            border-radius: 5px;
        }
        .feedback.show {
            display: block;
        }
    </style>
</head>
<body>
    <div class="info">
        <strong>Instruções:</strong> Clique no botão abaixo para copiar os registros e cole no Word.<br>
        <strong>Total de registros:</strong> ${dados.length} linhas de dados
    </div>

    <div class="button-container">
        <button class="btn" onclick="copiarApenasRegistros()">📋 Copiar Registros</button>
        <div id="feedback" class="feedback">✅ Copiado com sucesso!</div>
    </div>
    
    <table id="tabela">
        <thead>
            <tr>
                <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #D9D9D9; font-family: Arial; font-size: 10pt; font-weight: bold;">Nº</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #D9D9D9; font-family: Arial; font-size: 10pt; font-weight: bold;">Solicitação</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #D9D9D9; font-family: Arial; font-size: 10pt; font-weight: bold;">Data<br>Abertura</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #D9D9D9; font-family: Arial; font-size: 10pt; font-weight: bold;">Data<br>Encerramento</th>
                <th style="border: 1px solid black; padding: 8px; text-align: center; background-color: #D9D9D9; font-family: Arial; font-size: 10pt; font-weight: bold;">Técnico</th>
            </tr>
        </thead>
        <tbody id="tbody">
${linhasTabela}
        </tbody>
    </table>

    <script>
        function showFeedback() {
            const feedback = document.getElementById('feedback');
            feedback.classList.add('show');
            setTimeout(() => feedback.classList.remove('show'), 2000);
        }

        function copiarApenasRegistros() {
            const tbody = document.getElementById('tbody');
            const range = document.createRange();
            range.selectNode(tbody);
            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            document.execCommand('copy');
            window.getSelection().removeAllRanges();
            showFeedback();
        }
    </script>
</body>
</html>`

    // Abrir HTML em nova aba
    const blob = new Blob([html], { type: 'text/html' })
    const url = URL.createObjectURL(blob)
    window.open(url, '_blank')
    
    // Limpar URL após abrir
    setTimeout(() => URL.revokeObjectURL(url), 100)
  }

  const limpar = () => {
    setInputText('')
    setRegistros([])
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1 className={styles.title}>📊 Gerar Tabela</h1>
        <p className={styles.subtitle}>Cole o HTML completo da página do Redmine</p>

        <textarea
          className={styles.textarea}
          placeholder="Cole aqui o HTML completo da página do Redmine...&#10;&#10;Dica: Pressione Ctrl+U no navegador para ver o código-fonte da página e copie tudo."
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={10}
        />

        <div className={styles.buttonGroup}>
          <button 
            className={styles.buttonPrimary} 
            onClick={processarDados}
            disabled={!inputText.trim()}
          >
            🔄 Processar Dados
          </button>
          <button 
            className={styles.buttonSecondary} 
            onClick={limpar}
          >
            🗑️ Limpar
          </button>
        </div>

        {registros.length > 0 && (
          <div className={styles.resultInfo}>
            ✅ <strong>{registros.length}</strong> registros processados! Uma nova aba foi aberta com a tabela.
            <br />
            <small>Se não abriu, verifique se o bloqueador de pop-ups está ativado.</small>
          </div>
        )}
      </div>
    </div>
  )
}