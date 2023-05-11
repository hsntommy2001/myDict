import React, { useState } from 'react';
import './Dict.css';

const App = () => {
  const [inputValue, setInputValue] = useState('');
  const [responseData, setResponseData] = useState([]);
  const [error, setError] = useState(null);

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  const handleButtonClick = () => {
    const valueToSend = inputValue; // Store the inputValue in a variable 
    fetchData(valueToSend);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleButtonClick();
    }
  };

  const fetchData = (value) => {
    //alert(value);
    fetch('https://api.dictionaryapi.dev/api/v2/entries/en/' + value, {
      method: 'GET',
      //body: JSON.stringify({ input: value }), // Use the stored value
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        if (data.title === 'No Definitions Found') {
          setError(data.message);
          setResponseData([]);
        } else {
          setResponseData(data);
          setError(null);
        }
      })
      .catch(error => {
        setError('Error occurred while fetching data.');
        //alert("2");
        // Handle any errors that occur during the request
      });
  };

  return (
    <div className="container">
      <div className="input-group">
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder="Enter a word"
        />
        <button onClick={handleButtonClick} autoFocus>Submit</button>
      </div>

      {error && <p className="error">Error: {error}</p>}

      {responseData.length === 0 ? (
        <p className="no-data"></p>
      ) : (
        responseData.map((item, index) => (
          <div className="word-card" key={index}>
            <h2>Word: {item.word}</h2>
            <p>Phonetic: {item.phonetic}</p>

            <div className="meanings">
              <h3>Meanings:</h3>
              {item.meanings.map((meaning, meaningIndex) => (
                <div key={meaningIndex}>
                  <p className="part-of-speech">Part of Speech: {meaning.partOfSpeech}</p>
                  {meaning.definitions.map((definition, definitionIndex) => (
                    <div key={definitionIndex}>
                      <p className="definition">Definition: {definition.definition}</p>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default App;
