#!/bin/bash

export NVM_DIR=~/.nvm
source ~/.nvm/nvm.sh

nvm use 8
SOURCE=`pwd`

function clean {
    echo "start"
    echo "clearing previous build folder..."
    rm -rf build
}

function build_front_end {
    echo "compiling front-end code..."
    cd $SOURCE/front-end
    npm install && ng build --prod
}

function build_back_end {
    echo "compiling back-end code..."
    cd $SOURCE/back-end
    npm install && tsc
}


function copy_config {
    # make sure build folder exists
    mkdir  build

    echo "copying package.json"
    cd $SOURCE
    cp $SOURCE/back-end/package.json build

    echo "copying eb environment config"
    cd $SOURCE
    cp -rf $SOURCE/dist/.ebextensions build/
    cp -rf $SOURCE/dist/.elasticbeanstalk build/
    cp -rf $SOURCE/dist/* build/
}

if [ $# -eq 0 ]; then
    echo "Missing one of the following arguments: [clean, all, front-end, back-end, v2, config]"
elif [ $1 == 'clean' ]; then
    clean
elif [ $1 == 'v2' ]; then
    build_v2
elif [ $1 == 'front-end' ]; then
    build_front_end
elif [ $1 == 'back-end' ]; then
    build_back_end
elif [ $1 == 'config' ]; then
    copy_config
elif [ $1 == 'all' ]; then
    clean
    build_front_end
    build_back_end
    copy_config
else
    echo "Missing one of the following arguments: [clean, all, front-end, back-end, v2, config]"
    exit 1
fi