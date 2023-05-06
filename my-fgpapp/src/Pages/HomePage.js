import React from 'react';
import PricePage from '../components/HistoPriceData';
import AssetAllocation from '../components/AssetAllocation';

function Home() {
  return (
    <React.Fragment>
      <PricePage />
      <AssetAllocation />
    </React.Fragment>
  );
}

export default Home;
