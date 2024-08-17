# MEC-Energia Web

Este repositório contém a implementação do frontend web do sistema MEC-Energia.

O sistema MEC-Energia tem por objetivo auxiliar as instituições de ensino superior (IES) a gerenciar e avaliar a adequação de contratos de conta de energia elétrica a partir do registro das faturas mensais de energia, gerando relatórios de recomendações de ajustes nos contratos visando economia de recursos.

A documentação online do sistema está disponível em [Documentação](https://lappis-unb.gitlab.io/projects/mec-energia/documentacao)

## Executar localmente

### Ambiente de desenvolvimento

O projeto utiliza ferramentas para controlar o formato dos commits. Para isso, é necessário ter o Node.js e o npm instalados. Instale as dependências com o comando abaixo:

##### 1. Pré-requisito Instalação das dependências

```bash
npm install

```

##### 2. Iniciar servidor de desenvolvimento

```bash
npm run dev
```

O servidor será iniciado em [http://localhost:3000](http://localhost:3000).



### Ambiente de desenvolvimento produção

Efetua e build do projeto, versão otimizada da aplicação para produção.

```bash
npm build
```

Inicie o servidor em produção.

```bash
npm start
```
Opcionalmente, você pode definir a porta para rodar o serviço. Exemplo:

```bash
npm start -- -p 80
```


## Usando ambientes com Docker e Makefile
Preencha os arquivos .env.dev, .env.test, e .env.prod com os valores necessários para cada ambiente.

### Ambiente de desenvolvimento
O ambiente de desenvolvimento, mesmo rodando em um container Docker, o Next.js é configurado no modo 
**dev** com **hot-reload**.
##### Subir o ambiente:

```bash
make build
make up
# ou 
make build-up
```

o servidor será iniciado em [http://localhost:3000](http://localhost:3000), se a porta padrão não foi alterada
 no arquivo **.env.dev**

##### derrubar o ambiente:
```bash
make down
```

Observação: Não é necessário instalar localmente as dependências para ter **node_modules** no ambiente. O container vai compartilhar o **node_modules** instalado no próprio container, permitindo uma melhor integração de com ferramentas de desenvolvimento como VSCode e seus recursos de autocompletar, linting e debugging.

### Ambiente de produção
O ambiente de produção, configurado localmente, utiliza variáveis de exemplo e se conecta a um backend local para simular exatamente como funcionará em produção.

##### Subir o ambiente:
```bash
make build-prod
make up-prod
# ou 
make build-up-prod
```

o servidor será iniciado em [http://localhost:3001](http://localhost:3001), se a porta padrão não foi alterada
 no arquivo **.env.dev**
##### Derrubar o ambiente:
```bash
make down-prod
```

### Ambiente de testes
O ambiente de testes é semelhante ao ambiente de produção, mas instala as dependências de desenvolvimento e está configurado por padrão para se conectar ao backend remoto. Isso pode ser alterado na variável de ambiente .envs/.env.test.

##### Subir o ambiente:
```bash
make build-test
make up-test
# ou 
make build-up-test
```

o servidor será iniciado em [http://localhost:3002](http://localhost:3002), se a porta padrão não foi alterada
 no arquivo **.env.dev**

##### Derrubar o ambiente:

```bash
make down-test
```

### Variáveis de ambiente
Dentro do diretório .envs, existem arquivos específicos para cada ambiente (.env.prod, .env.dev, .env.test). Esses arquivos estão preenchidos com valores de exemplo que devem ser modificados conforme necessário para cada ambiente.

- Ambiente de desenvolvimento: **.envs/.env.dev**
- Ambiente de teste: **.envs/.env.test**
- Ambiente de produção: **.envs/.env.prod**

### Observações
Os comandos de up (**up, build-up**) iniciam os containers no modo **-detach** ou **-d** (background), permitindo que os logs sejam acessados separadamente.  
Execute os comandos de build (**build, build-nc**) sempre que houver mudanças no código ou na configuração que necessitem recompilação das imagens Docker.

O comando **build-nc** é utilizado para construir as imagens Docker sem usar o cache, garantindo que todas as dependências sejam baixadas novamente. Isso é útil para garantir que a imagem final esteja atualizada e livre de possíveis inconsistências de cache.

Este comando funciona para todos os ambientes:
- Desenvolvimento: **make build-nc**
- Produção: make **build-nc-prod**
- Teste: make **build-nc-test**
