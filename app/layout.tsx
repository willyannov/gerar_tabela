import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Gerador de Tabela de Demandas',
  description: 'Converte dados de demandas do Redmine em tabelas HTML formatadas',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  )
}
