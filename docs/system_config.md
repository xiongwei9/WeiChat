# system: Ubuntu 16.04

安装git：

    sudo apt install git

安装中文输入法：

    sudo apt install fcitx-table-wbpy fcitx-table-wubi

安装mysql：

    sudo apt install mysql-server

安装nodejs：
````
wget https://nodejs.org/dist/v8.9.4/node-v8.9.4-linux-x64.tar.xz
tar -xvf node-v8.9.4-linux-x64.tar.xz
sudo mv node-v8.9.4-linux-x64 /usr/local
sudo ln -s /usr/local/node-v8.9.4-linux-x64/bin/node /usr/local/bin/node 
sudo ln -s /usr/local/node-v8.9.4-linux-x64/bin/npm /usr/local/bin/npm
````

安装nginx：

    sudo apt install nginx

更改主题：
````
sudo add-apt-repository ppa:noobslab/themes
sudo apt-get update
sudo apt-get install flatabulous-theme
sudo add-apt-repository ppa:noobslab/icons
sudo apt-get update
sudo apt-get install ultra-flat-icons
# 打开unity-tweak-tool
````