import React, { useState } from 'react';

export default function Lab5(){
    const [inputMessage, setInputMessage] = useState('');
    const [sizeSignal, setSizeSignal] = useState('');
    const [probabilityError, setProbabilityError] = useState('');
    const [outputMessage, setOutputMessage] = useState('');
    const [resultBlocks, setResultBlocks] = useState([]);
  
    const zero = '0';
    const one = '1';
  
    const textToBinary = (text) => {
      return text
        .split('')
        .map((char) => char.charCodeAt(0).toString(2).padStart(8, '0'))
        .join('');
    };
  
    const binaryToString = (binary) => {
        console.log('Value of binary',binary);
        if (binary === null || binary === undefined) {
            // Обработка случая, когда binary равно null или undefined
            return '';
          }
          
        
          return binary
            .match(/.{1,8}/g)
            .map((byte) => String.fromCharCode(parseInt(byte, 2)))
            .join('');
    };
  
    const splitBinaryString = (binaryString, blockSize) => {
      const blockCount = Math.ceil(binaryString.length / blockSize);
      const binaryBlocks = Array.from({ length: blockCount }, (_, index) => {
        const startIndex = index * blockSize;
        const block = binaryString
          .slice(startIndex, startIndex + blockSize)
          .padEnd(blockSize, '0');
        return block;
      });
      return binaryBlocks;
    };
  
    const encodeHamming = (binaryBlock, sizeSignalInt) => {
      // Ensure the binary block length is equal to sizeSignalInt
        binaryBlock = binaryBlock.padEnd(sizeSignalInt, '0');
        //console.log('binary block in encode', binaryBlock)

        // Create an array to represent the encoded block
        let encodedBlock = Array.from(binaryBlock);

        if (sizeSignal === 4){
            encodedBlock[0] = calculateParityBit(binaryBlock, [1, 3, 5, 7]);
            encodedBlock[1] = calculateParityBit(binaryBlock, [2, 3, 6, 7]);
            encodedBlock[3] = calculateParityBit(binaryBlock, [4, 5, 6, 7]);
        }
        if (sizeSignal === 8){
            encodedBlock[0] = calculateParityBit(binaryBlock, [1, 3, 5, 7]);
            encodedBlock[1] = calculateParityBit(binaryBlock, [2, 3, 6, 7]);
            encodedBlock[3] = calculateParityBit(binaryBlock, [4, 5, 6, 7]);
            encodedBlock[7] = calculateParityBit(binaryBlock, [4, 5, 6, 7]);
        }
        if (sizeSignal === 16){
            encodedBlock[0] = calculateParityBit(binaryBlock, [1, 3, 5, 7]);
            encodedBlock[1] = calculateParityBit(binaryBlock, [2, 3, 6, 7]);
            encodedBlock[3] = calculateParityBit(binaryBlock, [4, 5, 6, 7]);
            encodedBlock[7] = calculateParityBit(binaryBlock, [4, 5, 6, 7]);
            encodedBlock[15] = calculateParityBit(binaryBlock, [4, 5, 6, 7]);
        }

        console.log('binary block in encode', binaryBlock)
        return encodedBlock.join('');
    };
  
    const calculateParityBit = (block, positions) => {
        // Calculate the parity bit for the specified positions
        const parityBit = positions.reduce((parity, position) => {
          return parity ^ parseInt(block[position]);
        }, 0);
      
        return parityBit.toString();
      };
      
    const simulateErrors = (binaryBlocks, sizeSignalInt, probabilityError) => {
        const modifiedBinaryBlocks = binaryBlocks.map((block) => {
          const modifiedBlock = block.split('').map((bit, index) => {
            // Skip parity bits during error simulation
            if (index !== 0 && index !== 1 && index !== 3) {
              const randomProbability = Math.random();
              return randomProbability < probabilityError ? flipBit(bit) : bit;
            }
            return bit;
          });
      
          return modifiedBlock.join('');
        });
      
        return modifiedBinaryBlocks;
      };
      
      const flipBit = (bit) => {
        // Flip the bit (change 0 to 1 or 1 to 0)
        return bit === '0' ? '1' : '0';
    };
  
    const decodeHamming = (modifiedBinaryBlocks, sizeSignalInt) => {
        const decodedBinaryBlocks = modifiedBinaryBlocks.map((modifiedBlock) => {
          // Ensure the binary block length is equal to sizeSignalInt
          modifiedBlock = modifiedBlock.padEnd(sizeSignalInt, '0');
      
          // Create an array to represent the decoded block
          let decodedBlock = Array.from(modifiedBlock);
      
          // Calculate syndrome bits
          const syndromeP1 = calculateParityBit(modifiedBlock, [1, 3, 5, 7]);
          const syndromeP2 = calculateParityBit(modifiedBlock, [2, 3, 6, 7]);
          const syndromeP4 = calculateParityBit(modifiedBlock, [4, 5, 6, 7]);
      
          // Detect and correct errors
          const errorPosition =
            parseInt(syndromeP1, 2) * 1 + parseInt(syndromeP2, 2) * 2 + parseInt(syndromeP4, 2) * 4;
      
          if (errorPosition !== 0) {
            // Flip the bit at the detected error position
            decodedBlock[errorPosition - 1] = flipBit(decodedBlock[errorPosition - 1]);
          }
      
          // Remove parity bits
          decodedBlock = decodedBlock.filter(
            (_, index) => index !== 0 && index !== 1 && index !== 3
          );
      
          return decodedBlock.join('');
        });
      
        return decodedBinaryBlocks;
      };
  
    const onSendMessageClick = () => {
      const binaryInputMessage = textToBinary(inputMessage);
      const sizeSignalInt = parseInt(sizeSignal, 10);
      const binaryBlocks = splitBinaryString(binaryInputMessage, sizeSignalInt);
        console.log('signalSizeInp',sizeSignal)
      console.log('binaryInp',binaryInputMessage)
      console.log('signalSize',sizeSignalInt)
      console.log('binaryBlocks',binaryBlocks)
  
      const encodedBlocks = binaryBlocks.map((block) =>
        encodeHamming(block, sizeSignalInt)
      );
  
      const modifiedBinaryBlocks = simulateErrors(
        encodedBlocks,
        sizeSignalInt,
        parseFloat(probabilityError)
      );
  
      const decodedBinaryBlocks = decodeHamming(
        modifiedBinaryBlocks,
        sizeSignalInt
      );
        console.log(decodedBinaryBlocks)
      setResultBlocks(decodedBinaryBlocks);
  
      const outputBinaryMessage = decodedBinaryBlocks.join('');
      const outputTextMessage = binaryToString(outputBinaryMessage);
      setOutputMessage(outputTextMessage);
    };

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
                                <option value="8">8</option>
                                <option value="16">16</option>
                            </select>
                        </div>

                        <div style={{paddingTop:10}}>
                            <label>Вероятность ошибки:</label>
                            <input
                                style={{marginLeft:10}}
                                type="text"
                                value={probabilityError}
                                onChange={(e) => setProbabilityError(e.target.value)}
                            />
                        </div>

                        <div style={{paddingTop:10}}>
                            <button onClick={onSendMessageClick}>Send Message</button>
                        </div>
                    </div>

                    <div className="outcomesl5">
                        <div>

                        <div>
                            <label>Output Message:</label>
                            <div>{outputMessage}</div>
                        </div>

                        <div>
                            <label>Result Blocks:</label>
                            <ul>
                            {resultBlocks.map((block, index) => (
                                <li key={index}>{block}</li>
                            ))}
                            </ul>
                        </div>
                            
                        </div>
                    </div>
                
            </div>
            
            
        </>
  );
};

