# Kafka demo

## kafka-js-client

node based kafka producer and consumer for quick testing. Execute producer.js and consumer.js using node

## kafka-stream-demo

Basic filering example to explain usage.

# Demo Setup

Kafka demo using Red Panda

## scenerio

1. Producers produce dummy event to represent policy admin functions. partition key - policy_id
   payload structure

```
key = policy_id
value = OPPORTUNITY, ISSUED, RENEWAL_DUE, INVESTIGATION_REPORT_ADDED, CLAIM_INIT
```

2. Multiple consumer groups consumes the events,

- CLAIM consumer group is interested in CLAIM_INIT, INVESTIGATION_REPORT_ADDED, ISSUED
- SALES consumer group is interested in OPPORTUNITY, RENEWAL_DUE, ISSUED

topic name - policy_management
partitions - 3
replica - 3

## Create 3 mode cluster using docker

Tested with docker desktop

### create network and volues

```docker
docker network create -d bridge redpandanet
docker volume create redpanda1
docker volume create redpanda2
docker volume create redpanda3
```

### start nodes

```
docker run -d --pull=always --name=redpanda-1 --hostname=redpanda-1 --net=redpandanet -p 8081:8081 -p 8082:8082 -p 9092:9092 -p 9644:9644 -v "redpanda1:/var/lib/redpanda/data" docker.redpanda.com/vectorized/redpanda:v22.2.7 redpanda start --smp 1  --memory 1G  --reserve-memory 0M --overprovisioned --node-id 0 --check=false --pandaproxy-addr INSIDE://0.0.0.0:28082,OUTSIDE://0.0.0.0:8082 --advertise-pandaproxy-addr INSIDE://redpanda-1:28082,OUTSIDE://localhost:8082 --kafka-addr INSIDE://0.0.0.0:29092,OUTSIDE://0.0.0.0:9092 --advertise-kafka-addr INSIDE://redpanda-1:29092,OUTSIDE://localhost:9092 --rpc-addr 0.0.0.0:33145 --advertise-rpc-addr redpanda-1:33145

docker run -d --pull=always --name=redpanda-2 --hostname=redpanda-2 --net=redpandanet -p 8083:8083 -p 9093:9093 -v "redpanda2:/var/lib/redpanda/data" docker.redpanda.com/vectorized/redpanda:v22.2.7 redpanda start --smp 1  --memory 1G  --reserve-memory 0M --overprovisioned --node-id 1 --seeds "redpanda-1:33145" --check=false --pandaproxy-addr INSIDE://0.0.0.0:28083,OUTSIDE://0.0.0.0:8083 --advertise-pandaproxy-addr INSIDE://redpanda-2:28083,OUTSIDE://localhost:8083 --kafka-addr INSIDE://0.0.0.0:29093,OUTSIDE://0.0.0.0:9093 --advertise-kafka-addr INSIDE://redpanda-2:29093,OUTSIDE://localhost:9093 --rpc-addr 0.0.0.0:33146 --advertise-rpc-addr redpanda-2:33146

docker run -d --pull=always --name=redpanda-3 --hostname=redpanda-3 --net=redpandanet -p 8084:8084 -p 9094:9094 -v "redpanda3:/var/lib/redpanda/data" docker.redpanda.com/vectorized/redpanda:v22.2.7 redpanda start --smp 1  --memory 1G  --reserve-memory 0M --overprovisioned --node-id 2 --seeds "redpanda-1:33145" --check=false --pandaproxy-addr INSIDE://0.0.0.0:28084,OUTSIDE://0.0.0.0:8084 --advertise-pandaproxy-addr INSIDE://redpanda-3:28084,OUTSIDE://localhost:8084 --kafka-addr INSIDE://0.0.0.0:29094,OUTSIDE://0.0.0.0:9094 --advertise-kafka-addr INSIDE://redpanda-3:29094,OUTSIDE://localhost:9094 --rpc-addr 0.0.0.0:33147 --advertise-rpc-addr redpanda-3:33147
```

### create topic

//run rpk commands inside the nodes
we are using 3 partitions and 3 replicas. Hence every consumer group can have upto 3 consumers.

```
rpk topic create policy_management --partitions 3 --replicas 3
rpk topic create policy_management_sales --partitions 3 --replicas 1
rpk topic create policy_management_claims --partitions 3 --replicas 1

rpk topic list --detailed
//rpk topic delete policy_management
//rpk topic describe policy_management
```

### create consumer groups

we create consumer groups

```
rpk topic consume policy_management --group claims
rpk topic consume policy_management --group sales

//Validate the consumer member count
rpk group describe claims
//rpk group describe sales
//rpk group describe notification

```

### start consumers

we create three consumer groups

```
node consumer.js --topics policy_management_claims --consumerGroup claims
node consumer.js --topics policy_management_claims --consumerGroup claims
//Check rebalancing
//rpk group describe claims
node consumer.js --topics policy_management_sales --consumerGroup claims
node consumer.js --topics policy_management_sales --consumerGroup claims

```

### start kafka demo stream to filter and map messages

```

```

### start producers

```
node producer.js --topic policy_management
//node producer.js --topic policy_management
//node producer.js --topic policy_management
```

### cleanup

rpk topic delete policy_management
rpk group delete claims

### deletion

```
docker stop redpanda-1 redpanda-2 redpanda-3
docker rm redpanda-1 redpanda-2 redpanda-3

docker volume rm redpanda1 redpanda2 redpanda3
docker network rm redpandanet
```
