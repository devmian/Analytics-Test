/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { makeRequest } from '../utils/request';
import dayjs from 'dayjs';

export type StockData = {
  chartData?: any;
  predict?: string;
  loading?: boolean;
  error?: string;
};

export enum ActionType {
  SET_LOADING,
  SET_STOCK,
  SET_ERROR
}

type Action =
  | { type: ActionType.SET_STOCK; payload: { chartData?: any; predict?: string } }
  | { type: ActionType.SET_ERROR; payload: { error?: string; loading?: boolean } };

const StockContext = React.createContext<
  | {
      stockData: StockData;
      getStockData: (ticker: string, startDate?: string, endDate?: string) => Promise<any>;
    }
  | undefined
>(undefined);

export function StockReducer(state: StockData, action: Action): StockData {
  switch (action.type) {
    case ActionType.SET_ERROR:
      return {
        ...state,
        error: action.payload.error,
        loading: !!action.payload.loading
      };
    case ActionType.SET_STOCK: {
      return {
        ...state,
        chartData: action.payload.chartData,
        predict: action.payload.predict,
        loading: false
      };
    }
    default: {
      const actionType = (action as Action).type;
      throw console.error(`Unhandled action type: ${actionType}`, 500);
    }
  }
}

type Props = { initialState?: Partial<StockData>; children: React.ReactNode };

export const StockProvider: React.FC<Props> = ({ children, initialState }) => {
  const initialProps: StockData = React.useMemo(
    () => ({
      ...initialState
    }),
    [initialState]
  );

  const [stockData, dispatch] = React.useReducer(StockReducer, initialProps);

  const getStockData = async (ticker: string, startDate?: string, endDate?: string) => {
    if (!stockData.loading) {
      try {
        dispatch({
          type: ActionType.SET_ERROR,
          payload: { error: undefined, loading: true }
        });

        // chart data
        const chartDataRes = await makeRequest.get('/api/info', {
          params: {
            tickers: ticker,
            startDate,
            endDate
          }
        });

        const timeSeries = chartDataRes.data[ticker].results;
        const chartData = timeSeries.map((item: any) => ({
          date: dayjs(item.t).format('YYYY-MM-DD HH:mm:ss'),
          open: item.o,
          high: item.h,
          low: item.l,
          close: item.c
        }));

        // open ai stream data
        const paramsQuery = new URLSearchParams({ tickers: ticker });
        if (startDate) {
          paramsQuery.append('startDate', startDate);
        }

        if (endDate) {
          paramsQuery.append('endDate', endDate);
        }

        const response = await fetch('http://localhost:8080/api/stream?' + paramsQuery);

        if (response.body) {
          const accessData = response.body.pipeThrough(new TextDecoderStream()).getReader();
          let aiResponse = '';
          while (true) {
            const { done, value } = await accessData.read();
            if (done) {
              break;
            }

            const lines = value.split('\n');
            for (const i in lines) {
              if (lines[i] === 'data:') continue; // ignore comment message
              if (lines[i] === 'data: [DONE]') break; // end of message

              if (lines[i].startsWith('data:')) {
                const json = JSON.parse(lines[i].substring(5));

                if (json.results) {
                  aiResponse += json.results[0].output.content || '';
                }
              }
            }

            dispatch({
              type: ActionType.SET_STOCK,
              payload: {
                chartData,
                predict: aiResponse
              }
            });
          }
        }
      } catch (e: any) {
        dispatch({
          type: ActionType.SET_ERROR,
          payload: { error: e?.message ?? e }
        });
      }
    }
  };

  return (
    <StockContext.Provider value={{ stockData, getStockData }}>{children}</StockContext.Provider>
  );
};

export function useStockState() {
  const context = React.useContext(StockContext);
  if (context === undefined) {
    throw console.error('useStockState must be used within a StockProvider', 500);
  }
  return context;
}
