# Discord Bot Structure v14

<div align="center">

**Estrutura modular e escalável para bots Discord com discord.js v14, MongoDB e suporte a múltiplos ambientes**

![Último commit](https://img.shields.io/github/last-commit/giovannipereiradev/discord-bot-structure-v14?style=for-the-badge)
![Licença MIT](https://img.shields.io/github/license/giovannipereiradev/discord-bot-structure-v14?style=for-the-badge)
![Versão](https://img.shields.io/badge/version-1.0.0-blue?style=for-the-badge)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green?style=for-the-badge&logo=node.js)
![Discord.js](https://img.shields.io/badge/discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-optional-47A248?style=for-the-badge&logo=mongodb&logoColor=white)

</div>

## Sobre o Projeto

O **Discord Bot Structure v14** é uma base de desenvolvimento para bots no Discord construída com **Node.js** e **discord.js v14**. O objetivo é fornecer uma estrutura organizada, robusta e pronta para escalar — permitindo que o desenvolvedor foque na lógica do bot sem se preocupar com boilerplate.

A estrutura conta com carregamento automático de comandos e eventos via handlers dinâmicos, suporte a múltiplos ambientes (`development` / `production`) através de arquivos `.env` separados, integração opcional com **MongoDB** via Mongoose, e um sistema de log colorido com **Chalk** para facilitar o debug no terminal.

Este projeto demonstra boas práticas em arquitetura de bots: separação de responsabilidades, validação de configurações na inicialização, tratamento de erros por comando e utilitários reutilizáveis para embeds e mensagens.

## Features

| Recurso | Descrição |
|---|---|
| Handlers automáticos | Carregamento dinâmico de comandos e eventos via `commandHandler` e `eventHandler`, sem necessidade de importações manuais. |
| Multi-ambiente | Suporte nativo a `.env.development` e `.env.production`, alternando automaticamente conforme `NODE_ENV`. |
| Validação de config | Na inicialização, variáveis obrigatórias (`TOKEN`, `OWNER_ID`) são validadas; o processo encerra com mensagem clara se algo estiver faltando. |
| Integração com MongoDB | Conexão opcional via Mongoose. Se `MONGO_URI` não estiver definida, a aplicação sobe normalmente sem banco. |
| Sistema de log colorido | Logger com **Chalk** distinguindo `[DEV]` e `[PRD]` com cores, além de níveis `info`, `success`, `warn` e `error`. |
| Utilitários de mensagem | `messageBuilder.js` centraliza a criação de **Embeds** e mensagens formatadas com emojis configuráveis. |
| Controle de comandos | Cada comando suporta os campos `ownerOnly`, `enabled` e `cooldown`, com checagem automática no `interactionCreate`. |
| Deploy de Slash Commands | Script dedicado `deploy-commands.js` para registrar os comandos na API do Discord antes de subir o bot. |

## Arquitetura

O fluxo parte do `app.js`, que delega para o `src/index.js`. Este inicializa o client, conecta ao MongoDB e dispara os handlers para registrar comandos e eventos dinamicamente.

```
app.js
  └── src/index.js
        ├── loadConfig()         → Carrega .env baseado em NODE_ENV
        ├── connectMongo()       → Conecta ao MongoDB (opcional)
        ├── loadEvents(client)   → Varre src/events/**/*.js e registra listeners
        └── loadCommands(client) → Varre src/commands/**/*.js e popula client.commands
              │
              └── interactionCreate (event)
                    ├── Verifica ownerOnly / enabled
                    ├── Trata erros com reply/followUp seguro
                    └── command.execute(interaction, client)
```

Quando um usuário usa um Slash Command, o evento `interactionCreate` recupera o comando da `Collection`, aplica as validações (`ownerOnly`, `enabled`) e executa o handler correspondente. Erros são capturados individualmente, sem derrubar o processo.

## Tecnologias Utilizadas

- **Node.js 18+** — runtime JavaScript para o servidor, com suporte a ES Modules (`"type": "module"`).
- **discord.js 14.24.2** — biblioteca principal para interação com a API do Discord, com suporte completo a Slash Commands e GatewayIntents.
- **dotenv 17.2.3** — carregamento de variáveis de ambiente a partir de arquivos `.env` por ambiente.
- **cross-env 10.1.0** — define `NODE_ENV` de forma compatível entre sistemas operacionais nos scripts npm.
- **mongoose 8.19.3** — ODM para MongoDB, utilizado para modelagem e persistência de dados.
- **chalk 5.6.2** — formatação de texto colorido no terminal para o sistema de log.

## Instalação

### Pré-requisitos

- **Node.js** v18 ou superior
- **npm** v8 ou superior
- Um bot criado no [Discord Developer Portal](https://discord.com/developers/applications) com as permissões necessárias

### Clonando o repositório

```bash
git clone https://github.com/giovannipereiradev/discord-bot-structure-v14.git
cd discord-bot-structure-v14
```

### Instalando as dependências

```bash
npm install
```

## Configuração

O projeto utiliza arquivos `.env` separados por ambiente. Crie ou edite os arquivos na raiz do projeto:

**`.env.development`** — usado ao rodar com `npm run dev`:
```env
NODE_ENV=development
TOKEN=seu_token_de_desenvolvimento
MONGO_URI=mongodb://localhost:27017/meu-bot-dev
OWNER_ID=seu_discord_user_id
CLIENT_ID=id_da_aplicacao
GUILD_ID=id_do_servidor_de_testes
```

**`.env.production`** — usado ao rodar com `npm start`:
```env
NODE_ENV=production
TOKEN=seu_token_de_producao
MONGO_URI=sua_string_mongodb_atlas
OWNER_ID=seu_discord_user_id
CLIENT_ID=id_da_aplicacao
```

| Variável | Obrigatória | Descrição |
|---|---|---|
| `TOKEN` | ✅ Sim | Token do bot obtido no Discord Developer Portal. |
| `OWNER_ID` | ✅ Sim | ID do usuário Discord dono do bot. Usado para comandos `ownerOnly`. |
| `CLIENT_ID` | ⚠️ Deploy | ID da aplicação. Necessário para o `deploy-commands.js`. |
| `GUILD_ID` | ⚠️ Dev | ID do servidor de testes. Omitir registra comandos globalmente. |
| `MONGO_URI` | ❌ Não | String de conexão do MongoDB. Se ausente, o bot sobe sem banco. |

> **⚠️ Segurança:** Nunca suba os arquivos `.env.*` para o repositório. Eles já estão no `.gitignore`.

## Estrutura de Pastas

```
discord-bot-structure-v14/
│
├── src/
│   ├── commands/               # Comandos organizados por categoria
│   │   ├── admin/
│   │   └── utils/
│   │       └── ping.js         # Exemplo de comando
│   │
│   ├── events/                 # Eventos do Discord organizados por escopo
│   │   ├── client/
│   │   │   └── clientReady.js  # Evento: bot online
│   │   └── guild/
│   │       └── interactionCreate.js  # Evento: slash commands
│   │
│   ├── handlers/               # Lógica de carregamento automático
│   │   ├── commandHandler.js   # Varre e registra comandos
│   │   ├── eventHandler.js     # Varre e registra eventos
│   │   └── mongoHandler.js     # Gerencia conexão com MongoDB
│   │
│   ├── services/
│   │   └── logger.js           # Logger colorido com Chalk
│   │
│   ├── utils/
│   │   ├── config.json         # Configurações visuais (cores, emojis)
│   │   └── messageBuilder.js   # Utilitário para Embeds e mensagens
│   │
│   ├── deploy-commands.js      # Script de registro de Slash Commands
│   └── index.js                # Inicialização do client e handlers
│
├── app.js                      # Ponto de entrada
├── config.js                   # Carregamento e validação do .env
├── .env.development
├── .env.production
└── package.json
```

## Como Usar

### Rodando em desenvolvimento

```bash
npm run dev
```

Executa `deploy-commands.js` (registra comandos no servidor de testes via `GUILD_ID`) e sobe o bot com `NODE_ENV=development`.

### Rodando em produção

```bash
npm start
```

Executa `deploy-commands.js` globalmente e sobe o bot com `NODE_ENV=production`.

### Criando um novo comando

Crie um arquivo `.js` dentro de `src/commands/sua-categoria/`. O handler o detecta automaticamente.

```js
import { SlashCommandBuilder, PermissionFlagsBits } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('exemplo')
    .setDescription('Descrição do comando.')
    .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages),
  category: 'utils',
  cooldown: 5,
  ownerOnly: false,
  enabled: true,

  async execute(interaction, client) {
    await interaction.reply({ content: '✅ Funcionou!', ephemeral: true });
  }
};
```

### Criando um novo evento

Crie um arquivo `.js` dentro de `src/events/sua-categoria/`. O nome do arquivo deve ser o nome exato do evento Discord.

```js
// src/events/guild/messageCreate.js
export default async (message, client) => {
  if (message.author.bot) return;
  console.log(`Nova mensagem de ${message.author.tag}`);
};
```

## Contribuição

Contribuições são bem-vindas! Para contribuir:

1. **Faça um fork** do repositório.
2. Crie uma branch a partir da `main` com um nome descritivo:
   ```bash
   git checkout -b feature/adicionar-cooldown
   ```
3. Use o padrão **[Conventional Commits](https://www.conventionalcommits.org/pt-br/v1.0.0/)** nas mensagens (ex.: `feat: adicionar sistema de cooldown`).
4. Após implementar e testar, **abra um Pull Request** descrevendo suas alterações.
5. Aguarde a revisão e feedback.
