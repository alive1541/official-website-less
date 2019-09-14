#!/usr/bin/expect -f

set timeout 30
set dir official-website-less
# 上传文件夹
set remoteDir /home/ec2-user
set sshkey ~/.ssh/wsws.pem
# 项目文件夹
set projectDir /home/sysapp/website/server-start
set date [exec date "+%Y-%m-%d"]
# set username sysapp
# set host 123.56.11.198
# set password 8xqS&$&BzvAcb@s9
# set dir /home/sysapp
# set sendedProject build
# set project dist


spawn scp -i $sshkey ../$dir.tar.gz ec2-user@18.136.0.180:$remoteDir
expect "100%"


spawn ssh -i $sshkey ec2-user@18.136.0.180
expect "*#"

send "cd $projectDir\r"
expect "*#"

send "sudo su\r"
expect "*#"

send "rm $dir.tar.gz\r"
expect '?#'

send "yes\r"
expect "*#"

send "mv $remoteDir/$dir.tar.gz ./\r"
expect "*#"

send "tar -zxvf $dir.tar.gz\r"
expect "*#"

send "cd ./$dir\r"
expect "*#"

send "npm install\r"
expect "added *s#"

send "npm run build\r"
expect "*as static HTML#"

send "cd ../\r"
expect "*#"

send "mv ./$dir ../$dir-$date\r"
expect "*#"

send "cd ../$dir-$date\r"
expect "*#"

send "pm2 delete all\r"
expect "*#"

send "pm2 start --name offcial-website-less npm -- start\r"
expect "*#"

expect eof








