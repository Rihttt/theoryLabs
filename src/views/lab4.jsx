import { useState } from "react";
import React from 'react';
import Tree from 'react-d3-tree';
import {readTextFile} from "@tauri-apps/api/fs";
import {open} from "@tauri-apps/api/dialog";






export default function Lab4(){
    let [fileContent, setFileContent] = useState("");
    const [letter, setLetter] = useState('');
    const [letters, setLetters] = useState([]);
    let [probability, setProbability] = useState([]);
    let[treeData,setTreeData]= useState({ name: 'Root', children: [] })

    const MyTreeComponent = ({ treeData }) => {
        return (
          <div style={{ width: '100%', height: '500px' }}>
            <Tree
              data={treeData}
              translate={{ x: 320, y: 200 }} 
              orientation="vertical" 
              pathFunc="straight" 
              collapsible={false}
            />
          </div>
        );
      };
      
    const calculateProbability = () => {
        const totalCharacters = fileContent.replace(/[^A-Za-zА-Яа-яЁё]/g, '');

        const root = {
            name: 'Root',
            letters: letters.join(', '), 
            children: [],
        };
    
        const probabilities = letters.map((currentLetter) => {
            const letterCount = totalCharacters
                .split('')
                .filter((char) => char.toLowerCase() === currentLetter.toLowerCase()).length;
    
            const calculatedProbability = letterCount / totalCharacters.length;
    
            return { letter: currentLetter, probability: calculatedProbability.toFixed(3) };
        });
    
        const sortedProbabilities = probabilities.sort((a, b) => b.probability - a.probability);
        
        console.log('Sorted Probabilities:', sortedProbabilities);
        setProbability(sortedProbabilities);
        
        
        const divideArray = (parentNode, subArray) => {
            if (subArray.length <= 1) {
            
                return;
            }
        
            const mid = Math.floor(subArray.length / 2);
        
            const leftChild = {
                name: ``,
                children: subArray.slice(0, mid).map(({ letter, probability }) => ({
                    name: `${letter}: ${probability.toFixed(3)}`,
                    children: [], 
                })),
            };
        
            const rightChild = {
                name: ``,
                children: subArray.slice(mid).map(({ letter, probability }) => ({
                    name: `${letter}: ${probability.toFixed(3)}`,
                    children: [], 
                })),
            };
        
            parentNode.children = [leftChild, rightChild];
        
            
            divideArray(leftChild, subArray.slice(0, mid));
            divideArray(rightChild, subArray.slice(mid));

            if (subArray.length > 1) {
                leftChild.name += ` ${subArray.slice(0, mid).map(({ letter, probability }) => `${letter}: ${probability.toFixed(3)}`).join(', ')}`;
                rightChild.name += ` ${subArray.slice(mid).map(({ letter, probability }) => `${letter}: ${probability.toFixed(3)}`).join(', ')}`;
            }
        };
        const probabilities1 = letters.map((currentLetter) => {
            const letterCount = totalCharacters
                .split('')
                .filter((char) => char.toLowerCase() === currentLetter.toLowerCase()).length;
        
            const calculatedProbability = letterCount / totalCharacters.length;
        
            return { letter: currentLetter, probability: calculatedProbability };
        });

        const sortedProbabilities1 = probabilities1.sort((a, b) => b.probability - a.probability);
    
        divideArray(root, sortedProbabilities1);
        setTreeData(root);
    };

    
    
    console.log('out',probability);
    const readFileContents = async () =>{
        try{
          const selectedPath = await open({
            multiple: false,
            title: "Open Text File",
            
          });
          if(!selectedPath) return;
          setFileContent(await readTextFile(selectedPath));
          
    
        }catch(err){
          console.error(err);
        };
     }

     const handleAddLetter = () =>{
        setLetters((prevLetters) => {
            const updatedLetters = [...prevLetters, letter];
            
            return updatedLetters;
        });
     }

     const handleRemoveLastLetter = () => {
        setLetters((prevLetters) => {
            const updatedLetters = prevLetters.slice(0, -1);
            
            return updatedLetters;
        });
    };

    
    return(
        <>
            
            <div className="content">
                <h2>lab4</h2>
                    <div className="properties">
                        <button onClick={readFileContents}>Открыть файл</button>
                        <div style={{marginTop:10}}>
                            <input type="text" value={letter} onChange={(e) => setLetter(e.target.value)} style={{width:100}}></input>
                            <button onClick={handleAddLetter}>Добавить букву</button>
                            <button onClick={handleRemoveLastLetter}>Убрать букву</button>
                        </div>

                        <div style={{marginTop:10}}>
                            <button onClick={calculateProbability}>Рассчитать вероятности</button>
                        </div>

                        <div style={{marginTop:10}}>
                            Текущие буквы: {letters.join(', ')}
                        </div>
                        <div style={{ marginTop: 10 }}>
                            <h3>Отсортированные вероятности:</h3>
                            <ul>
                                {probability.map((item) => (
                                    <li key={item.letter}>{`${item.letter}: ${item.probability}`}</li>
                                ))}
                            </ul>
                        </div>
                    </div>

                    <div className="outcomesl5">
                        <MyTreeComponent treeData={treeData} />
                    </div>
                
            </div>
            
            
        </>
    )
    
}