import Header from './components/header';
import Filter, { FilterData } from './components/filter';
import StockByDate from './components/stock-summary';
import { useStockState } from './providers/StockProvider';
import styles from './App.module.scss';
import { formatDateToServer } from 'utils/formatters';

function App() {
  const { stockData, getStockData } = useStockState();

  const onFilterChange = (filter: FilterData) => {
    const startDate = formatDateToServer(filter?.dates?.[0]);
    const endDate = formatDateToServer(filter?.dates?.[1]);
    if (filter.ticker) {
      getStockData(filter.ticker, startDate, endDate);
    }
  };

  return (
    <>
      <Header />
      <div className={styles.appContainer} id="app-container">
        <Filter onFilterChange={onFilterChange} />
        <StockByDate stockData={stockData} />
      </div>
    </>
  );
}

export default App;
