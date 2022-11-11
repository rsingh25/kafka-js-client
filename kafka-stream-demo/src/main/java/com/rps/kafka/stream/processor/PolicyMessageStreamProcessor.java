package com.rps.kafka.stream.processor;


import com.rps.kafka.stream.config.KafkaProps;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.apache.kafka.common.serialization.Serde;
import org.apache.kafka.common.serialization.Serdes;
import org.apache.kafka.streams.StreamsBuilder;
import org.apache.kafka.streams.kstream.Consumed;
import org.apache.kafka.streams.kstream.KStream;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.Arrays;
import java.util.List;

@Component
@Slf4j
@RequiredArgsConstructor
public class PolicyMessageStreamProcessor {
    @Autowired
    private final KafkaProps properties;

    private final List<String> CLAIMS_AXN = Arrays.asList();
    private final List<String> SALES_AXN = Arrays.asList();
    private final Serde<String> STRING_SERDE = Serdes.String();

    @Autowired
    public void buildPipeline(StreamsBuilder streamsBuilder) {

        KStream<String, String> policyStream = streamsBuilder
                .stream(properties.getPolicyInboundTopic(), Consumed.with(STRING_SERDE, STRING_SERDE));

        policyStream
                .filter((key, value) -> CLAIMS_AXN.contains(value))
                .to(properties.getClaimsOutboundTopic());

        policyStream
                .filter((key, value) -> SALES_AXN.contains(value))
                .to(properties.getSalesBarOutboundTopic());
    }
}