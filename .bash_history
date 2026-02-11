wget https://repo.zabbix.com/zabbix/6.4/ubuntu/pool/main/z/zabbix-release/zabbix-release_6.4-1+ubuntu24.04_all.deb
sudo dpkg -i zabbix-release_6.4-1+ubuntu24.04_all.deb
sudo apt update
sudo apt install zabbix-server-pgsql zabbix-frontend-php zabbix-apache-conf zabbix-agent postgresql snmp -y
systemctl status zabbix-server
sudo -u postgres psql
zcat /usr/share/zabbix-sql-scripts/postgresql/server.sql.gz | sudo -u zabbix psql zabbix
ls /usr/share/zabbix-sql-scripts/postgresql/
sudo apt install zabbix-sql-scripts -y
ls /usr/share/zabbix-sql-scripts/postgresql/
zcat /usr/share/zabbix-sql-scripts/postgresql/server.sql.gz | sudo -u zabbix psql zabbix
sudo -u postgres psql
zcat /usr/share/zabbix-sql-scripts/postgresql/server.sql.gz | sudo -u zabbix psql zabbix
sudo systemctl start zabbix-server
systemctl status zabbix-server
sudo systemctl enable zabbix-server
sudo systemctl restart apache2
sudo systemctl start zabbix-agent
sudo systemctl enable zabbix-agent
http://192.168.124.134/zabbix
sudo apt install php-pgsql -y
sudo systemctl restart apache2
snmpwalk -v2c -c public 172.18.1.14
ping 172.18.1.14
snmpwalk -v2c -c public 172.18.1.14 sysDescr
snmpwalk -v2c -c public 172.18.1.14 1.3.6.1.2.1.1.1
snmpwalk -v2c -c public 192.168.4.2 1.3.6.1.2.1.1.1
snmpwalk -v2c -c public 192.168.1.5 1.3.6.1.2.1.1.1
snmpwalk -v2c -c public 172.18.1.14 1.3.6.1.2.1.1
nano ~/zte_c320_template.xml
ls
uuidgen
zabbix -v
snmpwalk -v2c -c public 172.18.1.14 1.3.6.1.2.1.1
sudo systemctl status zabbix-server
sudo nano /etc/zabbix/web/zabbix.conf.php
sudo nano /etc/zabbix/zabbix_server.conf
cat /run/zabbix/zabbix_server.pid
sudo tail -n 30 /var/log/apache2/error.log
sudo tail -n 30 /var/log/php8.1-fpm.log
PHP Warning:  Unable to connect to Zabbix server
sudo systemctl restart zabbix-server
sudo chown -R www-data:zabbix /run/zabbix /var/log/zabbix
sudo chmod -R 755 /run/zabbix /var/log/zabbix
zabbix_get -s 127.0.0.1 -k "zabbix[log]"
sudo apt update
sudo apt install zabbix-get
zabbix_get -s 172.18.1.14 -k system.cpu.load[all,avg1]
snmpwalk -v2c -c public 172.18.1.14
snmpwalk -v2c -c public 172.18.1.14 1.3.6.1.2.1.1
snmpwalk -v2c -c public 172.18.1.14 1.3.6.1.2.1.1
snmpget -v2c -c public 172.18.1.14 1.3.6.1.2.1.1.1.0
snmpget -v2c -c public 172.18.1.14 1.3.6.1.2.1.1.3.0
snmpget -v2c -c public 172.18.1.14 1.3.6.1.2.1.1.4.0
snmpget -v2c -c public 172.18.1.14 1.3.6.1.2.1.1.5.0
snmpget -v2c -c public 172.18.1.14 1.3.6.1.2.1.1.6.0
snmpwalk -v2c -c public 172.18.1.14 1.3.6.1.2.1.1
sudo systemctl status zabbix-server
sudo systemctl enable zabbix-server
sudo systemctl restart zabbix-server
sudo systemctl status zabbix-server
sudo journalctl -xeu zabbix-server
sudo chown -R zabbix:zabbix /var/log/zabbix
sudo chmod -R 755 /var/log/zabbix
sudo chown -R zabbix:zabbix /run/zabbix
sudo chmod -R 755 /run/zabbix
sudo systemctl restart zabbix-server
sudo systemctl status zabbix-server
sudo tail -n 50 /var/log/zabbix/zabbix_server.log
sudo nano /etc/zabbix/zabbix_server.conf
sudo -u postgres psql
sudo systemctl restart zabbix-server
sudo systemctl status zabbix-server
sudo nano /etc/zabbix/zabbix_server.conf
psql -h localhost -U zabbix -W zabbix
sudo -u postgres psql
sudo nano /etc/zabbix/zabbix_server.conf
sudo systemctl restart zabbix-server
sudo tail -n 30 /var/log/zabbix/zabbix_server.log
ogyy@djuanda:~$ sudo tail -n 30 /var/log/zabbix/zabbix_server.log
163046:20260119:073347.594 [Z3001] connection to database 'zabbix' failed: [0] connection to server at "localhost" (127.0.0.1), port 5432 failed: fe_sendauth: no password supplied
163046:20260119:073347.594 database is down: reconnecting in 10 seconds
163046:20260119:073357.606 [Z3001] connection to database 'zabbix' failed: [0] connection to server at "localhost" (127.0.0.1), port 5432 failed: fe_sendauth: no password supplied
163046:20260119:073357.606 database is down: reconnecting in 10 seconds
163046:20260119:073407.616 [Z3001] connection to database 'zabbix' failed: [0] connection to server at "localhost" (127.0.0.1), port 5432 failed: fe_sendauth: no password supplied
163046:20260119:073407.617 database is down: reconnecting in 10 seconds
163046:20260119:073417.623 [Z3001] connection to database 'zabbix' failed: [0] connection to server at "localhost" (127.0.0.1), port 5432 failed: fe_sendauth: no password supplied
163046:20260119:073417.623 database is down: reconnecting in 10 seconds
163046:20260119:073427.134 Got signal [signal:15(SIGTERM),sender_pid:166401,sender_uid:0,reason:0]. Exiting ...
163046:20260119:073427.134 Zabbix Server stopped. Zabbix 6.4.21 (revision 58bcc6747a9).
166406:20260119:073427.165 Starting Zabbix Server. Zabbix 6.4.21 (revision 58bcc6747a9).
166406:20260119:073427.165 ****** Enabled features ******
166406:20260119:073427.165 SNMP monitoring:           YES
166406:20260119:073427.165 IPMI monitoring:           YES
166406:20260119:073427.165 Web monitoring:            YES
166406:20260119:073427.165 VMware monitoring:         YES
166406:20260119:073427.165 SMTP authentication:       YES
166406:20260119:073427.165 ODBC:                      YES
166406:20260119:073427.165 SSH support:               YES
166406:20260119:073427.165 IPv6 support:              YES
166406:20260119:073427.165 TLS support:               YES
166406:20260119:073427.165 ******************************
166406:20260119:073427.165 using configuration file: /etc/zabbix/zabbix_server.conf
166406:20260119:073427.173 [Z3001] connection to database 'zabbix' failed: [0] connection to server at "localhost" (127.0.0.1), port 5432 failed: fe_sendauth: no password supplied
166406:20260119:073427.173 database is down: reconnecting in 10 seconds
ogyy@djuanda:~$
sudo systemctl status zabbix-server
sudo tail -n 30 /var/log/zabbix/zabbix_server.log
sudo nano /etc/zabbix/zabbix_server.conf
sudo tail -n 30 /var/log/zabbix/zabbix_server.log
psql -h localhost -U zabbix -d zabbix
sudo -u postgres psql
sudo systemctl restart postgresql
sudo nano /etc/postgresql/16/main/pg_hba.conf
sudo tail -n 20 /var/log/zabbix/zabbix_server.log
sudo systemctl restart zabbix-server
sudo tail -n 20 /var/log/zabbix/zabbix_server.log
sudo systemctl status zabbix-server
/etc/zabbix/web/zabbix.conf.php
sudo systemctl restart zabbix-agent
sudo systemctl enable zabbix-agent
/etc/zabbix/web/zabbix.conf.php
sudo cat /etc/zabbix/web/zabbix.conf.php
/etc/zabbix/web/zabbix.conf.php
sudo systemctl restart zabbix-agent
sudo tail -n 20 /var/log/zabbix/zabbix_server.log
sudo systemctl restart apache2
sudo systemctl restart zabbix-server
sudo tail -n 20 /var/log/zabbix/zabbix_server.log
sudo nano /etc/zabbix/zabbix_server.conf
sudo tail -n 20 /var/log/zabbix/zabbix_server.log
sudo nano /etc/zabbix/zabbix_server.conf
sudo systemctl restart zabbix-server
sudo systemctl status zabbix-server
sudo tail -n 20 /var/log/zabbix/zabbix_server.log
snmpwalk -v2c -c public <172.18.1.14> .1
snmpwalk -v2c -c public 172.18.1.14 .1
snmpwalk -v2c -c public 172.18.1.14 .1.3.6.1.4.1.3902.1012.3.50.15.3.1.1
sudo apt update && sudo apt upgrade -y
sudo apt install -y curl git unzip
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node -v
nmp -v
npm -v
mkdir -p /var/www
cd /var/www
npm create vite@latest smartolt-ui -- --template react
cd ~
npm create vite@latest smartolt-ui -- --template react
cd smartoly-ui
cd smartolt-ui
npm install
npm run dev -- --host 0.0.0.0 --port 5173
nano src/App.jsx
npm run dev -- --host 0.0.0.0 --port 5173
cd ~/smartolt-ui
nano src/App.jsx
ls
ls src
cd ~/smartolt-ui/src
ls
rm App.jsx
ls
nano App.jsx
cd ~/smartolt-ui
ls /src
ls src
nano src/OnuConfiguredPage.jsx
nano src/SmartOltPrototypeApp.tsx
cd ~/smartolt-ui
npm i lucide-react recharts
npm i -D typescript @types/react @types/react-dom
nano tsconfig.json
import { Card } from "@/components/ui/card";
nano vite.config.js
npm i -D @types/node
npx shadcn@latest init
npm i -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm ls tailwindcss
./node_modules/.bin/tailwindcss init -p
pwd
ls
npm ls tailwindcss
rm -rf node_modules package-lock.json
npm cache verify
npm install
npm i -D tailwindcss postcss autoprefixer
ls -la node_modules/.bin | grep tailwind
ls
ls -la node_modules/.bin | grep tailwind
npm remove tailwindcss
npm i -D tailwindcss@3.4.17 postcss autoprefixer
ls -la node_modules/.bin
ls -la 
npx tailwindcss init -p
nano tailwind.config.js
nano src/index.css
npm run dev -- --host 0.0.0.0 --port 5173
npx shadcn@latest init
nano tsconfig.json
nano vite.config.js\
nano vite.config.js
npm run dev -- --host 0.0.0.0 --port 5173
npx shadcn@latest init
npx shadcn@latest add card button input badge select switch checkbox separator progress dialog table
npm i lucide-react recharts
cat tsconfig.json
ls -la tsconfig*.json
nano tsconfig.app.json
npx shadcn@latest init
npx shadcn@latest add card button input badge select switch checkbox separator progress dialog table
ls src
nano src/App.jsx
npm run dev -- --host 0.0.0.0 --port 5173
python3 --version
mkdir -p ~/smartolt-backend
cd ~/smartolt-backend
source venv/bin/activate
ls
python3 -m venv venv
ls -la
source venv/bin/activate
source veny/bin/activate
source venv/bin/activate
cd ~/smartolt-backend
ls -la venv
ls -la venv/bin
sudo apt update
sudo apt install -y python3-venv
cd ~/smartolt-backend
rm -rf venv
python3 -m venv venv
ls -la venv/bin
ls -la venv/bin | egrep "activate|pip|python"
source venv/bin/activate
pip install fastapi uvicorn
pip list | grep -E "fastapi|uvicorn"
cd ~/smartolt-backend
nano main.py
uvicorn main:app --host 0.0.0.0 --port 8000
curl http://127.0.0.1:8000/api/onus
http://127.0.0.1:8000/api/onus
curl http://127.0.0.1:8000/
cd ~/smartolt-backend
http://127.0.0.1:8000/api/onus
cd ~/smartolt-backend
http://127.0.0.1:8000/api/onus
curl http://127.0.0.1:8000/
ss -ltnp | grep ':8000' || echo "PORT 8000 TIDAK LISTEN"
curl -v http://127.0.0.1:8000/
curl -v http://192.168.124.134:8000/
kill 108140 108147
ss -ltnp | grep ':8000' || echo "PORT 8000 TIDAK LISTEN"
curl http://127.0.0.1:8000/api/onus
curl -v http://127.0.0.1:8000/
cd ~/smartolt-backend
sed -n '1,120p' main.py
nano main.py
cd ~/smartolt-ui
nano src/SmartOltPrototypeApp.tsx
ls ~src
ls src/
cd ~/smartolt-backend
ls -la
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
curl http://127.0.0.1:8000/api/onus
ss -ltnp | grep ':8000'
ss -ltnp | grep ':8000' || echo "PORT 8000 TIDAK LISTEN"
ps aux | grep -E "uvicorn|main:app" | grep -v grep
cd ~/smartolt-backend
source venv/bin/activate
uvicorn main:app --host 127.0.0.1 --port 8000
ss -ltnp | grep ':8000'
curl http://192.168.124.134:8000/api/onus
~/smartolt-backend/main.py
q
cd ~
cd ~/smattrolt-backend
cd ~/smartolt-backend
ls
nano main.py
cd ~/smartolt-backend
source venv/bin/activate
nano main.py
curl http://127.0.0.1:8000/api/onus
cd ~/smartolt-ui
nano .env
cd ~/smartolt-ui
ls
deactivate
npm run dev -- --host 0.0.0.0 --port 5173
find src -maxdepth 2 -type f | sed 's#^#- #'
nano src/App.jsx
nano src/lib/api.ts
nano src/SmartOltPrototypeApp.tsx
npm run dev -- --host 0.0.0.0 --port 5173
ip -4 addr | grep -oP '(?<=inet\s)\d+(\.\d+){3}' | head -n 1
curl http://192.168.1.50:8000/api/onus
ip a
curl http://192.168.124.134:8000/api/onus
ss -ltnp | grep ':8000' || echo "PORT 8000 TIDAK LISTEN"
ps aux | grep -E "uvicorn|main:app" | grep -v grep
cd ~/smartolt-backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000
kill 80289
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
npm run dev -- --host 0.0.0.0 --port 5173
find src -maxdepth 2 -type f | sed 's#^#- #'
ls
nano main.py
/home/ogy/smartolt-backend/main.py
/home/ogyy/smartolt-backend/main.py
cd ~/smartolt-backend
ls
nano main.py
curl http://127.0.0.1:8000/api/onus
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
cd ~/smartolt-backend
source venv/bin/activate
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
