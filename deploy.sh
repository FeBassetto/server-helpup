# Atualize o código do GitHub

# Execute o build do aplicativo
nvm ls
nvm install 18.16.1
nvm use 18.16.1

npm i yarn pm2 -g

yarn build

# Reinicie o PM2
pm2 restart server