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
  const [tutorialExpanded, setTutorialExpanded] = useState(false)

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
      const tipos_negrito = ['Demanda', 'Fase de Planejamento', 'Fase de Execução', 'Fase de Entrega', 'Fase de Modelagem']
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
        <strong>📋 Instruções para colar no Word:</strong><br><br>
        <strong style="color: #d97706;">⚠️ Total de registros: ${dados.length} linhas</strong><br>
        Sua tabela no Word deve ter <strong>EXATAMENTE ${dados.length} linhas vazias</strong> (sem contar o cabeçalho).<br><br>
        <strong>Passo a passo:</strong><br>
        1️⃣ Clique no botão "📋 Copiar Registros" abaixo<br>
        2️⃣ No Word, selecione as ${dados.length} linhas da tabela (apenas dados, sem cabeçalho)<br>
        3️⃣ Cole com <strong>Ctrl + V</strong><br>
        4️⃣ Certifique-se que a tabela esteja formatada: <strong>Arial, tamanho 10</strong>
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
        <h1 className={styles.title}>Gerar Tabela de Demandas</h1>
        <p className={styles.subtitle}>Extrai dados do Redmine e formata em tabela para Word</p>

        <label className={styles.label}>
          Código-fonte HTML do Redmine
        </label>
        <textarea
          className={styles.textarea}
          placeholder="Cole aqui o HTML completo da página do Redmine...&#10;&#10;Pressione Ctrl+U na página do Redmine, copie todo o código (Ctrl+A e Ctrl+C) e cole aqui (Ctrl+V)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={10}
        />

        {/* Tutorial Expansível */}
        <div style={{
          border: '1px solid #d4d8e0',
          borderRadius: '3px',
          marginTop: '0',
          marginBottom: '24px',
          overflow: 'hidden'
        }}>
          <div
            onClick={() => setTutorialExpanded(!tutorialExpanded)}
            style={{
              padding: '12px 18px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#f0f3f8',
              userSelect: 'none'
            }}
          >
            <span style={{ fontSize: '11px', fontWeight: 700, color: '#4e72b8', letterSpacing: '0.09em', textTransform: 'uppercase' }}>
              Como usar — Tutorial
            </span>
            <span style={{
              fontSize: '10px',
              color: '#4e72b8',
              transform: tutorialExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.2s ease'
            }}>
              ▼
            </span>
          </div>

          <div style={{
            maxHeight: tutorialExpanded ? '3000px' : '0',
            opacity: tutorialExpanded ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s ease, opacity 0.3s ease',
          }}>
            <div style={{
              padding: '20px 18px',
              borderTop: '1px solid #d4d8e0',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px'
            }}>
              {[
                {
                  step: '01',
                  title: 'Abrir o código-fonte do Redmine',
                  items: [
                    'Acesse a página do Redmine com as demandas',
                    <>Pressione <strong style={{color:'#1e2128'}}>Ctrl + U</strong> para abrir o código-fonte em nova aba</>,
                    <>Alternativa: <strong style={{color:'#1e2128'}}>F12</strong> → Elements → botão direito em <code style={{color:'#4e72b8',fontSize:'12px'}}>&lt;html&gt;</code> → Copy outerHTML</>
                  ]
                },
                {
                  step: '02',
                  title: 'Copiar o código',
                  items: [
                    <><strong style={{color:'#1e2128'}}>Ctrl + A</strong> para selecionar tudo</>,
                    <><strong style={{color:'#1e2128'}}>Ctrl + C</strong> para copiar</>,
                    'Volte aqui e cole no campo acima com Ctrl + V'
                  ]
                },
                {
                  step: '03',
                  title: 'Processar',
                  items: [
                    'Clique em "Processar Dados"',
                    'Uma nova aba abrirá com a tabela formatada',
                    <>Na nova aba, clique em <strong style={{color:'#1e2128'}}>"Copiar Registros"</strong></>
                  ]
                },
                {
                  step: '04',
                  title: 'Colar no Word',
                  items: [
                    'A tabela no Word deve ter EXATAMENTE a mesma quantidade de linhas',
                    'Selecione as linhas de dados (sem cabeçalho)',
                    'Cole com Ctrl + V',
                    <>Fonte esperada: <strong style={{color:'#1e2128'}}>Arial, tamanho 10</strong></>
                  ]
                }
              ].map(({ step, title, items }) => (
                <div key={step} style={{ display: 'flex', gap: '16px' }}>
                  <div style={{
                    fontSize: '11px', fontWeight: 700, color: '#4e72b8',
                    letterSpacing: '0.05em', minWidth: '24px', paddingTop: '2px'
                  }}>
                    {step}
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 700, color: '#3a4050', marginBottom: '6px', letterSpacing: '0.03em' }}>
                      {title}
                    </div>
                    <ol style={{ margin: 0, paddingLeft: '16px', lineHeight: '1.9', fontSize: '13px', color: '#7a8090' }}>
                      {items.map((item, i) => <li key={i}>{item}</li>)}
                    </ol>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.buttonGroup}>
          <button
            className={styles.buttonPrimary}
            onClick={processarDados}
            disabled={!inputText.trim()}
          >
            Processar Dados
          </button>
          <button
            className={styles.buttonSecondary}
            onClick={limpar}
          >
            Limpar
          </button>
        </div>

        {registros.length > 0 && (
          <div className={styles.resultInfo}>
            <strong>{registros.length} registros</strong> processados — nova aba aberta com a tabela.
            <br />
            Sua tabela no Word deve ter <strong>exatamente {registros.length} linhas</strong> de dados.
            <br />
            <span style={{ opacity: 0.6, fontSize: '12px' }}>
              Se não abriu, verifique se o bloqueador de pop-ups está ativo. Na nova aba, clique em "Copiar Registros" e cole no Word (Ctrl+V).
            </span>
          </div>
        )}
      </div>
    </div>
  )
}