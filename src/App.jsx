import { useEffect, useState } from 'react'
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
      {/* <CandleChart data={seriesData} /> */}
      <Chart type='candlestick' width={600} height={600} series={seriesData} options={{}}/>
    </div>
  )
}

export default App
