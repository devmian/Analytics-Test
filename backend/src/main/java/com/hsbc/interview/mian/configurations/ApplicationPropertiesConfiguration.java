package com.hsbc.interview.mian.configurations;

import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.client.RestTemplate;

@Configuration
@PropertySource("classpath:application.properties")
public class ApplicationPropertiesConfiguration {

    @Value("${polygon.io.api.key}")
    private String polygonIoKey;

    @Value("${spring.ai.openai.api-key}")
    private String openAiKey;

    @Bean
    public String polygonIoKey() {
        return this.polygonIoKey;
    }

    @Bean
    public OpenAiApi openAiKey() {
        return new OpenAiApi(openAiKey);
    }

    @Bean
    public RestTemplate restTemplate() {
        return new RestTemplate();
    }
}
