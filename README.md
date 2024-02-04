# AWS config

- chmod 400 ../helpup.pem
- ssh -i ../helpup.pem ec2-user@15.229.113.188

- sudo yum update -y
- sudo yum install git -y
- ssh-keygen -t rsa -b 4096 -C "felipebtu9@gmail.com"
- cat ~/.ssh/id_rsa.pub
- github -> profile -> settings -> ssh and gpg keys

- sudo yum install docker -y
- sudo systemctl start docker
- sudo systemctl enable docker
- sudo usermod -aG docker $USER

- docker build -t helpup_server .
- docker run -d -p 3333:3333 --name helpup_server_container helpup_server

- [domain](https://www.youtube.com/watch?v=d9Rade_vqq8)

- sudo yum install nginx -y
- sudo systemctl start nginx
- sudo systemctl enable nginx
- sudo nano /etc/nginx/conf.d/seu-domínio.conf

- server {
  listen 80;
  server_name seu-domínio.com www.seu-domínio.com;

      location / {
          proxy_pass http://localhost:3333;  # Substitua pela porta do seu aplicativo
          proxy_set_header Host $host;
          proxy_set_header X-Real-IP $remote_addr;
      }

  }

- sudo yum install certbot python3-certbot-nginx -y
- sudo certbot --nginx -d seu-domínio.com -d www.seu-domínio.com
- sudo systemctl restart nginx
- sudo nginx -t

