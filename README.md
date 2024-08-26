# MEC-Energia Web

Este repositório contém a implementação do frontend web do sistema MEC-Energia.

O sistema MEC-Energia tem por objetivo auxiliar as instituições de ensino superior (IES) a gerenciar e avaliar a 
adequação de contratos de conta de energia elétrica a partir do registro das faturas mensais de energia, gerando 
relatórios de recomendações de ajustes nos contratos visando economia de recursos.

A documentação online do sistema está disponível em [Documentação](https://lappis-unb.gitlab.io/projects/mec-energia/documentacao)


## Configuração de ambientes via Docker e Makefile

### Pré-requisitos
- Docker: Certifique-se de que o Docker está instalado e funcionando em sua máquina.
- Make: Certifique-se de ter o make instalado.
- Preencha os arquivos .env.dev, .env.test, e .env.prod com os valores necessários para cada ambiente.

### Ambiente de desenvolvimento
O ambiente de desenvolvimento, mesmo rodando em um container Docker, o Next.js é configurado no modo 
**dev** com **hot-reload**.

##### Construir e levantar o ambiente com Make:

```bash
make build && make up
# ou 
make build-up
```
##### Sem Make (usando Docker Compose diretamente):


```bash
# Copiar o arquivo .env apropriado para o diretório raiz:
cp .envs/.env.dev .env

# Construir e levantar os serviços:
docker compose up --build
```

o servidor será iniciado em [http://localhost:3000](http://localhost:3000), se a porta padrão não foi alterada
 no arquivo **.env.dev**

##### Derrubar o ambiente:
```bash
# com make
make down

# sem make
docker compose down
```

Observação: Não é necessário instalar localmente as dependências para ter **node_modules** no ambiente. O 
container vai compartilhar o **node_modules** instalado no próprio container, permitindo uma melhor integração 
de com ferramentas de desenvolvimento como VSCode e seus recursos de autocompletar, linting e debugging.

### Ambiente de testes
O ambiente de testes é configurado para replicar o ambiente de produção localmente, facilitando a simulação de 
cenários de produção. O ambiente de teste é semelhante, mas inclui dependências de desenvolvimento, adequado 
para uma ampla variedade de testes. Inicialmente está configurado para se conectar ao backend remoto,  mas 
também pode ser ajustado para se conectar a um backend local. Essas configurações podem ser ajustadas através 
do arquivo .envs/.env.test.

##### Construir e levantar o ambiente com Make:
```bash
make build-test && make up-test
# ou 
make build-up-test
```

##### Sem Make (usando Docker Compose diretamente):
```bash
# Copiar o arquivo .env apropriado para o diretório raiz:
cp .envs/.env.test .env

# Construir e levantar os serviços:
docker compose -f compose-test.yml up --build
```

o servidor será iniciado em [http://localhost:3002](http://localhost:3002), se a porta padrão não foi alterada
 no arquivo **.env.test**

##### derrubar o ambiente:
```bash
# com make
make down-test

# sem make
docker compose -f compose-test.yml down
```

### Ambiente de produção

Atualmente, o ambiente de produção ainda está em fase de planejamento e não disponível neste repositório. Ele requer 
a integração de serviços como Nginx ou Traefik, além de configurações específicas na máquina host, possivelmente com 
Ansible. Rodar este ambiente localmente não é viável sem modificações significativas em redes externas, volumes e 
exposição de portas.

No entanto, o ambiente de testes permite uma simulação precisa do ambiente de produção, replicando todas as fases de 
build e geração dos arquivos estáticos, e rodando com um servidor Node para testes completos e confiáveis.



### Observações
Os comandos de up (**up, build-up**) iniciam os containers no modo **-detach** ou **-d** (background), permitindo 
que os logs sejam acessados separadamente. Execute os comandos de build (**build, build-nc**) sempre que houver 
mudanças no código ou na configuração que necessitem recompilação das imagens Docker.

O comando **build-nc** é utilizado para construir as imagens Docker sem usar o cache, garantindo que todas as 
dependências sejam baixadas novamente. Isso é útil para garantir que a imagem final esteja atualizada e livre de 
possíveis inconsistências de cache.

Este comando funciona para todos os ambientes:
- Desenvolvimento: **make build-nc**
- Produção: make **build-nc-prod**
- Teste: make **build-nc-test**

## Execução local sem Docker

Embora seja possível rodar o projeto localmente, a recomendação é utilizar o Docker para uma configuração mais 
robusta e consistente.

#### Desenvolvimento

```bash
# 1. Instale as dependências:
npm install

# 2. Inicie o servidor de desenvolvimento:
npm run dev
```

#### Produção

```bash
# 1. Faça o build do projeto:
npm run build

# 2. Inicie o servidor de produção:
npm start
```

O servidor será iniciado em [http://localhost:3000](http://localhost:3000).
