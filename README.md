# README #

Aplicação criada para o processo de seleção da vaga de Tech-Lead da empresa IOASYS

### LINGUAGENS USADAS ###
Node.js

### Banco de Dados ###
MongoDB

### Arquitetura ###
O projeto seguiu a arquitetuta baseada em microsevices

No projeto foi criado 2 microserviços:
1 - 'api-gateway'
2 - 'ms-user'

### api-gateway ###
Definição de todas os endpoints do projeto, middleware, portas
microserviço que vai escutar todas as entradas de requisições e distribuida para o microserviço o qual a rota foi definida.

### ms-user ###
Definição de todos os endpoints da regra de negocio do microserviço de usuario
Responsavel por chamar e retornar a execução de todos os processamentos da requisição para o api-gateway

### hp-message-iosasys ###
Pacote NPM publicado e consumido nos microserviços
Resposavel por traduzir as mensagens de retorno do servidor.

### hp-crud-iosasys ###
Pacote NPM publicado e consumido pelo microserviço de usuario
Resposavel pela modelagem do projeto e execução de toda regra de negocio das requisições (Inserções, consultas em Mongo, etc...).

### postman ###
'IOASYS.postman_collection.json' -> Arquivo para importação no software POSTMAN para vizualizar todas as rotas do projeto
'ioasys.postman_environment.json' -> Arquivo para importação no software POSTMAN para adicionar as variáveis do projeto

### PARA RODAR O PROJETO LOCAL ###

1 - Definir as variaveis de ambiente do projeto
  IOASYS_SECRET = "&2a&12&sKOdg7MsddeeqqDDdNiFtTaiqxZkdzuSE6PURSJGRp2aVu01NlSYeKp3psR172"
  DOMAIN_API_GATEWAY_IOASYS = "http://localhost:3000"
  DOMAIN_MS_USER_IOASYS = "http://localhost:5001"

2 - 'api-gateway' 
  npm install
  npm start ou nodemon (caso tenha)

3 - 'ms-user' 
  npm install
  npm start ou nodemon (caso tenha)

### STRING DE CONEXAO USADA PARA O PROJETO ### 
'mongodb+srv://ioasys:hireme2021@cluster0.5k1uq.mongodb.net/homolog?retryWrites=true&w=majority'

### DEPLOY ### 
Foi realizado o deploy do projeto no servidor da heroku (conta gratuita, obs: o servidor na conta gratuita pode demorar até 30seg para responder a requisição caso o microserviço nao tenha recebido nenhuma requisição a 30 min)

LINKS DE PRODUÇÃO DOS MICROSERVICOS

API-GATEWAY
https://api-gateway-ioasys.herokuapp.com/

MS-USER
https://ms-user-ioasys.herokuapp.com/

