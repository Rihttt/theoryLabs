import React, { useState } from 'react';

export default function Lab5(){
    const [inputMessage, setInputMessage] = useState('');
    const [outputMessage,setOutputMessage] = useState('');
    const [outputMessage2,setOutputMessage2] = useState('');
    const [textLanguage,seteTExtLanguage] = useState('Русский');
    const [sizeSignal, setSizeSignal] = useState('4');
    const [probabilityError, setProbabilityError] = useState('');
    const [binaryChunks, setBinaryChunks] = useState([]);
    const [blockWithError1,setBlockWithError1] = useState(0)
    const [bitWithError1,setBitWithError1] = useState(0)
    const [encodedBinaryChunks, setEncodedBinaryChunks] = useState([]);
    const [isChecked,setIsChecked]= useState(false);

    const convertToBinary = (toConvert) => {
      //console.log('toConvert',toConvert)
      const binaryString = toConvert
        .split('')
        .map((char) => char.charCodeAt(0).toString(2))
        .join('');
  
      //setBinary(binaryString);
      return binaryString
    };

    const convertToText = (toConvert) => {
      
      const textString = toConvert
        .split(' ')
        .map((bin) => String.fromCharCode(parseInt(bin, 2)))
        .join('');
      return textString;
    };
  
  
    const splitBinaryString = (message) => {
      const chunks = [];
      for (let i = 0; i < message.length; i += parseInt(sizeSignal)) {
        chunks.push(message.slice(i, i + parseInt(sizeSignal)));
      }
      setBinaryChunks(chunks);
      
    };
    /*
      КОДИРОВАНИЕ
    */
  
    const calculateParityBit = (data, positions) => {
      
      for(let i = 0;i<data.length;i++){
        switch (i) {
          case 0:
            
            let sum = 0;
            for(let i = 2; data.length;i+=2){
              if(i<data.length){
              sum+=parseInt(data[i]);
              }else{break;}
            }
            sum = sum%2;
            data[0]= sum.toString();
           
            break;
          case 1:
            
            let sum1 = 0;
            for(let i = 2; data.length;i+=3){
              if(i<data.length){
                
                if(i===2){
                  sum1+=parseInt(data[i]);
                }else {
                  
                  sum1+=parseInt(data[i])+parseInt(data[i+1]);
                  i+=1
                  
                }         
              }else{break;}
            }
            sum1 = sum1%2;
            data[1]= sum1.toString();
            
            break;   
          case 3:
            
            let sum2 = 0;
            for(let i = 4; data.length;i+=7){
              if(i<data.length){
                if(i===4){
                  sum2+=parseInt(data[i])+parseInt(data[i+1])+parseInt(data[i+2]);
                }else if(i===11) {
                  sum2+=parseInt(data[i])+parseInt(data[i+1])+parseInt(data[i+2])+parseInt(data[i+3]);
                  i+=1
                }else if(i===19){
                  sum2+=parseInt(data[i])+parseInt(data[i+1])
                }       
              }else{break;}
            }
            sum2 = sum2%2;
            data[3]=sum2.toString();
            
            break;
          case 7:
            
            let sum3 = 0;
            for(let i = 8; data.length;i+=8){
              if(i<data.length){
              sum3+=parseInt(data[i])+parseInt(data[i+1])+parseInt(data[i+2])+parseInt(data[i+3])+parseInt(data[i+4])+parseInt(data[i+5])+parseInt(data[i+6]);
              }else{break;}
            }
            sum3 = sum3%2;
            data[7]=sum3.toString();
            
            break;

          default: break;
        }
      }
      
     
      return data;
    };
    
    
    // Функция для добавления битов четности на указанные позиции
    const addParityBits = (data, parityPositions) => {
     
      
      const dataArray = data.split('');
      
      while(dataArray.length<sizeSignal){
        dataArray.push('0');
      }
      // Добавляем биты четности на указанные позиции и сдвигаем оригинальные элементы вправо
      parityPositions.forEach((position) => {
        const parityBit = 2;
        dataArray.splice(position, 0, parityBit.toString());
      });

      const resultArray = dataArray.filter(item => item !== undefined);
      
      // Возвращаем результат в виде строки
      return resultArray;
    };
    
    // Функция для кодирования Хэмминга (7,4)
    const hamming74Encode = (data) => {
      const parityPositions = [0, 1, 3];
      return calculateParityBit(addParityBits(data, parityPositions),parityPositions);
    };
    
    // Функция для кодирования Хэмминга (15,11)
    const hamming1511Encode = (data) => {
      const parityPositions = [0, 1, 3, 7];
      return calculateParityBit(addParityBits(data, parityPositions),parityPositions);
    };
    
   
    

    // Функция для выбора правильной кодировки Хэмминга в зависимости от sizeSignal
    const encodeDataWithHamming = (data, sizeSignal) => {
      switch (parseInt(sizeSignal)) {
        case 4:
          return hamming74Encode(data);
        case 11:
          return hamming1511Encode(data);
        
        default:
          console.error('Unsupported sizeSignal');
          return '';
      }
    };

    /*
      ДЕКОДИРОВАНИЕ
    */
  
    const removeParityBits = (encodedData) => {
      
      let dataWithoutParityBits = '';
      if(sizeSignal==='4'){
        dataWithoutParityBits = encodedData.split('').filter((_, index) => ![1, 2, 4].includes(index + 1)).join('');
      }else{
        dataWithoutParityBits = encodedData.split('').filter((_, index) => ![1, 2, 4, 8].includes(index + 1)).join('');
      }
      
      return dataWithoutParityBits;
    };

    const correctErrorsHamming74 = (data, syndrome) => {
      let errorPosition = 0;
      for (let i = 0; i < 3; i++) {
        errorPosition += syndrome[i] * Math.pow(2, i);
      }
    
      if (errorPosition !== 0) {
        console.log(`Error found at position ${errorPosition} in block `);
        data[errorPosition - 1] = data[errorPosition - 1] === '0' ? '1' : '0';
      }
    
      return data;
    };

    const correctErrorsHamming1511 = (data, syndrome) => {
      let errorPosition = 0;
      for (let i = 0; i < 4; i++) {
        errorPosition += syndrome[i] * Math.pow(2, i);
      }
    
      if (errorPosition !== 0) {
        console.log(`Error found at position ${errorPosition} in block `);
        data[errorPosition - 1] = data[errorPosition - 1] === '0' ? '1' : '0';
      }
    
      return data;
    };

    const calculateSyndromeHamming74 = (data) => {
      const syndrome = [];
    
      for (let i = 0; i < 3; i++) {
        let sum = 0;
    
        for (let j = 0; j < 7; j++) {
          if ((j & (1 << i)) !== 0) {
            sum += parseInt(data[j]);
          }
        }
    
        syndrome.push(sum % 2);
      }
      console.log('that fckn syndrome',syndrome);
      return syndrome;
    };

    const calculateSyndromeHamming1511 = (data) => {
      const syndrome = [];
    
      for (let i = 0; i < 4; i++) {
        let sum = 0;
    
        for (let j = 0; j < 15; j++) {
          if ((j & (1 << i)) !== 0) {
            sum += parseInt(data[j]);
          }
        }
    
        syndrome.push(sum % 2);
      }
      
      return syndrome;
    };


    /*
      ХЭНДЛЕРЫ
    */
    const convertArraysToStrings = (arrays) => {
      
      return arrays.map(array => array.join('')).join(' ');
    };

    const handleBreakButtonClick = () =>{
      console.log('INPUT',convertToBinary(inputMessage))
      splitBinaryString(convertToBinary(inputMessage));
    }

    const handleCheckboxChange = () => {
      setIsChecked(!isChecked); // Инвертируем текущее значение
    };

    const toggleBit = (block, bitIndex) => {
      block[bitIndex] = block[bitIndex] === '0' ? '1' : '0';
      return block;
    };

    const handleCodeButtonClick = () =>{     
      //console.log('binary',binary)
      
      console.log('chunks',binaryChunks)
      let toEncode = [];
      for(let i = 0;i<binaryChunks.length;i++){
        toEncode[i]=encodeDataWithHamming(binaryChunks[i],sizeSignal)
      }

      const blockWithError = Math.floor(Math.random() * toEncode.length);
      console.log('blockWithError',blockWithError)
      setBlockWithError1(blockWithError)
      const bitWithError = Math.floor(Math.random() * toEncode[blockWithError].length);
      console.log('bitWithError',bitWithError)
      setBitWithError1(bitWithError)
      toEncode[blockWithError] = toggleBit(toEncode[blockWithError], bitWithError);
      setEncodedBinaryChunks(toEncode)
      //console.log('encodedChunks',toEncode)
      let convertedEncode = convertToText(convertArraysToStrings(toEncode));
      //console.log('encodedChunksAfter',toEncode)
      //console.log('result',encodedBinaryChunks);
      setOutputMessage(convertedEncode);
    }

    const handleDecodeButtonClick = () =>{
        if(isChecked){
          if(sizeSignal === '4'){
            for(let i=0;i<encodedBinaryChunks.length;i++){
              if(blockWithError1 === i){
                console.log('in', i)
                encodedBinaryChunks[i]=toggleBit(encodedBinaryChunks[i],bitWithError1)
                console.log('encodedBinaryChunksINDEOCDE',encodedBinaryChunks[i])
              }
            }
          }else{
            for(let i=0;i<encodedBinaryChunks.length;i++){
              if(blockWithError1 === i){
                encodedBinaryChunks[i]=toggleBit(encodedBinaryChunks[i],bitWithError1)
                console.log('encodedBinaryChunksINDEOCDE',encodedBinaryChunks[i])
              }
            }
          }
        }
        let dataToRemove = convertArraysToStrings(encodedBinaryChunks)
        let dataToRemoveArray = dataToRemove.split(' ');
        let decodedText1 = []
        for (let i = 0;i<dataToRemoveArray.length;i++){
          
          decodedText1[i] = removeParityBits(dataToRemoveArray[i])
          
        }
        let decodedTextWithoutBlanks = decodedText1.filter(element => element !== '')
        console.log('decodedTextWB',decodedTextWithoutBlanks)
        
        if(textLanguage === 'Русский'){
          decodedTextWithoutBlanks = decodedTextWithoutBlanks.join('').replace(/(.{1,11})/g, (match, group) => group.length === 11 ? group + ' ' : '').trim();
        }else{
          decodedTextWithoutBlanks = decodedTextWithoutBlanks.join('').replace(/(.{1,7})/g, (match, group) => group.length === 7 ? group + ' ' : '').trim();
        }
        console.log('decodedTextWB',decodedTextWithoutBlanks)
        let convertBinToText = convertToText(decodedTextWithoutBlanks)
        
        setOutputMessage2(convertBinToText)
        dataToRemove = ''
        dataToRemoveArray = []
        decodedTextWithoutBlanks = []
    }

  return (
    <>
            
            <div className="content">
                <h2>lab5</h2>
                    <div className="properties">
                        <div style={{paddingTop:10}}>
                            <label>Сообщение:</label>
                            <input
                                style={{marginLeft:75}}
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                            />
                        </div>

                        <div style={{paddingTop:10}}>
                            <label>Размер сигнала:</label>
                            <select className='signalSize'value={sizeSignal} onChange={(e) => setSizeSignal(e.target.value)}>                           
                                <option value="4">4</option>
                                <option value="11">11</option>
                               
                            </select>
                        </div>


                        <div style={{paddingTop:10}}>
                            <label>Язык текста:</label>
                            <select className='signalSize'value={textLanguage} onChange={(e) => seteTExtLanguage(e.target.value)}>                           
                                <option value="Русский">Русский</option>
                                <option value="English">English</option>
                               
                            </select>
                        </div>
                 
                        <div style={{paddingTop:10}}>
                            <button onClick={handleBreakButtonClick}>Разбить строку</button>
                        </div> 

                        <div style={{paddingTop:10}}>
                            <button onClick={handleCodeButtonClick}>Отправить сообщение</button>
                        </div>

                        <div style={{paddingTop:10}}>
                            <label>Исправлять ошибку:</label>
                            <input
                                style={{marginLeft:10}}
                                type="checkbox"
                                value={isChecked}
                                onChange={handleCheckboxChange}
                            />
                        </div>

                        <div style={{paddingTop:10}}>
                            <button onClick={handleDecodeButtonClick}>Декодировать</button>
                        </div>
                    </div>

                    <div className="outcomesl5">
                        <div>

                        <div>
                            <label>Закодированное сообщение:</label>
                            <div>{outputMessage}</div>
                        </div>

                        <div>
                            <label>Декодированное сообщение:</label>
                            <div>{outputMessage2}</div>
                            
                        </div>
                            
                        </div>

                        <div>
                          
                        </div>
                    </div>
                
            </div>
            
            
        </>
  );
};

