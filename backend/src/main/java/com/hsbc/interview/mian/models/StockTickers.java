package com.hsbc.interview.mian.models;

import lombok.*;

import java.util.List;

@Getter
@Setter
@ToString
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class StockTickers {
    private List<String> tickerSymbols;
}
