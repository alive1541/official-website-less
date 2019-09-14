#!/bin/bash

dir=official-website-less

# if [ -f ./node_modules ];then
# # 文件存在
# rm -rf ./node_modules
# else
# echo 'node_modules不存在'
# fi
rm -rf ./node_modules

tarDir(){
  tar -zcvf ../$dir.tar.gz ../$dir
}

removeTar(){
   rm ../$dir.tar.gz
}

if [ ! -f ../$dir.tar.gz ];then
# 文件不存在
tarDir
else
# 文件存在
removeTar
echo '文件删除'
tarDir
fi

chmod 777 ./upload.sh
./upload.sh

echo '---------------------------- upload ready ----------------------------'



