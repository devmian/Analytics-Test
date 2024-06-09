import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import dayjs from 'dayjs';
import { StockData } from '../../providers/StockProvider';

import styles from './styles.module.scss';

type Props = {
  stockData: StockData;
};

function StockByDate({ stockData }: Props) {
  const { loading, chartData = [], predict } = stockData;

  return (
    <div className={`${styles.container} base-card`}>
      <div>
        <h2 className={styles.title}>Stock evolution</h2>
      </div>
      <div className={styles.dataContainer}>
        {loading ? (
          'Loading...'
        ) : chartData.length === 0 ? (
          <>Please Select a stock</>
        ) : (
          <>
            <div className={styles.chart}>
              <ResponsiveContainer>
                <LineChart data={chartData}>
                  <CartesianGrid vertical={false} strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(date) => dayjs(date).format('D MMM YYYY')}
                  />
                  <YAxis domain={['dataMin', 'dataMax']} scale={'linear'} />
                  <Tooltip
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    formatter={(value: any) => {
                      if (typeof value === 'number') {
                        return value.toFixed(2);
                      }
                      return value;
                    }}
                    labelFormatter={(date) => dayjs(date).format('D MMM YYYY')}
                    contentStyle={{
                      backgroundColor: '#fff'
                    }}
                    labelStyle={{ color: '#000' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="close"
                    name="Closing Price"
                    stroke="#82ca9d"
                    strokeWidth={3}
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
            <article>{predict}</article>
          </>
        )}
      </div>
    </div>
  );
}

export default StockByDate;
