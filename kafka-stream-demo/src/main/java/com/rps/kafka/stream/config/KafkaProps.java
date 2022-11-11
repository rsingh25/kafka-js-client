package com.rps.kafka.stream.config;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;
import org.springframework.validation.annotation.Validated;

@Configuration
@ConfigurationProperties("kafka-streams-demo")
@Getter
@Setter
@Validated
public class KafkaProps {

    private String policyInboundTopic;
    private String claimsOutboundTopic;
    private String salesBarOutboundTopic;
}
