import FlatPicker from 'react-flatpickr';
import 'flatpickr/dist/themes/material_green.css';
import React, { useState } from 'react';

import styles from './styles.module.scss';

export enum Ticker {
  AAPL = 'AAPL',
  TSLA = 'TSLA',
  NVDA = 'NVDA'
}

export type FilterData = {
  dates?: Date[];
  ticker?: Ticker;
};

type Props = {
  onFilterChange: (filter: FilterData) => void;
};

function Filter({ onFilterChange }: Props) {
  const [dates, setDates] = useState<Date[]>([]);
  const [ticker, setTicker] = useState<Ticker>();

  const onChangeDate = (dates: Date[]) => {
    if (dates.length === 2) {
      setDates(dates);
      onFilterChange({ dates, ticker });
    }
  };

  const onChangeGender = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedGender = event.target.value as Ticker;

    setTicker(selectedGender);
    onFilterChange({ dates, ticker: selectedGender });
  };

  return (
    <div className={`${styles.filterContainer} base-card`}>
      <FlatPicker
        options={{ mode: 'range', dateFormat: 'd/m/Y', showMonths: 2 }}
        className={styles.filterInput}
        onChange={onChangeDate}
        placeholder="Select date"
      />
      <select className={styles.filterInput} value={ticker} onChange={onChangeGender}>
        <option value="">Ticker select</option>
        <option value="AAPL">AAPL</option>
        <option value="TSLA">TSLA</option>
        <option value="NVDA">NVDA</option>
      </select>
    </div>
  );
}

export default Filter;
