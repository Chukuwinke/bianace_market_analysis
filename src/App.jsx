import React, { useEffect, useState } from 'react';
import ApexCharts from 'react-apexcharts';
//import Binance from 'binance-api-node';
import Chart from 'react-apexcharts'
import './App.css'


function App() {

const [data, setData] = useState([]);
const [axisData, setAxisData] = useState(null);


//const binanceSocket = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@ticker');
//params: ['BTCUSDT', '1m', Date.now() - 1000 * 60 * 60 * 6, Date.now()],
//const interval = '1m';
//const startTime = Date.now() - 1000 * 60 * 60 * 6; // 6 hours ago
//const endTime = Date.now();

const symbol = 'BTCUSDT';
const limit = 1000

//const klinesUrl = `https://api.binance.com/api/v3/klines?symbol=${symbol}&interval=${interval}&startTime=${startTime}&endTime=${endTime}`;


const tradesUrl = `https://api.binance.com/api/v3/trades?symbol=${symbol}&limit=${limit}`
//const historicalTradesurl = `https://api.binance.com/api/v3/historicalTrades?symbol=${symbol}`

const candleTick = 500;


function findMinMax(arr) {
  let min = arr[0];
  let max = arr[0];
  for (let i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    } else if (arr[i] > max) {
      max = arr[i];
    }
  }
  return { min, max };
}

async function fetchOldData() {
  fetch(tradesUrl)
  .then(response => response.json())
  .then(klines => {
    //console.log(klines);
    const candles = []
    let lastVal;
    for (let i =0; i <= klines.length; i++){
      //console.log(i)
      if(i % candleTick === 0){
        //console.log(i)
        if(i > 0){
          const candleData = klines.slice(lastVal, i)
          candles.push(candleData)
        } 
        lastVal = i
      }

    }
    //console.log(candles)

    // FOR EACH CANDLE TRANSFORM THE DATA
    for(let candle of candles){
      const pricesList = []

      for(let item of candle){
        const {price} = item
        pricesList.push(+price)  
      }

      const result = findMinMax(pricesList);
      const highestPrice = result.max;
      const lowestPrice = result.min;
      const openPrice = pricesList[0]
      const closePrice = pricesList.at(-1)
      setData(prev => [... prev, {x: Math.floor(Math.random() * 1000), y:[openPrice, highestPrice, lowestPrice, closePrice]}])
    }
    
  })
  .catch(error => {
    console.error(error);
  });

}
let count = 0
useEffect(() => {

  // GET OLDER CANDLE DATA AND POPULATE CHART 
  fetchOldData()

  // GET DYNAMIC CANDLE DATA AND UPDATE CHART
  const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@trade")
    const candlePack = []
    binanceSocket.onmessage = (event) => {
      const data = JSON.parse(event.data)

      //setAxisData(() => data)

      if(count <= 500){
        candlePack.push(data)
        count = count+1;
      }
      else{
        const pricesList = []
        for (let item of candlePack){
          const {p:price} = item
          pricesList.push(+price)
         // console.log(item)
        }
        const result = findMinMax(pricesList);
        const highestPrice = result.max;
        const lowestPrice = result.min;
        const openPrice = pricesList[0]
        const closePrice = pricesList.at(-1)

        setData(prev => [... prev, {x: Math.floor(Math.random() * 1000), y:[openPrice, highestPrice, lowestPrice, closePrice]}])
        count = 0;
        
      }

      //console.log(candlePack);
      //console.log(count)
    
    }
    
}, []);

if(data == []) return <h1>Loading...</h1>
let seriesData = [
  {
  data: [ ...data /**{
    x: Date.now(),
    y: [openPrice, highestPrice, lowestPrice, closePrice],
  },*/
  ]
  }
  
]



  
  return (
    <>
      <Chart type='candlestick' width={600} height={600} series={seriesData} options={{}}/>
    </>
  );
  
  
  
}

export default App






































/**
 * const [tradeCount, setTradeCount] = useState([]);
const [lastValue, setLastValue] = useState(0);
 * 
 * // const pricesList = []

    // for(let item of klines){
    // const {price} = item
    // pricesList.push(+price)  
    // }

    // const result = findMinMax(pricesList);
    // const highestPrice = result.max;
    // const lowestPrice = result.min;
    // const openPrice = pricesList[0]
    // const closePrice = pricesList.at(-1)
    // setAxisData({highestPrice, lowestPrice, openPrice, closePrice})
 * 
 * // fetch(url1)
//   .then(response => response.json())
//   .then(klines => {
//     console.log(klines);
//     const dataStream = []

//     // for(let item of klines){
//     //   const openTime = item[0]
//     //   const openPrice = item[1]
//     //   const higPrice = item[2]
//     //   const lowPrice = item[3]
//     //   const closePrice = item[4]
//     //   const volume = item[5]
//     //   const closeTime = item[6]
//     //   const quoteAssets = item[7]
//     //   const numberOfTrades = item[8]
//     //   const takerBuyBaseAssetVolume = item[9]
//     //   const takerBuyQuoteAssetVolume = item[10]
      

//     //   if (numberOfTrades >= 1000 && numberOfTrades < 1100){
//     //     console.log(item)
//     //   }
       
      
//     // }
//   })
//   .catch(error => {
//     console.error(error);
//   });
 */

/**
 * import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import './App.css'
import CandleChart from './experiments/CandleChart'

function App() {
  const [count, setCount] = useState(0)
  const [rawData, setRawData] = useState([])
  const [axisData, setAxisData] = useState(null)
  const [timeStamp, setTimeStamp] = useState([])
 // const [tradeValue, setTradeValue] = useState([])
  //let rawData
  

  useEffect(() =>{
    const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m")
    binanceSocket.onmessage = (event) => {
      const data = JSON.parse(event.data) 
      const {E:date, k:{n :numberOfTrades, o:openPrice, c:closePrice, h:highPrice, l:lowPrice, T:closeTime}} = data 
      //console.log(new Date(closeTime))
      //console.log("===================================")
      setTimeStamp(data.E)
      setAxisData( () => data)
      //console.log(`current ${new Date()} startTime: ${new Date(date)}`)

      
      //
      if(new Date(closeTime) < new Date(date)){
        setRawData( prev => [...prev, {
          x: new Date(date),
          y: [openPrice, highPrice, lowPrice, closePrice],
       }])
      }
////////////////////////////////////////////////////////////////////////////////////////
      //check if number of trades is greater than 500 if so set candle data
      // if(numberOfTrades == 500 || new Date(closeTime) < new Date(date)){
      //   console.log(numberOfTrades)
      //   setTradeValue( prev => [...prev, {
      //     x: String(numberOfTrades),
      //     y: [openPrice, highPrice, lowPrice, closePrice],
      //  }])
      // }
/////////////////////////////////////////////////////////////////////////////////////      
    }
    return () =>{
      binanceSocket.close()
    }
    
  },[])
  
  //console.log(rawData)
  if(axisData == null) return <h1>Loading...</h1>
  const {E:date, k:{n :numberOfTrades, o:openPrice, c:closePrice, h:highPrice, l:lowPrice, T:closeTime}} = axisData
  
  //let current = new Date(timeStamp)
  let closeCurrent = new Date(closeTime)
  //console.log(current)
  //console.log(closeCurrent)
  // setAxisData((axisData) => {

  // })
  //console.log(`number of trades:${numberOfTrades} `)

  //console.log(rawData)
  //console.log(closeTime)


  let seriesData = [
    {
    data: [...rawData, {
      x: new Date(date),
      y: [openPrice, highPrice, lowPrice, closePrice],
    },
    ]
    }
    
  ]

/////////////////////////////////////////////////////////////////////////////////////////////

  // let seriesDataTrade = [
  //   {
  //   data: [...tradeValue, {
  //     x: numberOfTrades,
  //     y: [openPrice, highPrice, lowPrice, closePrice],
  //   },
  //   ]
  //   }
    
  // ]

////////////////////////////////////////////////////////////////////////////////////////////////

  var options = {
    series: [{
      data: seriesData
    }],
    chart: {
      type: 'candlestick',
    },
    xaxis: {
      type: 'datetime',
    },
  };
  

  
  return (
    <div className="App">
      {/* <CandleChart data={seriesData} /> }
      <Chart type='candlestick' height={600} series={seriesData} options={{}}/>
      {/* <Chart type='candlestick' width={600} height={600} series={seriesDataTrade} options={{}}/> }
    </div>
  )
}

export default App
 * 
 */


/////////////////////////////////////////// variant /////////////////////////////////


/**
 * import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import './App.css'
import CandleChart from './experiments/CandleChart'

function App() {
  const [count, setCount] = useState(0)
  const [rawData, setRawData] = useState([])
  const [axisData, setAxisData] = useState(null)
  const [timeStamp, setTimeStamp] = useState([])
  //let rawData
  

  useEffect(() =>{
    const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_1m")
    binanceSocket.onmessage = (event) => {
      const data = JSON.parse(event.data) 
      const {E:date, k:{n :numberOfTrades, o:openPrice, c:closePrice, h:highPrice, l:lowPrice, T:closeTime}} = data 
      //console.log(new Date(closeTime))
      //console.log("===================================")
      setTimeStamp(data.E)
      setAxisData( () => data)
      //console.log(`current ${new Date()} startTime: ${new Date(date)}`)
      //check if number of trades is greater than 500 if so set candle data
      //
      if(new Date(closeTime) < new Date(date)){
        setRawData( prev => [...prev, {
          x: new Date(date),
          y: [openPrice, highPrice, lowPrice, closePrice],
       }])
      }
      
    }
    return () =>{
      binanceSocket.close()
    }
    
  },[])
  
  //console.log(rawData)
  if(axisData == null) return <h1>Loading...</h1>
  const {E:date, k:{n :numberOfTrades, o:openPrice, c:closePrice, h:highPrice, l:lowPrice, T:closeTime}} = axisData
  
  //let current = new Date(timeStamp)
  let closeCurrent = new Date(closeTime)
  //console.log(current)
  //console.log(closeCurrent)
  // setAxisData((axisData) => {

  // })
  //console.log(`number of trades:${numberOfTrades} `)

  //console.log(rawData)
  //console.log(closeTime)


  let seriesData = [
    {
    data: [...rawData, {
      x: new Date(date),
      y: [openPrice, highPrice, lowPrice, closePrice],
    },
    ]
    }
    
  ]
  

  var options = {
    series: [{
      data: seriesData
    }],
    chart: {
      type: 'candlestick',
    },
    xaxis: {
      type: 'datetime',
    },
  };
  

  
  return (
    <div className="App">
      {/* <CandleChart data={seriesData} /> }
      <Chart type='candlestick' width={600} height={600} series={seriesData} options={{}}/>
    </div>
  )
}

export default App

 */

/////////////////////////////////////////// variant /////////////////////////////////

/**
 * const [data, setData] = useState([]);
const [tradeCount, setTradeCount] = useState(0);

  
const symbol = 'BTCUSDT';
const interval = '1m';

const socketUrl = `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@aggTrade`;
const socket = new WebSocket(socketUrl);



  
useEffect(() => {
  socket.onmessage = (event) => {
    const message = JSON.parse(event.data);
    const tradePrice = parseFloat(message.p);
    const tradeQty = parseFloat(message.q);

    setTradeCount((prevCount) => prevCount + 1);

    if (tradeCount >= 500) {
      const lastData = data[data.length - 1];
      const lastPrice = lastData ? lastData.close : tradePrice;

      const newCandle = {
        x: message.T,
        y: [lastPrice, tradePrice, tradePrice, tradePrice, tradeQty],
      };

      setData((prevData) => [...prevData.slice(0, -1), newCandle]);
      setTradeCount(0);
    } else if (data.length > 0) {
      const lastData = data[data.length - 1];
      const lastTradeQty = lastData.y[4];
      const newTradeQty = lastTradeQty + tradeQty;

      const newData = {
        ...lastData,
        y: [
          lastData.y[0],
          Math.min(lastData.y[1], tradePrice),
          Math.max(lastData.y[2], tradePrice),
          tradePrice,
          newTradeQty,
        ],
      };

      setData((prevData) => [
        ...prevData.slice(0, -1),
        newData,
      ]);
    }
  };

  // return () => {
  //   socket.close();
  // };
}, [data, tradeCount]);

  


  
  return (
    <ApexCharts
    options={{
      chart: {
        type: 'candlestick',
        height: 350,
      },
      title: {
        text: symbol,
        align: 'left',
      },
      xaxis: {
        type: 'datetime',
        labels: {
          datetimeUTC: false,
        },
      },
      yaxis: {
        tooltip: {
          enabled: true,
        },
      },
      tooltip: {
        x: {
          format: 'dd MMM yyyy HH:mm'
          
        },
      }}}
      series={[
        {
          name: symbol,
          data: data,
        },
      ]}
    />
  );
  
  
  
}

export default App
 */