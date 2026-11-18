# Hello World API — Docker e GitHub Actions

API Node.js com Express criada para a atividade de DevOps.

## Executar com Node.js

Use Node.js 22 ou superior. O Docker e o GitHub Actions utilizam Node.js 22,
também indicado no arquivo `.nvmrc`.

```bash
npm ci
npm start
```

Acesse [http://localhost:3000](http://localhost:3000). A resposta é `Hello World`.
O endpoint [http://localhost:3000/health](http://localhost:3000/health) retorna
`{"status":"ok"}` e permite verificar a disponibilidade da aplicação.

A variável de ambiente `PORT` altera a porta. Exemplo no PowerShell:

```powershell
$env:PORT = "4000"
npm start
```

## Executar com Docker

Inicie o Docker Desktop com o mecanismo de contêineres Linux e execute os
comandos na pasta do projeto:

```bash
docker build -t hello-world-api .
docker run --rm -p 3000:3000 --name hello-world-api hello-world-api
```

A API fica disponível em [http://localhost:3000](http://localhost:3000).
Use `Ctrl+C` para parar o contêiner. Para utilizar outra porta do computador,
altere o mapeamento para `-p 4000:3000`, por exemplo.

O `Dockerfile` instala as dependências com `npm ci --omit=dev`, executa o
processo como usuário `node` e inclui uma verificação de saúde em `/health`.
O `.dockerignore` exclui dependências locais, arquivos Git, testes e arquivos
de ambiente do contexto de construção.

## Executar com Docker Compose

```bash
docker compose up --build -d --wait
docker compose ps
```

Para encerrar e remover os contêineres do projeto:

```bash
docker compose down
```

O Compose usa a porta 3000 por padrão. A variável `PORT` altera a porta do
computador, mantendo a porta 3000 dentro do contêiner. Exemplo no PowerShell:

```powershell
$env:PORT = "4000"
docker compose up --build -d --wait
```

## Testes

```bash
npm test
```

Os testes usam o executor nativo do Node.js e fazem requisições HTTP reais
para verificar `GET /`, `GET /health` e a resposta 404 de uma rota inexistente.
Cada execução utiliza uma porta livre e encerra o servidor ao terminar.

## GitHub Actions

O arquivo `.github/workflows/deploy.yml` executa o fluxo em pushes para `main`
ou `master`, em pull requests e por acionamento manual na aba **Actions**.

1. Instala as dependências com `npm ci` e executa `npm test`.
2. Constrói a imagem Docker após a aprovação dos testes.
3. Inicia um contêiner e verifica `/health` e a resposta `Hello World`.
4. Publica a mesma imagem testada no GitHub Container Registry (GHCR), com as
   tags `latest` e o SHA completo do commit, em execuções de `main` ou `master`.
   Pull requests apenas validam a aplicação e o contêiner.

O nome da imagem é `ghcr.io/<proprietario>/<repositorio>`, em letras minúsculas.
O fluxo usa o `GITHUB_TOKEN` fornecido pelo GitHub e concede `packages: write`
ao job Docker para publicar a imagem. Não é necessário cadastrar credenciais
do Docker Hub. O repositório ou a organização precisa permitir o uso de Actions
e a publicação de pacotes; um pacote GHCR já existente precisa conceder acesso
de escrita ao repositório.

Envie os arquivos ao repositório GitHub para executar o fluxo. A publicação
disponibiliza a imagem no GHCR; para executar a API em um servidor, utilize
essa imagem com Docker. Para imagens privadas, autentique-se no GHCR antes
de baixá-las.
