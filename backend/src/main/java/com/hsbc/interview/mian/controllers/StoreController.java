package com.hsbc.interview.mian.controllers;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.ai.chat.ChatResponse;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;
import org.json.JSONObject;
import com.fasterxml.jackson.databind.ObjectMapper;
import reactor.core.publisher.Flux;

import com.hsbc.interview.mian.models.StockTickers;
import com.hsbc.interview.mian.services.impl.OpenAiServiceImpl;
import com.hsbc.interview.mian.services.impl.StockServiceImpl;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping(value = "/api")
public class StoreController {
    private final StockServiceImpl stockService;
    private final OpenAiServiceImpl openAiService;

    public StoreController(StockServiceImpl stockService, OpenAiServiceImpl openAiService) {
        this.stockService = stockService;
        this.openAiService = openAiService;
    }

    @GetMapping("/predict")
    public ResponseEntity<?> predictStockOptions(@RequestParam List<String> tickers,  
                        @RequestParam Optional<String> startDate,
                        @RequestParam Optional<String> endDate) {
        
        StockTickers stockTickers = StockTickers.builder()
                .tickerSymbols(tickers)
                .build();

         Map<String, String> tickerInfo = stockService.getStockTickersListRange(stockTickers, startDate, endDate);
         String promptResponse = openAiService.PromptGptForStockPrediction(tickerInfo);

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(promptResponse);
    }

    @GetMapping("/info")
    public ResponseEntity<?> getStockData(@RequestParam List<String> tickers, 
                        @RequestParam Optional<String> startDate,
                        @RequestParam Optional<String> endDate) {
        
        StockTickers stockTickers = StockTickers.builder()
                .tickerSymbols(tickers)
                .build();

        Map<String, String> tickerInfo = stockService.getStockTickersListRange(stockTickers, startDate, endDate);
       
        JSONObject jsonObject = new JSONObject();
        for (String ticker : stockTickers.getTickerSymbols()) {
            jsonObject.put(ticker, getJSONFromObject(tickerInfo.get(ticker)));
        }

        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_JSON)
                .body(jsonObject.toString());
    }

    @GetMapping(path = "/stream", produces = MediaType.TEXT_EVENT_STREAM_VALUE)
    public SseEmitter stream(@RequestParam List<String> tickers,  
                        @RequestParam Optional<String> startDate,
                        @RequestParam Optional<String> endDate) {

        StockTickers stockTickers = StockTickers.builder()
            .tickerSymbols(tickers)
            .build();

        Map<String, String> tickerInfo = stockService.getStockTickersListRange(stockTickers, startDate, endDate);
        Flux<ChatResponse> flux= openAiService.StreamGptForStockPrediction(tickerInfo);
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE);

        flux.subscribe(
            data -> {
                try {
                    emitter.send(data);
                } catch (IOException e) {
                    emitter.completeWithError(e);
                }
            },
            error -> {
                emitter.completeWithError(error);
            },
            () -> {
                emitter.complete();
            }
        );
        return emitter;
    }


    public static JSONObject getJSONFromObject(Object object) {
        ObjectMapper objectMapper = new ObjectMapper();
        return objectMapper.convertValue(object, JSONObject.class);
    }
}
