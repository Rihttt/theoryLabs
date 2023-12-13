import { useState } from "react";
//import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import function1 from "E:/Programming/theoryLabs/src/assets/function1.png"

import { Line } from 'react-chartjs-2';
import {
  CategoryScale,
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
} from 'chart.js';

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Filler
)




export default function Lab1(){

    let [quantLevelValue,setQuantLevelValue] = useState(7);
    let [quantStepValue,setQuantStepValue] = useState(0.5);
    let [isButtonDisabled, setButtonDisabled] = useState(false);
    let [isButton1Disabled, setButton1Disabled] = useState(false);
    let [selectedQuantizationType, setSelectedQuantizationType] = useState('first');
    let [fillSeg,setFillSeg] = useState([]);
    let [interSegs,setInterSegs] = useState([]);
    
    
    
    
    class FunctionPlotter extends React.Component{
      constructor(props) {
        super(props);
        this.state = {
          chartData: this.getChartData(),
          intersections: [],
          hasMounted: false,
        };
      }
      
      findIntersections = () => {
        const { chartData } = this.state;
        const { datasets } = chartData;
      
        const functionDataset = datasets.find(dataset => dataset.label === 'y = 3sin((π(x-2.85))/2)/(0.8(x-2.85)))+1.3');
        const quantizationLevels = datasets.filter(dataset => dataset.label === 'quantlvl');
        const xValues = chartData.labels; // Предполагается, что у вас есть массив xValues с соответствующими x значениями
      
        const deltaX = 0.03; // Задайте здесь нужное значение deltaX
      
        const intersectionsMap = new Map();
      
        // Iterate through function points
        functionDataset.data.forEach((functionPoint, index) => {
          const xValue = xValues[index];
          quantizationLevels.forEach(quantLevel => {
            const tolerance = 0.002;
            const intersection = quantLevel.data.find(levelPoint => Math.abs(functionPoint - levelPoint.y) <= tolerance);
      
            if (intersection) {
              const existingIntersection = intersectionsMap.get(xValue);
      
              if (!existingIntersection || functionPoint < existingIntersection.y) {
                intersectionsMap.set(xValue, { x: parseFloat(xValue), y: parseFloat(functionPoint) });
              }
            }
          });
        });
      
        // Filter out intersections with similar x and y values
        const uniqueIntersections = Array.from(intersectionsMap.values()).filter((current, index, array) => {
          const next = array[index + 1];
          const tolerance = 0.004;
          if (next && Math.abs(current.x - next.x) < deltaX && Math.abs(current.y - next.y) < tolerance) {
            return false;
          }
          return true;
        });
        
        this.setState({ intersections: uniqueIntersections });
        //console.log('INTERSECTIONS:', uniqueIntersections);

        this.setState((prevState) => {
          const updatedIntersections = uniqueIntersections;
          return { intersections: updatedIntersections, chartData: this.getChartData(updatedIntersections) };
        });
      };

      componentDidMount() {
        // Call findIntersections only after the initial render
        const intersections = this.findIntersections();
        const chartData = this.getChartData(intersections);
        this.setState({ chartData, hasMounted: true });
      }

      componentDidUpdate(prevProps, prevState) {
        if (prevState.interSegs !== this.state.interSegs) {
          const intersections = this.findIntersections();
          const updatedChartData = this.getChartData(intersections, this.state.interSegs);
    
          this.setState({
            chartData: updatedChartData,
          });
        }
      }
    
      getChartData = (intersections) => {
              
        // Здесь вы можете вычислить значения функции для различных x      
        const x = [];
        const y = [];
        
       
        let intersecTemp = intersections || [];
        

        for(let i = 0;i<intersecTemp.length;i++){
          interSegs.push(intersecTemp[i]);
        }
        interSegs=interSegs.slice(0,intersecTemp.length);
        
        
        //console.log('IN GETCHART',intersecTemp)
        
        // Вычисляем значения функции и заполняем массивы x и y
        for (let xVal = 0; xVal < 10; xVal += 0.001) {
          x.push(parseFloat(xVal.toFixed(3)));
          const yVal = 3 * Math.sin(Math.PI * (xVal - 2.85) / 2.0) / (0.8 * (xVal - 2.85)) + 1.3;
          y.push(parseFloat(yVal.toFixed(3)));
        }
        //console.log(y);
        
        // Используем quantStepValue для определения расстояния между уровнями
        const quantLevelsData = [];
        for (let i = 1; i < quantLevelValue+1; i++) {
          quantLevelsData.push(parseFloat((i*quantStepValue).toFixed(1)));
        };
        
        //console.log(selectedQuantizationType);
        


        const levels = quantLevelsData.map((point)=>({
          label: 'quantlvl',
          data: [
            { x: 0, y: parseFloat(point.toFixed(3))},
            { x: 100, y: parseFloat(point.toFixed(3)) },           
          ],
          fill: false,
          
          borderColor: 'rgb(255,0,0)',
          pointRadius: 0,
          pointHitRadius: 2,
          borderWidth: 1,
          yAxisID: 'y2',
          showLine: true,
        }));
        

       

        return {
          labels: x.map(val => val.toFixed(3)),
          datasets: [
            
            {
              label: 'y = 3sin((π(x-2.85))/2)/(0.8(x-2.85)))+1.3',
              data: y.map(val=>val.toFixed(3)),
              fill: false,             
              borderColor: 'rgb(0,0,255)',
              borderWidth: 1,
              pointRadius: 0,
              pointHitRadius: 2,
              yAxisID: 'y1',
              display: false,
              showLine:true,
            },           
            
            ...levels,
            ...fillSeg,
          ],
        };
      };
      
      render() {
        const { hasMounted } = this.state;
        
        // Conditional rendering based on component mount status
        if (!hasMounted) {
          // Render loading or initial state
          return <div>Loading...</div>;
        }
        
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
                    
                    max:8,
                  },
                  y3: {
                    id: 'y3',
                    type: 'linear',
                    position: 'left',
                    ticks: {
                      stepSize: 1, // Шаг между значениями
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
     

    const handleStartQuantiztion = (event)=> {

      let fillSegNew = [];
      
      const fillBetweenData = [];
      let intersecTemp = interSegs;
      
      const intersectionsCount = intersecTemp.length;

      for (let i = 0; i < intersectionsCount - 1; i++) {
        const currentIntersection = intersecTemp[i];
        const { x: currentX, y: currentY } = currentIntersection;        
        fillBetweenData.push({ x: currentX, y: currentY });          
      }
      
      for (let i = 0; i < fillBetweenData.length - 1; i++) {
        const point = fillBetweenData[i];
        const nextPoint = fillBetweenData[i + 1];
        if(selectedQuantizationType === 'first'){
          if(nextPoint.y<point.y){
            fillSegNew.push({
              label: ``,
              data: [
                { x: parseFloat(nextPoint.x.toFixed(3)), y: parseFloat(nextPoint.y.toFixed(3)) },
                { x: parseFloat(point.x.toFixed(3)), y: parseFloat(nextPoint.y.toFixed(3)) },
                
              ],
              fill: 0,
              backgroundColor: 'rgb(0,255,0)',
              borderColor: 'rgb(0,0,0)',
              borderWidth: 1,
              pointRadius: 0,
              yAxisID: 'y2',
              showLine: true,
            });

          }
          if(point.y<nextPoint.y || point.y === nextPoint.y){
            fillSegNew.push({
              label: ``,
              data: [
                { x: parseFloat(point.x.toFixed(3)), y: parseFloat(point.y.toFixed(3)) },
                { x: parseFloat(nextPoint.x.toFixed(3)), y: parseFloat(point.y.toFixed(3)) },
                
              ],
              fill: 0,
              backgroundColor: 'rgb(0,255,0)',
              borderColor: 'rgb(0,0,0)',
              borderWidth: 1,
              pointRadius: 0,
              yAxisID: 'y2',
              showLine: true,
            });
          }
        }

        if(selectedQuantizationType === 'second'){
          if(nextPoint.y<point.y){
            fillSegNew.push({
              label: ``,
              data: [
                { x: parseFloat(point.x.toFixed(3)), y: parseFloat(point.y.toFixed(3)) },
                { x: parseFloat(nextPoint.x.toFixed(3)), y: parseFloat(point.y.toFixed(3)) },
                
              ],
              fill: 0,
              backgroundColor: 'rgb(0,255,0)',
              borderColor: 'rgb(0,0,0)',
              borderWidth: 1,
              pointRadius: 0,
              yAxisID: 'y2',
              showLine: true,
            });

          }
          if(point.y<nextPoint.y || point.y === nextPoint.y){
            fillSegNew.push({
              label: ``,
              data: [
                { x: parseFloat(nextPoint.x.toFixed(3)), y: parseFloat(nextPoint.y.toFixed(3)) },
                { x: parseFloat(point.x.toFixed(3)), y: parseFloat(nextPoint.y.toFixed(3)) },
                
              ],
              fill: 0,
              backgroundColor: 'rgb(0,255,0)',
              borderColor: 'rgb(0,0,0)',
              borderWidth: 1,
              pointRadius: 0,
              yAxisID: 'y2',
              showLine: true,
            });
          }
        }

        if(selectedQuantizationType === 'third'){
          if(nextPoint.y<point.y){
            fillSegNew.push({
              label: ``,
              data: [
                { x: (parseFloat(point.x.toFixed(3))+((parseFloat(nextPoint.x.toFixed(3))-parseFloat(point.x.toFixed(3)))/2)), y: (parseFloat(point.y.toFixed(3))+((parseFloat(nextPoint.y.toFixed(3))-parseFloat(point.y.toFixed(3)))/2)) },
                { x: (parseFloat(nextPoint.x.toFixed(3))+((parseFloat(nextPoint.x.toFixed(3))-parseFloat(point.x.toFixed(3)))/2)), y: (parseFloat(point.y.toFixed(3))+((parseFloat(nextPoint.y.toFixed(3))-parseFloat(point.y.toFixed(3)))/2)) },
                
              ],
              fill: 0,
              backgroundColor: 'rgb(0,255,0)',
              borderColor: 'rgb(0,0,0)',
              borderWidth: 1,
              pointRadius: 0,
              yAxisID: 'y2',
              showLine: true,
            });

          }
          if(point.y<nextPoint.y || point.y === nextPoint.y){
            fillSegNew.push({
              label: ``,
              data: [
                { x: (parseFloat(nextPoint.x.toFixed(3))+((parseFloat(nextPoint.x.toFixed(3))-parseFloat(point.x.toFixed(3)))/2)), y: (parseFloat(nextPoint.y.toFixed(3))+((parseFloat(point.y.toFixed(3))-parseFloat(nextPoint.y.toFixed(3)))/2)) },
                { x: (parseFloat(point.x.toFixed(3))+((parseFloat(nextPoint.x.toFixed(3))-parseFloat(point.x.toFixed(3)))/2)), y: (parseFloat(nextPoint.y.toFixed(3))+((parseFloat(point.y.toFixed(3))-parseFloat(nextPoint.y.toFixed(3)))/2)) },
                
              ],
              fill: 0,
              backgroundColor: 'rgb(0,255,0)',
              borderColor: 'rgb(0,0,0)',
              borderWidth: 1,
              pointRadius: 0,
              yAxisID: 'y2',
              showLine: true,
            });
          }
        }
      }
      
      setFillSeg(fillSegNew);
      
    };

    const handleDeleteQuantization = () =>{
      setFillSeg([]);
    }
    

    const handleQuantizationTypeChange = (event) => {
      setSelectedQuantizationType(event.target.value);
    };

    //обработчики кнопок уровня квантования
    const handleIncreaseClick = () => {
        let pom = parseInt(quantLevelValue) + 1;
        
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
                        <select value={selectedQuantizationType} onChange={handleQuantizationTypeChange}>                           
                            <option value="first">Ближайшее значение снизу</option>
                            <option value="second">Ближайшее значение сверху</option>
                            <option value="third">Ближайшее значение </option>
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
                        <div>
                          <button onClick={handleStartQuantiztion}>Начать квантование</button>  
                        </div>     

                        <div>
                          <button onClick={handleDeleteQuantization}>Удалить квантование</button>  
                        </div>  
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