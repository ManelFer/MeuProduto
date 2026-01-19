# Sistema de Controle - Loja de Informática

Sistema de controle interno para lojas de informática desenvolvido com Next.js 14, TypeScript, PostgreSQL e Prisma.

## Funcionalidades

- ✅ Sistema de autenticação (Login)
- ✅ Cadastro de clientes (CRUD completo)
- ✅ Controle de estoque (CRUD de produtos)
- ✅ Criação de ordens de serviço
- ✅ Impressão de ordens de serviço para assinatura

## Tecnologias

- **Next.js 14** - Framework React com App Router
- **TypeScript** - Tipagem estática
- **PostgreSQL** - Banco de dados relacional
- **Prisma** - ORM para PostgreSQL
- **NextAuth.js** - Autenticação
- **Tailwind CSS** - Estilização
- **bcryptjs** - Hash de senhas

## Configuração do Banco de Dados

O projeto está configurado para usar PostgreSQL com as seguintes credenciais:

```
Host: localhost
Port: 5432
Database: postgres
Username: postgres
```

## Instalação

1. Instale as dependências:

```bash
npm install
```

2. Configure as variáveis de ambiente:

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/postgres?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production"
```

**Importante:** Altere `postgres:postgres` para suas credenciais reais do PostgreSQL (usuario:senha).

3. Execute as migrations do Prisma:

```bash
npx prisma migrate dev --name init
```

4. Crie um usuário administrador:

```bash
npx ts-node scripts/create-user.ts admin@loja.com senha123 Administrador
```

Ou use os valores padrão:

```bash
npx ts-node scripts/create-user.ts
```

Isso criará um usuário com:
- Email: admin@loja.com
- Senha: admin123
- Nome: Administrador

5. Inicie o servidor de desenvolvimento:

```bash
npm run dev
```

O aplicativo estará disponível em [http://localhost:3000](http://localhost:3000)

## Estrutura do Projeto

```
├── prisma/
│   └── schema.prisma          # Schema do banco de dados
├── scripts/
│   └── create-user.ts         # Script para criar usuário inicial
├── src/
│   ├── app/
│   │   ├── api/               # API Routes
│   │   ├── dashboard/         # Páginas do dashboard
│   │   ├── login/             # Página de login
│   │   └── layout.tsx         # Layout principal
│   ├── components/            # Componentes React
│   ├── lib/                   # Bibliotecas e utilitários
│   └── types/                 # Definições de tipos TypeScript
└── package.json
```

## Uso

1. Acesse a aplicação e faça login com as credenciais criadas
2. Navegue pelo dashboard usando o menu superior
3. Gerencie clientes, produtos e ordens de serviço
4. Imprima ordens de serviço clicando no botão "Imprimir"

## Desenvolvimento

Para gerar o cliente do Prisma após mudanças no schema:

```bash
npx prisma generate
```

Para abrir o Prisma Studio e visualizar o banco de dados:

```bash
npx prisma studio
```
