package com.hsbc.interview.mian.services;

import com.hsbc.interview.mian.models.StockTickers;

import java.util.Map;
import java.util.Optional;

public interface StockService {

    /**
     * Get stock data with ticker as key and response json data as value.
     *
     * @param stockTickers {@link StockTickers}
     * @param startDate {@link String}
     * @param endDate {@link String}
     * @return {@link Map}
     */
    Map<String, String> getStockTickersListRange(StockTickers stockTickers, Optional<String> startDate, Optional<String> endDate);
    
}
