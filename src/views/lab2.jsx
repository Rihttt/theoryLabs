import { useState } from "react";
//import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import { Line } from 'react-chartjs-2';


export default function Lab2(){

    let [functions,setFunctions] = useState([]);
    let [functionType,setFunctionType] = useState('sin(kx+b)');
    let [coefK,setCoefK]= useState(1);
    let [coefB,setCoefB]= useState(1);
    let [harmony,setHarmony] = useState([]);
    
    class FunctionPlotter extends React.Component{
      constructor(props) {
        super(props);
        this.state = {
          chartData: this.getChartData(),
        };
      }
      
      
      
      getChartData = () => {

        

        const x = [];
        const y = [];

        for (let xVal = 0; xVal < 10; xVal += 0.01) {
            x.push(xVal);
            
        }    
        
        return {
          labels: x.map(val => val.toFixed(3)),
          datasets: [
                
            ...harmony,
            ...functions,
            
          ],
        };
      };
      
      render() {
        
        
        
        
        return (
          <div style={{width:'100%',height:'600px'}}>
            <Line
              data={this.state.chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                
                scales: {
                  x: {
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                      stepSize: 0.1, // Шаг между значениями
                      maxTicksLimit: 300, // Максимальное количество значений на шкале                     
                    },
                    display: false, 
                    max: 10,
                  },
                  y: {
                    id: 'y1',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                      stepSize: 10, // Шаг между значениями
                      maxTicksLimit: 100, // Максимальное количество значений на шкале
                      
                    },     
                    display: false,               
                  },
                                                
                },
                
              }}  
             
            />
          </div>
        );
      };
    };

    const x = [];
    for (let xVal = 0; xVal < 10; xVal += 0.01) {
        x.push(xVal);  
    }   

    const sumValuesAtX = (xValue) => {
        // Пройдем по каждому графику и получим значение y в заданной точке x
        const yValues = functions.map((func) => {
          const xIndex = x.findIndex((val) => parseFloat(val.toFixed(3)) === parseFloat(xValue.toFixed(3)));
          return xIndex !== -1 ? func.data[xIndex] : 0;
        });
      
        // Теперь сложим полученные значения
        const sum = yValues.reduce((acc, curr) => parseFloat(acc) + parseFloat(curr), 0);
        console.log('Суммы в y',sum)
        return sum;
        
    };

    

    const getRandomColor = () => {
        const letters = '0123456789ABCDEF';
        let color = '#';
        for (let i = 0; i < 6; i++) {
          color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
      };
     
    const handleAddNewFunction = (event) =>{
        const x = [];
        const y = [];
        const color = getRandomColor();
        let label = '';

        setFunctionType(event.target.value)
        setCoefK(event.target.value)
        setCoefB(event.target.value)

        if(functionType === 'sin(kx+b)'){
            label = `sin(${coefK}x+${coefB})`;
            for (let xVal = 0; xVal < 10; xVal += 0.01) {
                x.push(xVal);
                const yVal = Math.sin(coefK*xVal+coefB);
                
                y.push(parseFloat(yVal.toFixed(3)));
            }
        }

        if(functionType === 'cos(kx+b)'){
            label = `cos(${coefK}x+${coefB})`;
            for (let xVal = 0; xVal < 10; xVal += 0.01) {
                x.push(xVal);
                const yVal = Math.cos(coefK*xVal+coefB);
                
                y.push(parseFloat(yVal.toFixed(3)));
            }
        }

        if(functionType === 'sin(kx/b)'){
            label = `sin(${coefK}x/${coefB})`;
            for (let xVal = 0; xVal < 10; xVal += 0.01) {
                x.push(xVal);
                const yVal = Math.sin(coefK*xVal/coefB);
                
                y.push(parseFloat(yVal.toFixed(3)));
            }
        }

        if(functionType === 'cos(kx/b)'){
            label = `cos(${coefK}x/${coefB})`;
            for (let xVal = 0; xVal < 10; xVal += 0.01) {
                x.push(xVal);
                const yVal = Math.cos(coefK*xVal/coefB);
                
                y.push(parseFloat(yVal.toFixed(3)));
            }
        }
        functions.push({
            label: label,
            data: y.map(val=>val.toFixed(3)),
            fill: false,             
            borderColor: color,
            borderWidth: 1,
            pointRadius: 0,
            pointHitRadius: 2,
            yAxisID: 'y1',
            display: true,
            showLine:true,
        },)            
    };

    const handleAddHarmony = () => {
        const x = [];
        const y = [];

        for (let xVal = 0; xVal < 10; xVal += 0.01) {
            x.push(xVal);
            const yVal = parseFloat(sumValuesAtX(xVal));
            y.push(parseFloat(yVal.toFixed(3)))
        } 
    
        
        setHarmony([{
            label: 'Гармоника',
            data: y.map(val=>val.toFixed(3)),
            fill: false,             
            borderColor: 'red',
            borderWidth: 3,
            pointRadius: 0,
            pointHitRadius: 2,
            yAxisID: 'y1',
            display: true,
            showLine:true,
        
        }])
        console.log(harmony);
    }

    const handleRemoveLastFunction = () => {
        setFunctions((prevFunctions) => prevFunctions.slice(0, -1));
    };


    return(
        <>
            
            <div className="content">
                <h2>lab2</h2>
                    <div className="properties">

                        <div style={{marginTop:10}}>
                             <select value={functionType} onChange={(e) => setFunctionType(e.target.value)}>
                                <option value="sin(kx+b)">sin(kx+b)</option>
                                <option value="cos(kx+b)">cos(kx+b)</option>
                                <option value="sin(kx/b)">sin(kx/b)</option>
                                <option value="cos(kx/b)">cos(kx/b)</option>
                             </select>

                             <label>k</label>
                             <input type="text" className="laber" value={coefK} onChange={(e) => setCoefK(e.target.value)}></input>
                             <label>b</label>
                             <input type="text" className="laber" value={coefB} onChange={(e) => setCoefB(e.target.value)}></input>
                             
                        </div>

                        <div>
                            
                        </div>

                        <div style={{marginTop:10}}>
                             <button onClick={handleAddNewFunction}>Добавить функцию</button>
                        </div> 
                        <div style={{marginTop:10}}>
                             <button onClick={handleRemoveLastFunction}>Убрать последнюю функцию</button>
                        </div> 
                        <div style={{marginTop:10}}>
                             <button onClick={handleAddHarmony}>Получить гармонику</button>
                        </div>   
                               
                        </div>

                    <div className="outcomes" style={{backgroundColor: 'white'}}>
                        <div>
            
                            <FunctionPlotter />
                        </div>
                    </div>
                
            </div>
            
            
        </>
    )
    
}