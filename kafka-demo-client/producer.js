#!/usr/bin/env node

const { brokers = "localhost:9092,localhost:9093,localhost:9094", topic } =
  require("yargs")
    .scriptName("producer")
    .usage("Usage: $0 --brokers string --topic string")
    .demand(["topic"]).argv;

const { Kafka, CompressionTypes, logLevel } = require("kafkajs");

// create a Kafka client
const kafka = new Kafka({
  brokers: brokers.split(","),
  //  logLevel: logLevel.DEBUG,
});

const producer = kafka.producer({
  maxInFlightRequests: 1,
  idempotent: true,
});

const actions = [
  "OPPORTUNITY",
  "RENEWAL_DUE",
  "INVESTIDATION_REPORT_ADDED",
  "CLAIM_INIT",
];

const sendMessage = () => {
  return producer
    .send({
      topic,
      //compression: CompressionTypes.GZIP,
      messages: [
        {
          key: `POL-${Math.floor(Math.random() * 10)}`,
          value: actions[Math.floor(Math.random() * 4)],
        },
      ],
    })
    .then(console.log)
    .catch((e) => console.error(`[producer] ${e.message}`, e));
};

const produce = async () => {
  await producer.connect();
  setInterval(sendMessage, 3000);
};

produce().catch((e) => console.error(`[producer] ${e.message}`, e));
