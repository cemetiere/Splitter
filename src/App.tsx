import React from 'react';
import './App.css';

import QSplitter from "./components/QSplitter/QSplitter";

function App() {
  return (
    <div className="App">
      <QSplitter align={'vertical'} height={'259px'} width={'932px'} headers={['first', 'second', 'third']}>

          <div></div>
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
