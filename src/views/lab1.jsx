import { useState, useRef, useEffect} from "react";
import { invoke } from "@tauri-apps/api/tauri";
import React from "react";
import function1 from "E:/Programming/theoryLabs/src/assets/function1.png"
import {Chart} from 'chart.js/auto';



const LineChart = () => {
    const chartRef = useRef(null);
  
    useEffect(() => {
      const ctx = chartRef.current.getContext('2d');
  
      const data = {
        labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        datasets: [
          {
            label: 'My First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
      };
  
      const options = {
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
          },
          y: {
            type: 'linear',
            position: 'left',
          },
        },
      };
  
      // Уничтожение предыдущего графика перед созданием нового
      const existingChart = chartRef.current?.chart;
      if (existingChart) {
        existingChart.destroy();
      }
  
      const newChart = new Chart(ctx, {
        type: 'line',
        data: data,
        options: options,
      });
  
      // Сохранение ссылки на созданный график в ref
      chartRef.current.chart = newChart;
  
      // Очистка при размонтировании компонента
      return () => {
        newChart.destroy();
      };
    }, []); // Пустой массив зависимостей, чтобы эффект выполнился только при монтировании и демонтаже компонента
  
    return <canvas ref={chartRef} />;
  };
  

export default function Lab1(){

    let [quantLevelValue,setQuantLevelValue] = useState(7);
    let [quantStepValue,setQuantStepValue] = useState(0.5);
    let [isButtonDisabled, setButtonDisabled] = useState(false);
    let [isButton1Disabled, setButton1Disabled] = useState(false);

        

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
            
                            <LineChart />
                        </div>
                    </div>
                
            </div>
            
            
        </>
    )
}