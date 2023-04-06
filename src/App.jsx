import { useEffect, useState } from 'react'
import Chart from 'react-apexcharts'
import './App.css'
import CandleChart from './experiments/CandleChart'

function App() {
  const [count, setCount] = useState([0])
  const [rawData, setRawData] = useState([])
  const [axisData, setAxisData] = useState(null)
  const [timeStamp, setTimeStamp] = useState([])
  //let rawData
  

  useEffect(() =>{
    const binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@kline_5m")
    binanceSocket.onmessage = (event) => {
      const data = JSON.parse(event.data) 
      const {E:date, k:{n :numberOfTrades, o:openPrice, c:closePrice, h:highPrice, l:lowPrice, T:closeTime}} = data 
      
      //console.log("===================================")

      console.log(count)

      
      
      
      if ((numberOfTrades >= 500) && (count.length == 1)){
        setCount(prev => [...prev, numberOfTrades])
      }
      else{
        const sumValue = count.reduce((a, b) => a + b)
        let result = numberOfTrades - sumValue
        console.log(result)
        if(result < 0 && count.length > 1){
          result = numberOfTrades
          if(result >= 500 && result < 600){
            setCount(() => [result])
            setRawData( prev => [...prev, {
              x: eventDate,
              y: [openPrice, highPrice, lowPrice, closePrice],
            }])
          }
          else if (result > 600){
            setCount([0, numberOfTrades])
          }
          
        }
        else if(result >= 500 && result < 600){
          setCount(prev => [...prev, result])
          setRawData( prev => [...prev, {
            x: eventDate,
            y: [openPrice, highPrice, lowPrice, closePrice],
         }])
        }
        else if( result > 600) {
          setCount([0, numberOfTrades])
        }
      }
      

      
      //setCount(prev => [...prev + ])
      setAxisData( () => data)
      //console.log(`current ${new Date()} startTime: ${new Date(date)}`)
      //check if number of trades is greater than 500 if so set candle data
      //
      
      //console.log(count)

      //console.log(count)
      const eventDate = new Date(date)
      const closeDateConv = new Date(closeTime)
      if(closeDateConv < eventDate){
        //  setRawData( prev => [...prev, {
        //    x: eventDate,
        //    y: [openPrice, highPrice, lowPrice, closePrice],
        // }])
      }
      
    }
    return () =>{
      binanceSocket.close()
    }
    
  },[count])
  
  //console.log(rawData)
  if(axisData == null) return <h1>Loading...</h1>
  const {E:date, k:{n :numberOfTrades, o:openPrice, c:closePrice, h:highPrice, l:lowPrice, T:closeTime}} = axisData
  
  //console.log(count)
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

  const options = {
    chart: {
      type: 'candlestick',
      height: 600,
    },
    title: {
      text: 'CandleStick Chart',
      align: 'left'
    },
    yaxis: {
      tooltip: {
        enabled: true
      }
    }
  }
  

  
  return (
    <div className="App">
      {/* <CandleChart data={seriesData} /> */}
      <Chart type='candlestick' height={600} series={seriesData} options={options}/>
    </div>
  )
}

export default App


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