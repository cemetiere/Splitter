import React from 'react';
import './App.css';

import QSplitter from "./components/QSplitter/QSplitter";

function App() {
  return (
    <div className="App">
      <QSplitter align={'horizontal'} height={'500px'} width={'1000px'} headers={['first', 'second', 'third', 'fourth']}>


          <QSplitter align={'vertical'} height={'100%'} width={'100%'} headers={['first', 'second', 'third', 'fourth']}>
              <div></div>
              <div></div>
              <div></div>
          </QSplitter>
          <div></div>
          <div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
              <div style={{height: '100px'}}>11</div>
          </div>
      </QSplitter>
    </div>
  );
}

export default App;
