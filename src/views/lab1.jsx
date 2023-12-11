import { useState, useRef, useEffect} from "react";
import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import function1 from "E:/Programming/theoryLabs/src/assets/function1.png"
import afterDraw from 'chart.js/auto';
import { Line } from 'react-chartjs-2';





export default function Lab1(){

    let [quantLevelValue,setQuantLevelValue] = useState(7);
    let [quantStepValue,setQuantStepValue] = useState(0.5);
    let [isButtonDisabled, setButtonDisabled] = useState(false);
    let [isButton1Disabled, setButton1Disabled] = useState(false);
    
    
    class FunctionPlotter extends React.Component {
      constructor(props) {
        super(props);
        this.state = {
          chartData: this.getChartData(),
          
        };
      }
      
      findIntersections() {
        const chartData = this.state.chartData;
        const functionData = chartData.datasets[0].data;
        const quantLevelsData = chartData.datasets.slice(1);
      
        const intersections = [];
        
      
        functionData.forEach((y, index) => {
          quantLevelsData.forEach((levelData, levelIndex) => {
            if (Math.abs(y - levelData.data[index]) < 0.1) {
              intersections.push({ x: chartData.labels[index], y, levelIndex });  
              
            }
          });
        });
        
        console.log('Intersections:', intersections);
      };

      drawSegments(ctx, intersections) {
        // Перебираем пары точек и рисуем отрезки
        intersections.forEach((point, index) => {
          if (index < intersections.length - 1) {
            const nextPoint = intersections[index + 1];
    
            // Рисуем отрезок между точками
            ctx.beginPath();
            ctx.moveTo(point.x, point.y);
            ctx.lineTo(nextPoint.x, nextPoint.y);
            ctx.fillStyle = 'rgba(255, 0, 0, 0.2)'; // Цвет заливки
            ctx.fill();
            ctx.closePath();
          }
        });
      }
    
      getChartData() 
      {
        
        // Здесь вы можете вычислить значения функции для различных x
        const data = [];
        for (let x = 0; x <= 300; x += 0.1) {
          const y = 3 * Math.sin(Math.PI * (x - 2.85) / 2.0) / (0.8 * (x - 2.85)) + 1.3;
          data.push({ x: parseFloat(x.toFixed(2)), y: parseFloat(y.toFixed(2)) });

        };

        

        // Используем quantStepValue для определения расстояния между уровнями
        const quantLevelsData = [];
        for (let i = 1; i < quantLevelValue+1; i++) {
          quantLevelsData.push(Array(100).fill(0 + i * parseFloat(quantStepValue)));
        };
    
        return {
          labels: data.map(point => point.x.toFixed(15)),
          datasets: [
            
            {
              label: 'y = 3sin((π(x-2.85))/2)/(0.8(x-2.85)))+1.3',
              data: data.map(point => point.y.toFixed(15)),
              fill: false,
              borderColor: 'rgb(0,0,255)',
              borderWidth: 2,
              pointRadius: 0,
              pointHitRadius: 2,
              yAxisID: 'y1'
            },           

            ...quantLevelsData.map((levelData, index) => ({
              label: ``,
              data: levelData,
              fill: false,
              borderColor: 'rgb(255,0,0)',
              borderWidth: 2,
              pointRadius: 0,
              pointHitRadius: 2,
              yAxisID: 'y2',
            })),

          ],
        };
      };
      
      render() {
        this.findIntersections();
        
        return (
          <div style={{width:'70%',height:'600px'}}>
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
                  y2: {
                    id: 'y2',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                      stepSize: 1, // Шаг между значениями
                      maxTicksLimit: 100, // Максимальное количество значений на шкале
                      
                    },
                    display: false,
                    beginAtZero: true,
                    max:8,
                  },
                  
                },
                
              }}
              plugins={[
                {
                  afterDraw: () => {
                    this.findIntersections();
                  },
                },
              ]}
            />
          </div>
        );
      }
    };
     

    const imagePath = 'E:/Programming/theoryLabs/src/assets/function.png';
    console.log(imagePath);
    //обработчики кнопок уровня квантования
    const handleIncreaseClick = () => {
        let pom = parseInt(quantLevelValue) + 1;
        console.log(pom)
        setQuantLevelValue(pom);
        if (quantLevelValue > 7) {
            setButtonDisabled(false);
        } 
    };   
    const handleDecreaseClick = () => {      
        if (parseInt(quantLevelValue) === 7) {
            setButtonDisabled(true);
        } else {
            let pum = parseInt(quantLevelValue)-1;
            setQuantLevelValue(pum);
            setButtonDisabled(false);
        }
    };

    //Обработчики кнопок шага квантования
    const handleIncrease1Click = () => {
        let pom = parseFloat(quantStepValue) + 0.1;
        console.log(pom)
        setQuantStepValue(pom.toFixed(1));
        if (quantStepValue > 0.4) {
            setButton1Disabled(false);
        } 
    };
    const handleDecrease1Click = () => {
       
        if (parseFloat(quantStepValue) === 0.4) {
            setButton1Disabled(true);
        } else {
            let pum = parseFloat(quantStepValue)-0.1;
            setQuantStepValue(pum.toFixed(1));
            setButton1Disabled(false);
        }
    };

    return(
        <>
            
            <div className="content">
                <h2>lab1</h2>
                    <div className="properties">

                        <p>Тип квантования</p>
                        <select>                           
                            <option id="1">Ближайшее значение снизу</option>
                            <option id="2">Ближайшее значение сверху</option>
                            <option id="3">Ближайшее значение </option>
                        </select>

                        <div>
                            <p>Кол-во уровней квантования</p>
                            <input className="inp" value={quantLevelValue} onChange={()=>{}} ></input>

                            <button className="increase" onClick={handleIncreaseClick}>+</button>
                            <button className="decrease" disabled={isButtonDisabled} onClick={handleDecreaseClick} >-</button>
                                
                        </div>

                        <div>
                            <p>Шаг квантования</p>
                            <input className="inp1" value={quantStepValue} onChange={()=>{}}></input>

                            <button className="increase1" onClick={handleIncrease1Click}>+</button>
                            <button className="decrease1" disabled={isButton1Disabled} onClick={handleDecrease1Click}>-</button>
                        </div>

                        <div>
                            <p>Функция</p>
                            <img src={function1} alt="логотип" height={100} width={200} />
                        </div> 

                        <button>Начать квантование</button>       
                    </div>

                    <div className="outcomes">
                        <div>
            
                            <FunctionPlotter />
                        </div>
                    </div>
                
            </div>
            
            
        </>
    )
}