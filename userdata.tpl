#!/bin/bash
apt-get update -y
apt-get install -y docker.io
systemctl start docker
systemctl enable docker
docker login -u ${dockerhub_username} -p ${dockerhub_password}
docker pull pat0112/spendy:latest
docker run -d -p 3000:3000 pat0112/spendy:latest