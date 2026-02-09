# ทำ Fast forward port
## เพื่อให้ HTTP -> HTTPS
-- วิธีติดตั้ง
https://chocolatey.org/install#individual
Check -> choco -v 

choco install mkcert
mkcert --version
mkcert localhost

yarn add -D local-ssl-proxy

ปล. ถ้ามันขึ้นเกี่ยวกับ Certify ให้กด yes ไปนะ 
จากนี้ไปตอน dev ให้ใช้คำสั่ง yarn dev:https แทน
จะมีไฟล์เพิ่มอีก 2 ไฟล์ ซึ่ง gitignore มัน ignore file ให้อยู่แล้ว


## Tools
yarn add humps
yarn add -D @types/humps