#!/bin/bash

#start docker dynamodb
docker network create sam-nw
docker run --network sam-nw --name ddb-local -d -p 8000:8000 amazon/dynamodb-local

aws dynamodb create-table --generate-cli-skeleton > create-mytable.json

#modify the template
aws dynamodb create-table --cli-input-json file://database_models/create-mytable.json --endpoint-url http://localhost:8000
aws dynamodb update-table --table-name 'mytable' --stream-specification StreamEnabled=true,StreamViewType=NEW_AND_OLD_IMAGES --endpoint-url http://localhost:8000
aws dynamodb delete-table --table-name mytable --endpoint-url http://localhost:8000

aws dynamodb describe-table --table-name 'Devices' --endpoint-url http://localhost:8000 --query 'Table.LatestStreamArn' --output text
aws dynamodb describe-table --table-name 'Devices' --endpoint-url http://localhost:8000 --output text

aws dynamodb list-tables --endpoint-url http://localhost:8000

#This creates the 'Devices' table
aws dynamodb create-table --cli-input-json file://database_models/iOT_devices_cf_template.json --endpoint-url http://localhost:8000
aws dynamodb scan --table-name Devices --endpoint-url http://localhost:8000
aws dynamodb delete-table --table-name Devices --endpoint-url http://localhost:8000

sam local invoke insertDeviceReading --event events/iot-event.json --env-vars env.json --profile default --docker-network sam-nw
sam local invoke getAllReadings--event events/event-get-all-items.json --env-vars env.json --profile chad-eventbroker-dev --docker-network sam-nw

sam local invoke getAllReadings --event events/event-get-all-items.json --env-vars env.json --profile default --docker-network sam-nw
sam local invoke getDeviceReadingById --event events/event-get-by-id.json --env-vars env.json --profile default --docker-network sam-nw

sam local invoke deleteDeviceReadingById --event events/event-delete-by-id.json --env-vars env.json --profile default --docker-network sam-nw

