import React, { useState } from 'react';
import '../BinarySearcComponent.css';



export default function Lab3(){
    const [array, setArray] = useState([]);
    const [tempArray, setTempaArray] = useState([])
    const [target, setTarget] = useState('');
    const [path, setPath] = useState([]);
    const [result, setResult] = useState('');
    const [intermediateArrays, setIntermediateArrays] = useState([]);
    const [binaryWay,setBinaryWay] = useState('');
    const [Hart,setHart]=useState(0);

    const search = (array,target) => {
        const left = 0;
        const right = array.length - 1
        const binarySearch = (array,target,left,right) => {
            const mid = Math.floor((left + right)/2);
            

            if(target === array[mid]){
                
                setResult(mid);
                if(left=mid){
                    console.log('left<mid',left)
                    console.log('left<mid',right)
                    console.log('left<mid',mid)
                    setBinaryWay((prevBinaryWay) => prevBinaryWay + '0');
                    if(left===6||left===2){
                        setBinaryWay((prevBinaryWay) => prevBinaryWay + '1');
                    }
                }else if(mid<right && mid !==0){
                    console.log('mid<right',left)
                    console.log('mid<right',right)
                    console.log('mid<right',mid)
                    setBinaryWay((prevBinaryWay) => prevBinaryWay + '1');
                    
                }
                
                
                return mid
            }else if (right === left){
                return -1
            }

            if (target < array[mid]){
                const intermediateArray = array.slice(left, mid);
                setIntermediateArrays((prevArrays) => [...prevArrays, intermediateArray]);
                setBinaryWay((prevBinaryWay) => prevBinaryWay + '1');
                return binarySearch(array,target,left,mid);
            } else{
                const intermediateArray = array.slice(mid, right);
                setIntermediateArrays((prevArrays) => [...prevArrays, intermediateArray]);
                
                setBinaryWay((prevBinaryWay) => prevBinaryWay + '0');
                return binarySearch(array,target,mid,right);
            }
        }
        return binarySearch(array,target,left,right);
    };

    const handleStartClick = () => {
        setBinaryWay('');
        setIntermediateArrays([]);
        search(array,target);
        setHart(Math.log2(array.length))
    };

    const handleAddElementClick = () => {
        const newElement = prompt('Введите новый элемент:');
        if (newElement) {
            setArray([...array, newElement]);
            setTarget('');
            const newBinaryWay='';
            setBinaryWay(newBinaryWay)
            setResult('');
        }
    };

    const handleRemoveArray = () => {
        setArray([]);
        setBinaryWay('');
        setIntermediateArrays([]);
        setResult('');
        setTarget('');
    }

    const renderArrayWithArrows = () => {
        return (
            <div className="array-container" style={{marginBottom:10}}>
                <div className="main-array" style={{paddingBottom:10}}>
                    {array.map((value, index) => (
                        <div key={index} className={`array-element ${path.includes(index) ? 'highlighted' : ''}`} style={{ top: index * 80, float:'left' }}>
                            {value}
                        </div>
                    ))}
                </div>
                <div className="intermediate-arrays" style={{paddingTop:10}}>
                    {intermediateArrays.map((intermediateArray, i) => (
                        <div key={i} className={`array-element ${path.includes(i) ? 'highlighted' : ''}`} style={{ top: i * 80, marginTop:10, paddingLeft:10,paddingRight:10}}>
                            {intermediateArray.map((value, i) => (
                                <span key={i}>{value}</span>
                            ))}
                           
                        </div>
                    ))}

                </div>
                <div className={`array-element  ? 'highlighted' : ''}`} style={{ top: 80, marginTop:10, paddingLeft:10,paddingRight:10}}>
                    {result+1}
                </div>
            </div>
        );
    };

    return(
        <>
            
            <div className="content">
                <h2>lab3</h2>
                    <div className="properties">
                        <div>
                            <label>Введите элемент для поиска:</label>
                            <input type="text" value={target} onChange={(e) => setTarget(e.target.value)} style={{width:100}} />
                        </div>
                        <div style={{margin:10, paddingLeft:10}}>
                            <button onClick={handleStartClick} style={{paddingLeft:10}}>Начать поиск</button>
                        </div>
                        <div style={{margin:10, paddingLeft:10}}>
                            <button onClick={handleAddElementClick}>Добавить элемент</button>
                            <button onClick={handleRemoveArray}>Очистить массив</button>
                        </div>
                    </div>

                    <div className="outcomesl5">
                        <div className="visualization">
                            <div className="array">{renderArrayWithArrows()}</div>
                            <div>
                                Элемент массива содержащий заданное значение имеет индекс - {result}
                            </div>
                            <div>
                                Бинарный путь до элемента: {binaryWay}
                            </div>
                            <div>
                                (1-шаг вправо, 0-шаг влево)
                            </div>
                            <div>
                                Количество информации по формуле Хартли: {Hart}
                            </div>
                            <div>
                            Т.к биты - дискретная величина, округляем до ближайшего большего числа: {Math.ceil(Hart)}
                            </div>
                        </div>
                    </div>
                
            </div>
            
            
        </>
    )
}