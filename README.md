# Beautime Admin

Painel administrativo para o sistema Beautime, que gerencia salões de beleza, profissionais, serviços e agendamentos.  
Desenvolvido com foco em segurança, performance e escalabilidade.

---

## 🛠 Tecnologias e Bibliotecas

### 🌐 Framework e Core
- **Next.js 15.3.4** – Framework React moderno com suporte a Server/Client Components e Turbopack  
- **React 19** – Biblioteca de UI para construção de componentes  
- **React DOM 19** – Integração do React com o DOM  

### 🖌 UI e Componentes
- **Lucide React** – Ícones modernos e leves  
- **React Chart.js 2** – Gráficos para dashboard (bar, line, pie, etc.)  
- **Yet Another React Lightbox** – Visualização de imagens em lightbox  

### 🔑 Autenticação
- **jwt-decode** – Decodificação de tokens JWT  

### 🛠 Desenvolvimento e Build
- **TypeScript 5** – Tipagem estática e segurança de código  
- **Tailwind CSS 4** – Framework de estilização utilitária  
- **@tailwindcss/postcss** – Integração do Tailwind com PostCSS  
- **ESLint 9 + eslint-config-next** – Linter e regras para Next.js  

### 🧩 Tipagem
- **@types/node**, **@types/react**, **@types/react-dom** – Tipagens TypeScript para Node.js e React  

---

## ⚡ Scripts principais

```bash
npm run dev   # Inicia o ambiente de desenvolvimento com Turbopack
npm run build # Gera o build de produção
npm run start # Roda a aplicação em produção local
npm run lint  # Verifica o código com ESLint
```

# Beautime Admin - Funcionalidades e Dashboard

Nesta parte descrevemos as principais funcionalidades do painel administrativo e suas páginas especiais.

---

## 🖥 Dashboard

- Visualização geral do salão: usuários, administradores, serviços e profissionais.  
- Gráficos de agendamentos:
  - Agendamentos ativos, concluídos e cancelados.  
  - Receita esperada e receita realizada.  
- Filtros por período: semanal, mensal e anual.  

---

## 📊 Estatísticas e Métricas

- Cards com números gerais:
  - Total de usuários e admins
  - Total de serviços e profissionais
- Gráficos interativos usando **React Chart.js 2**  
- Visualização de receita e agendamentos filtrados por período  

---

## 📄 Páginas Especiais

### 1. Erro Global (`GlobalError`)
- Captura erros inesperados no painel.  
- Exibe modal elegante com:
  - Ícone de alerta
  - Mensagem amigável
  - Botões para tentar novamente ou voltar à página inicial
  - Spinner discreto indicando ação em andamento

### 2. Página Não Encontrada (`NotFound`)
- Mensagem clara e elegante quando o usuário acessa rota inexistente
- Design limpo, centralizado e responsivo
- Compatível com tema claro/escuro
- Usa cores e tipografia consistentes com o restante do projeto

### 3. Loading (Spinner)
- Componente global para exibir carregamento de páginas e dados  
- Integrado em Server Components e Client Components do Next.js  
- Spinner discreto e elegante, respeitando cores do tema

---

## 🎨 Customização por salão

- Cada salão possui **front-end isolado**, permitindo:
  - Alteração de cores
  - Branding personalizado
  - Estilo de tipografia e elementos visuais específicos

---

# Beautime Admin - Setup, Deploy e Estrutura

Nesta parte descrevemos como configurar o projeto localmente, fazer deploy e a organização das pastas.

---

## ⚙️ Instalação e Setup Local

1. **Clonar o repositório:**

```bash
git clone (https://github.com/emersoncarneirodasilva/beautime-admin)
cd beautime-admin
```
Instalar dependências:

npm install


Configurar variáveis de ambiente (.env):

Exemplo mínimo:

NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
FRONTEND_URL=http://localhost:3000


Ajuste os valores para o seu ambiente local ou produção.

Rodar o projeto localmente:

npm run dev

Painel disponível em: http://localhost:3000

🚀 Deploy

O projeto está configurado para deploy contínuo no Vercel.

Ao dar push no GitHub:

O Vercel detecta alterações

Faz build automático

Atualiza a aplicação online

🧩 Estrutura do Projeto
/app         → Pastas das páginas do Next.js
/components  → Componentes reutilizáveis (UI, dashboard, modals, etc.)
/libs        → Funções auxiliares e integração com API/Supabase
/types       → Tipos TypeScript
/styles      → CSS global e variáveis de tema
/public      → Assets públicos (imagens, logos, etc.)

📝 Observações

Cada salão possui front-end isolado, permitindo customização de cores e branding.

Todos os componentes e páginas foram desenvolvidos pensando em:

Segurança: autenticação, tokens JWT e proteção de rotas

Performance: SSR, lazy loading, cache

Escalabilidade: arquitetura organizada e modular

Página de recuperação de senha será personalizada para cada salão, mantendo consistência de branding e cores.

📄 Licença

Este projeto está licenciado sob a MIT License.
