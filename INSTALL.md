# Instruções de Instalação

## Passo a Passo

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Banco de Dados PostgreSQL

Certifique-se de que o PostgreSQL está rodando e acessível em:
- **Host**: localhost
- **Port**: 5432
- **Database**: postgres
- **Username**: postgres
- **Password**: (sua senha do PostgreSQL)

### 3. Criar Arquivo .env

Crie um arquivo `.env` na raiz do projeto com o seguinte conteúdo:

```env
DATABASE_URL="postgresql://postgres:SUA_SENHA_AQUI@localhost:5432/postgres?schema=public"
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="gere-uma-chave-secreta-aleatoria-aqui"
```

**Importante:**
- Substitua `SUA_SENHA_AQUI` pela senha real do seu PostgreSQL
- Gere uma chave secreta aleatória para `NEXTAUTH_SECRET` (você pode usar qualquer string longa e aleatória)

### 4. Executar Migrations do Prisma

```bash
npx prisma migrate dev --name init
```

Isso criará as tabelas no banco de dados PostgreSQL.

### 5. Criar Usuário Administrador

Execute o script para criar o primeiro usuário:

```bash
npx ts-node --project tsconfig.scripts.json scripts/create-user.ts
```

Ou com parâmetros customizados:

```bash
npx ts-node --project tsconfig.scripts.json scripts/create-user.ts email@exemplo.com senha123 Nome do Usuário
```

**Usuário padrão criado:**
- Email: admin@loja.com
- Senha: admin123
- Nome: Administrador

### 6. Iniciar o Servidor de Desenvolvimento

```bash
npm run dev
```

### 7. Acessar a Aplicação

Abra seu navegador em: http://localhost:3000

Faça login com as credenciais criadas no passo 5.

## Comandos Úteis

### Gerar Cliente Prisma (após mudanças no schema)

```bash
npx prisma generate
```

### Abrir Prisma Studio (interface visual do banco)

```bash
npx prisma studio
```

### Criar nova migration

```bash
npx prisma migrate dev --name nome-da-migration
```

### Build para produção

```bash
npm run build
npm start
```

## Estrutura das Páginas

- `/login` - Página de login
- `/dashboard` - Dashboard principal com estatísticas
- `/dashboard/clients` - Gerenciar clientes
- `/dashboard/products` - Gerenciar produtos/estoque
- `/dashboard/orders` - Gerenciar ordens de serviço
- `/dashboard/orders/[id]` - Visualizar ordem de serviço
- `/dashboard/orders/[id]/print` - Imprimir ordem de serviço

## Solução de Problemas

### Erro de conexão com o banco de dados

1. Verifique se o PostgreSQL está rodando
2. Confirme as credenciais no arquivo `.env`
3. Teste a conexão: `psql -h localhost -U postgres -d postgres`

### Erro ao executar migrations

Certifique-se de que o banco de dados `postgres` existe e está acessível.

### Erro ao criar usuário

Verifique se as migrations foram executadas corretamente e se o banco está configurado.
