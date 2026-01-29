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
        <h1 className={styles.title}>📊 Gerar Tabela de Demandas</h1>
        <p className={styles.subtitle}>Ferramenta para extrair dados do Redmine e formatar em tabela</p>

        <h3 style={{ marginBottom: '10px', fontSize: '16px' }}>
          Cole o código HTML abaixo:
        </h3>
        <textarea
          className={styles.textarea}
          placeholder="Cole aqui o HTML completo da página do Redmine...&#10;&#10;Pressione Ctrl+U na página do Redmine, copie todo o código (Ctrl+A e Ctrl+C) e cole aqui (Ctrl+V)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          rows={10}
        />

        {/* Tutorial Expansível */}
        <div style={{
          backgroundColor: '#F5F5F5',
          border: '2px solid #E0E0E0',
          borderRadius: '8px',
          marginTop: '15px',
          marginBottom: '20px',
          overflow: 'hidden'
        }}>
          <div 
            onClick={() => setTutorialExpanded(!tutorialExpanded)}
            style={{
              padding: '15px 20px',
              cursor: 'pointer',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: '#E3F2FD',
              borderBottom: tutorialExpanded ? '2px solid #2196F3' : 'none',
              userSelect: 'none'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '20px' }}>📖</span>
              <strong style={{ color: '#1976D2', fontSize: '16px' }}>
                Precisa de ajuda? Veja o tutorial completo
              </strong>
            </div>
            <span style={{ 
              fontSize: '20px',
              color: '#1976D2',
              transform: tutorialExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
              transition: 'transform 0.3s ease'
            }}>
              ▼
            </span>
          </div>
          
          <div style={{
            maxHeight: tutorialExpanded ? '3000px' : '0',
            opacity: tutorialExpanded ? 1 : 0,
            overflow: 'hidden',
            transition: 'max-height 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.5s ease',
            transform: tutorialExpanded ? 'scaleY(1)' : 'scaleY(0.95)',
            transformOrigin: 'top'
          }}>
            <div style={{ 
              padding: tutorialExpanded ? '20px' : '0 20px',
              transition: 'padding 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#1976D2', fontSize: '16px', marginBottom: '10px' }}>
                  🌐 PASSO 1: Abrir o Código Fonte da Página do Redmine
                </h3>
                <ol style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Acesse a página do Redmine com as demandas que você quer processar</li>
                  <li>Pressione <strong>Ctrl + U</strong> no teclado (abrirá uma nova aba com o código-fonte)</li>
                  <li style={{ color: '#666', fontSize: '14px' }}>
                    💡 <em>Alternativa:</em> Pressione <strong>F12</strong> → Clique na aba "Elements" → 
                    Clique com botão direito em <code>&lt;html&gt;</code> → "Copy" → "Copy outerHTML"
                  </li>
                </ol>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#1976D2', fontSize: '16px', marginBottom: '10px' }}>
                  📋 PASSO 2: Copiar o Código Fonte
                </h3>
                <ol style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Pressione <strong>Ctrl + A</strong> para selecionar todo o código</li>
                  <li>Pressione <strong>Ctrl + C</strong> para copiar</li>
                  <li>Volte para esta página</li>
                  <li>Cole o código no campo acima usando <strong>Ctrl + V</strong></li>
                </ol>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#1976D2', fontSize: '16px', marginBottom: '10px' }}>
                  🔄 PASSO 3: Processar os Dados
                </h3>
                <ol style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Clique no botão <strong>"🔄 Processar Dados"</strong></li>
                  <li>Uma nova aba será aberta automaticamente com a tabela formatada</li>
                  <li>Na nova aba, clique no botão <strong>"📋 Copiar Registros"</strong></li>
                </ol>
              </div>

              <div style={{ 
                backgroundColor: '#FFF3CD',
                border: '2px solid #FFC107',
                borderRadius: '6px',
                padding: '15px',
                marginTop: '15px'
              }}>
                <h3 style={{ color: '#F57C00', fontSize: '16px', marginBottom: '10px' }}>
                  📄 PASSO 4: Colar no Word (.docx)
                </h3>
                <ol style={{ margin: '0', paddingLeft: '20px', lineHeight: '1.8' }}>
                  <li>Abra seu documento Word (.docx)</li>
                  <li><strong>IMPORTANTE:</strong> A tabela no Word deve ter <strong>EXATAMENTE a mesma quantidade de linhas</strong> que foram geradas (será informado na tela)</li>
                  <li>Selecione as linhas da tabela no Word (apenas as linhas de dados, sem o cabeçalho)</li>
                  <li>Cole os dados copiados com <strong>Ctrl + V</strong></li>
                </ol>

                <div style={{ 
                  marginTop: '15px',
                  padding: '12px',
                  backgroundColor: '#FFE0B2',
                  borderRadius: '4px',
                  borderLeft: '4px solid #FF9800'
                }}>
                  <strong>⚠️ ATENÇÃO - Formatação da Tabela no Word:</strong>
                  <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px', lineHeight: '1.8' }}>
                    <li>Antes de colar, <strong>remova toda formatação</strong> da tabela do Word</li>
                    <li>Fonte: <strong>Arial, tamanho 10</strong></li>
                    <li>Sem negrito, sem cores, sem bordas especiais</li>
                    <li>Bordas simples pretas de 1pt</li>
                    <li><strong>Dica:</strong> Selecione a tabela → Botão direito → "Limpar Formatação" ou use "Mesclar Formatação" ao colar</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

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
            <strong style={{ color: '#F57C00', fontSize: '16px' }}>
              ⚠️ IMPORTANTE: Sua tabela no Word deve ter EXATAMENTE {registros.length} linhas de dados!
            </strong>
            <br />
            <small>Se não abriu, verifique se o bloqueador de pop-ups está ativado.</small>
            <br />
            <small style={{ marginTop: '8px', display: 'block' }}>
              💡 Na nova aba, clique em "📋 Copiar Registros" e cole no Word (Ctrl+V)
            </small>
          </div>
        )}
      </div>
    </div>
  )
}