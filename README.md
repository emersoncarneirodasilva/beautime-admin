# 🌟 Beautime Admin

Painel administrativo avançado para gestão de salões de beleza, profissionais, serviços, horários e agendamentos.  
Faz parte do ecossistema **Beautime**, composto por:

- **Backend (Node/Express)** hospedado na Render  
- **Banco de dados Supabase (PostgreSQL)**  
- **Clientes Web totalmente customizáveis por salão**  
- **Painel Admin** — este repositório  

O objetivo do Beautime Admin é fornecer uma interface robusta, moderna e escalável para que cada salão controle sua operação de forma eficiente.

---

# 🚀 Sumário

- [Tecnologias](#-tecnologias)
- [Arquitetura do Sistema](#-arquitetura-do-sistema)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Dashboard e Estatísticas](#-dashboard-e-estatísticas)
- [Páginas Especiais](#-páginas-especiais)
- [Customização por Salão](#-customização-por-salão)
- [Instalação e Setup](#️-instalação-e-setup)
- [Variáveis de Ambiente](#-variáveis-de-ambiente)
- [Scripts](#-scripts)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Deploy no Vercel](#-deploy-no-vercel)
- [Roadmap](#-roadmap)
- [Licença](#-licença)

---

# 🛠 Tecnologias

## 🌐 Core
- **Next.js 16.0.7**  
- **React 19.2.1**  
- **TypeScript 5**  
- **Server & Client Components**  
- **Turbopack**
 
## 🎨 UI e Estilo
- **Tailwind CSS 4**
- **Lucide React** (ícones)
- **React Chart.js 2** (gráficos)
- **Yet Another React Lightbox**

## 🔑 Autenticação
- **JWT**
- **jwt-decode**

## 🛠 Ferramentas de desenvolvimento
- **ESLint 9**
- **eslint-config-next**
- **PostCSS + Tailwind**

---

# 🏗 Arquitetura do Sistema

```Bash
Beautime Admin (Next.js)
          ↓
Backend API (Node + Express – Render)
          ↓
PostgreSQL (Supabase)
          ↓
Buckets: imagens, uploads, perfis, assets
```
**Fluxo de autenticação:**
1. Admin faz login pelo painel  
2. API retorna um token JWT  
3. O token é decodificado e usado para proteger rotas no Next.js  
4. Middleware impede acesso sem token válido  

---

# ✨ Funcionalidades Principais

### ✔ Gerenciamento completo:
- Usuários  
- Administradores  
- Profissionais  
- Serviços  
- Disponibilidade  
- Agendamentos
- Imagens
- Horários 

### ✔ Criação de agendamento pelo administrador
Admin pode:
- Escolher usuário  
- Selecionar um profissional  
- Visualizar horários disponíveis  
- Considerar a duração de cada serviço  
- Criar agendamentos válidos e sem conflitos  

### ✔ Painel por salão (multi-instances)
Cada salão possui:
- Logo e branding  
- URLs distintas  
- Dashboard independente  

---

# 📊 Dashboard e Estatísticas

O dashboard inclui:

### 📈 Gráficos
- Agendamentos ativos  
- Agendamentos concluídos  
- Cancelados  
- Receita mensal, semanal e anual  

### 🧮 Cards de resumo
- Total de usuários  
- Total de admins  
- Total de profissionais  
- Total de serviços  

---

# 📄 Páginas Especiais

### 🟥 GlobalError
- Captura erros inesperados  
- Exibe modal elegante com mensagem amigável  
- Botão de tentar novamente  
- Spinner minimalista  

### 🟦 NotFound
- Exibida quando a rota não existe  
- Design responsivo e limpo  
- Compatível com modo claro/escuro  

### 🔄 Loading
- Spinner global  
- Usado em Server Components e Client Components  

---


# ⚙️ Instalação e Setup

Clone o projeto:

```bash
git clone https://github.com/emersoncarneirodasilva/beautime-admin
cd beautime-admin
```

Instale as dependências:

```bash
npm install
```

Inicie o ambiente de desenvolvimento:

```bash
npm run dev
```

Acesse:

```bash
http://localhost:3000
```

🔐 Variáveis de Ambiente

Crie um arquivo .env: 

```bash
NEXT_PUBLIC_API_URL="https://beautime-backend.onrender.com/api"
NEXT_PUBLIC_SUPABASE_URL=""
NEXT_PUBLIC_SUPABASE_ANON_KEY=""
NEXT_PUBLIC_SALON_BRANDING_URL=""
```
Adicione outras variáveis conforme necessário.


⚡ Scripts

```bash
npm run dev       # Ambiente de desenvolvimento com Turbopack
npm run build     # Build de produção
npm run start     # Servir build local
npm run lint      # Rodar ESLint
```

📁 Estrutura de Pastas

```bash
/app         → Páginas e rotas do Next.js
/components  → Componentes reutilizáveis
/libs        → Funções auxiliares, fetch, API e Supabase
/types       → Tipagens TypeScript
/styles      → CSS, temas e configurações do Tailwind
/public      → Imagens estáticas, logos, favicons
```

# 🚀 Deploy no Vercel

O projeto está pronto para deploy contínuo:

1. Faça **push** no GitHub  
2. O Vercel **detecta o commit automaticamente**  
3. Realiza o **build de produção**  
4. A versão online é **atualizada imediatamente**

## ⚙️ Configuração no Vercel

- Adicione as **variáveis de ambiente** no painel do Vercel  
- Gere **Preview Deploys** para testar funcionalidades antes de ir para produção  
- Utilize o comando abaixo para testar o build localmente:

# 📌 Roadmap

## 🟢 Feito
- Login e autenticação JWT  
- Multisala / branding  
- Dashboard com gráficos  
- Admin criando agendamentos para usuários  
- Sistema de disponibilidade  
- Páginas personalizadas de erro  
- Lightbox de imagens  

## 🔵 Em andamento
- Melhorias de acessibilidade  
- Sistema de auditoria de ações do admin  

## 🔴 Futuro
- Módulo de pagamentos online  
- Agenda inteligente com IA  
- Mobile Admin (PWA)  

---

# 📄 Licença

Este projeto está licenciado sob a **MIT License**.
