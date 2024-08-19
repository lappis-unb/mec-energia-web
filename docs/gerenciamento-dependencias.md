## Gerenciamento de dependências com npm

Este roteiro fornece orientações para gerenciar as dependências do projeto usando npm. Ele assegura que 
o package.json e o package-lock.json estejam sempre sincronizados e versionados corretamente, mantendo 
a consistência do ambiente de desenvolvimento e produção. 

#### 1. Adicionar uma nova biblioteca

##### Produção:

```bash
npm install [<package-spec> ...]
# aliases: add, i, in, ins, inst, insta, instal, isnt, isnta, isntal, isntall
```
##### Desenvolvimento:

```bash
npm install [<package-spec> ...] --save-dev
# -D, --save-dev: o pacote vai para devDependencies.
```

Este comando adiciona a biblioteca ao package.json e atualiza o package-lock.json. 
Para mais detalhes, consulte a [documentação oficial do npm](https://docs.npmjs.com/cli/v10/commands/npm-install).

#### 2. Atualizar uma biblioteca existente
Quando você precisa atualizar uma biblioteca específica para a versão mais recente permitida pelas regras de 
versionamento semântico no package.json:

```bash
npm update [<pkg>...]
# aliases: up, upgrade, udpate
```

Este comando atualizará a biblioteca para a versão mais recente permitida e atualizará o package-lock.json.


#### 3. Atualizar uma biblioteca para a última versão disponível

```bash
npm install <pkg>@latest
```

Este comando atualiza o package.json e o package-lock.json para a última versão disponível da biblioteca.
Para mais detalhes, consulte a [documentação oficial do npm](https://docs.npmjs.com/cli/v10/commands/npm-update).

#### 4. Atualizar todas as bibliotecas do projeto
Para atualizar todas as bibliotecas do projeto para as versões mais recentes permitidas pelas regras de 
versionamento semântico no package.json:

```bash
npm update
```

Este comando atualiza todas as bibliotecas para as versões mais recentes permitidas e atualizará o 
package-lock.json.

### Versionar dependências

Lembre-se de sempre versionar os arquivos **package.json** e **package-lock.json** após atualizar ou adicionar 
qualquer biblioteca. Isso garante que todas as dependências estejam sincronizadas e que o ambiente de 
desenvolvimento e produção permaneça consistente.
