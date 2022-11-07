#!/usr/bin/env node

const { brokers = 'localhost:9092,localhost:9093,localhost:9094', topics, consumerGroup } = require('yargs')
    .scriptName('consumer')
    .usage('Usage: $0 --brokers string --topic string --consumerGroup string')
    .demand(["topics"])
    .argv;

const { Kafka, logLevel } = require('kafkajs')
const fs = require('fs')

// create a Kafka client
const kafka = new Kafka({
    brokers: brokers.split(','),
    logLevel: logLevel.INFO
})

// get a consume instance
const consumerConfig = consumerGroup ? { groupId: consumerGroup } : {};
const consumer = kafka.consumer(consumerConfig)

const consume = async () => {
    await consumer.connect()

    await consumer.subscribe({ topics: topics.split(',') })

    // start the consume and print each message to the screen
    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            const { key, offset, timestamp, value } = message;
            const m = `${key}  [p=${partition} offet=${offset} ts=${timestamp}] --> \t${value}`;

            console.log(m)
            fs.appendFile(`${consumerGroup}-${partition}.txt`, `${m}\n`, err => {
                if (err) {
                    console.log(`failed to update file [${consumerGroup}-${partition}.txt]`)
                    throw err
                }

            })
        },
    })
}

consume().catch(e => console.error(`[${consumerGroup}-consumer] ${e.message}`, e))