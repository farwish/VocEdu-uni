#!/bin/bash

scp -o StrictHostKeyChecking=no -o UserKnownHostsFile=/dev/null -r unpackage/dist/build/h5 root@121.41.123.125:/root/voc/public/
