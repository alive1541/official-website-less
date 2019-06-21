#!/bin/bash

echo '====================== build start ======================'

npm run build

echo '====================== build end ======================'

pm2 delete offcial-website-less

pm2 start --name offcial-website-less npm -- start