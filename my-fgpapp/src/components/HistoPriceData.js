import React, { useState, useEffect, useCallback } from 'react';
import PricePlot from './PricePlot';
import 'chartjs-adapter-date-fns';

import '../css/PricePage.css';

function CoinList(prop) {
  const [coinList, setCoinList] = useState([]);
  const [chosenCoin, setChosenCoin] = useState('');

  useEffect(() => {
    fetch('/api/coins/list').then(resp => resp.json()).then(coins => {
      console.log(coins);
      setCoinList(coins);
    })
  }, []);

  const onChosen = useCallback(coin => {
    setChosenCoin(coin);
  }, []);

  useEffect(() => {
    prop.onCoinChosen(chosenCoin);
  }, [prop, chosenCoin]);

  return <ul className="coin-list">
    {coinList.map(coinName => {
      const className = coinName === chosenCoin ? 'current' : '';
      return <li key={coinName}>
        <button className={className} onClick={() => onChosen(coinName)}>{coinName}</button>
      </li>;
    })}
  </ul>;
}

function PricePage() {
  const [coinChosen, setCoinChosen] = useState('');
  const coinChosenHandler = useCallback(coin => {
    setCoinChosen(coin);
  }, []);
  return <div className="price-page">
    <div className="coin-list"><CoinList onCoinChosen={coinChosenHandler} /></div>
    <div className="price-plot"><PricePlot coin={coinChosen}></PricePlot></div>
  </div>;
}

export default PricePage;