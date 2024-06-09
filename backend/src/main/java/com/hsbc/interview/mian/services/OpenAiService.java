package com.hsbc.interview.mian.services;
import org.springframework.ai.chat.ChatResponse;
import reactor.core.publisher.Flux;

import java.util.Map;

public interface OpenAiService {

    /**
     * Prompt GPT for stock predictions based on given stock data.
     *
     * @param stockData {@link String} json string stock data
     * @return {@link String} GPT response
     */
    String PromptGptForStockPrediction(Map<String, String> stockData);
    Flux<ChatResponse> StreamGptForStockPrediction(Map<String, String> stockData);
}
