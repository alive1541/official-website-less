#!/bin/bash

echo '====================== npm install ======================'

npm install

echo '====================== npm install end ======================'

echo '====================== build start ======================'

npm run build

echo '====================== build end ======================'

pm2 delete offcial-website-less

pm2 start --name offcial-website-less npm -- start