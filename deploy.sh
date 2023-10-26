# Atualize o código do GitHub
git pull

# Execute o build do aplicativo
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.profile
nvm ls-remote
nvm install 18.16.1
nvm use 18.16.1

npm i yarn pm2 -g

yarn build

# Reinicie o PM2
pm2 restart server