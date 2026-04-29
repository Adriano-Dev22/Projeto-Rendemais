# 🟢 Veskan — Plataforma de Investimentos Inteligentes

> Descubra quanto seu dinheiro **realmente** rende.

O Veskan é uma plataforma digital que calcula e apresenta, de forma simples e precisa, a **rentabilidade real** dos investimentos ao longo do tempo — descontando inflação, impostos e taxas operacionais. Diferente das ferramentas tradicionais, o Veskan não mostra apenas números isolados: ele entrega ao usuário uma visão completa e realista da sua performance financeira.

---
## 🌐 MVP ao vivo

Acesse o Veskan agora mesmo:

[![Acessar o Veskan](https://img.shields.io/badge/🚀%20Acessar%20o%20Veskan-projeto--rendemais.vercel.app-10b981?style=for-the-badge)](https://projeto-rendemais.vercel.app)

---



## 🎯 O problema que resolvemos

A maioria dos investidores vê apenas o rendimento bruto e acha que está ganhando dinheiro. O Veskan mostra o que realmente aconteceu com o patrimônio — depois que a inflação, o IR e as taxas passaram por cima.

**A plataforma considera:**
- Juros compostos
- Inflação (IPCA via API do Banco Central)
- Impostos de renda (tabela regressiva automática)
- Taxas operacionais e de administração
- Aportes mensais
- Reinvestimento de dividendos

---

## ✨ Funcionalidades

### Plano Gratuito
- Simulação básica de investimentos com juros compostos
- Cálculo de rentabilidade real pós-inflação
- Visualização gráfica da evolução patrimonial
- Explicação do resultado em linguagem simples

### Plano Premium
- Aportes mensais com reinvestimento automático
- Cálculo automático de IR por tipo de ativo
- Comparador de dois investimentos lado a lado
- Métricas avançadas: CAGR, TIR, rentabilidade anual real
- Benchmarks vs CDI, IPCA e poupança
- Exportação de relatórios em PDF
- Simulações salvas ilimitadas

---

## 🛠️ Tecnologias utilizadas

| Camada | Tecnologia | Finalidade |
|---|---|---|
| Frontend | React + Vite | Interface do usuário |
| Estilização | Tailwind CSS | Design responsivo |
| Banco de dados | Firebase Firestore | Dados dos usuários e simulações |
| Autenticação | Firebase Auth | Login e cadastro |
| Pagamentos | Stripe | Assinaturas do plano premium |
| Dados de mercado | API Banco Central (BCB) | IPCA, CDI e Selic em tempo real |
| Hospedagem | Vercel | Deploy automático |

---

## 📁 Estrutura do projeto

```
veskan/
├── public/               # Arquivos estáticos
├── src/
│   ├── components/       # Componentes reutilizáveis (Button, Card, Input...)
│   ├── pages/            # Páginas da aplicação (Landing, Simulador, Dashboard...)
│   ├── hooks/            # Hooks customizados (useCalculator, useAuth...)
│   ├── utils/            # Funções utilitárias (calculator.js, bcbApi.js, irTable.js)
│   ├── App.jsx           # Componente raiz + rotas
│   ├── main.jsx          # Ponto de entrada da aplicação
│   └── index.css         # Estilos globais (Tailwind)
├── index.html            # HTML base
├── vite.config.js        # Configuração do Vite + Tailwind
├── package.json          # Dependências do projeto
└── README.md             # Este arquivo
```

---

## 🚀 Como rodar o projeto localmente

### Pré-requisitos

- [Node.js](https://nodejs.org) v18 ou superior
- [Git](https://git-scm.com)
- [VS Code](https://code.visualstudio.com) (recomendado)

### Passo a passo

**1. Clone o repositório**
```bash
git clone https://github.com/Adriano-Dev22/Projeto-Rendemais.git
cd Projeto-Rendemais/veskan
```

**2. Instale as dependências**
```bash
npm install
```

**3. Inicie o servidor de desenvolvimento**
```bash
npm run dev
```

**4. Acesse no navegador**
```
http://localhost:5173
```

### Comandos úteis

```bash
npm run dev       # Inicia o servidor de desenvolvimento
npm run build     # Gera o build de produção
npm run preview   # Visualiza o build de produção localmente
```

---

## 🔌 APIs utilizadas

### Banco Central do Brasil (BCB)
API pública e gratuita, sem necessidade de chave de acesso.

```
https://api.bcb.gov.br/dados/serie/bcdata.sgs.433/dados/ultimos/12?formato=json
```
- Série **433** → IPCA mensal
- Série **12** → CDI diário
- Série **11** → Selic

### Firebase
Autenticação e banco de dados em tempo real. Configure suas credenciais em `.env`:

```env
VITE_FIREBASE_API_KEY=sua_chave
VITE_FIREBASE_AUTH_DOMAIN=seu_dominio
VITE_FIREBASE_PROJECT_ID=seu_projeto
```

### Stripe
Processamento de pagamentos para o plano premium.

```env
VITE_STRIPE_PUBLIC_KEY=sua_chave_publica
STRIPE_SECRET_KEY=sua_chave_secreta
```

> ⚠️ Nunca suba o arquivo `.env` para o GitHub. Ele já está no `.gitignore`.

---

## 🗺️ Roadmap

- [x] Estrutura inicial do projeto (React + Vite + Tailwind)
- [x] Landing page
- [ ] Motor de cálculo financeiro
- [ ] Simulador básico com gráficos
- [ ] Autenticação com Firebase
- [ ] Simulações salvas
- [ ] Plano premium com IR e aportes mensais
- [ ] Comparador de investimentos
- [ ] Integração com Stripe
- [ ] Deploy na Vercel
- [ ] App mobile (React Native / PWA)

---

## 👥 Equipe

Projeto desenvolvido como MVP da plataforma **Veskan**, originado do **Projeto Rende+** 

---
