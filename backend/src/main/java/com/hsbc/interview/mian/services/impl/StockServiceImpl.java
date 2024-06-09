package com.hsbc.interview.mian.services.impl;

import com.hsbc.interview.mian.configurations.ApplicationPropertiesConfiguration;
import com.hsbc.interview.mian.models.StockTickers;
import com.hsbc.interview.mian.services.StockService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class StockServiceImpl implements StockService {
    private static final Logger LOGGER = LoggerFactory.getLogger(StockServiceImpl.class);

    private final ApplicationPropertiesConfiguration configuration;
    private final RestTemplate restTemplate;

    @Autowired
    public StockServiceImpl(ApplicationPropertiesConfiguration configuration, RestTemplate restTemplate) {
        this.configuration = configuration;
        this.restTemplate = restTemplate;
    }

    @Override
    public Map<String, String> getStockTickersListRange(StockTickers stockTickers, Optional<String> startDate, Optional<String> endDate) {
        Map<String, String> tickerResults = new HashMap<>();
        for (String ticker : stockTickers.getTickerSymbols()) {
            String url = String.format(
                    "https://api.polygon.io/v2/aggs/ticker/%s/range/1/day/%s/%s?adjusted=true&sort=asc&apiKey=%s",
                    ticker, startDate.orElse(getDateNDaysAgo(30)), endDate.orElse(getDateNDaysAgo(1)), configuration.polygonIoKey()
            );
            String response = restTemplate.getForObject(url, String.class);
            LOGGER.info(response);
            tickerResults.put(ticker, response);
        }
        return tickerResults;
    }

    private static String getDateNDaysAgo(int n) {
        LocalDate currentDate = LocalDate.now();
        LocalDate pastDate = currentDate.minusDays(n);
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");
        LOGGER.info("DATE: {}", pastDate.format(formatter));
        return pastDate.format(formatter);
    }
}
