import React from 'react';
import './App.css';

const { useState, useEffect } = React;

const bankOne = [
  {
    keyTrigger: 'Q',
    id: 'Heater-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-1.mp3'
  },
  {
    keyTrigger: 'W',
    id: 'Heater-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-2.mp3'
  },
  {
    keyTrigger: 'E',
    id: 'Heater-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-3.mp3'
  },
  {
    keyTrigger: 'A',
    id: 'Heater-4',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-4_1.mp3'
  },
  {
    keyTrigger: 'S',
    id: 'Clap',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Heater-6.mp3'
  },
  {
    keyTrigger: 'D',
    id: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dsc_Oh.mp3'
  },
  {
    keyTrigger: 'Z',
    id: "Kick-n'-Hat",
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Kick_n_Hat.mp3'
  },
  {
    keyTrigger: 'X',
    id: 'Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/RP4_KICK_1.mp3'
  },
  {
    keyTrigger: 'C',
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Cev_H2.mp3'
  }
];

const bankTwo = [
  {
    keyTrigger: 'Q',
    id: 'Chord-1',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3'
  },
  {
    keyTrigger: 'W',
    id: 'Chord-2',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3'
  },
  {
    keyTrigger: 'E',
    id: 'Chord-3',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3'
  },
  {
    keyTrigger: 'A',
    id: 'Shaker',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3'
  },
  {
    keyTrigger: 'S',
    id: 'Open-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3'
  },
  {
    keyTrigger: 'D',
    id: 'Closed-HH',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3'
  },
  {
    keyTrigger: 'Z',
    id: 'Punchy-Kick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3'
  },
  {
    keyTrigger: 'X',
    id: 'Side-Stick',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3'
  },
  {
    keyTrigger: 'C',
    id: 'Snare',
    url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3'
  }
];
/*
 Pad Controls Component **************************************************
*/
function PadControls(props){
  
  return(
    <div id="pad-controls">
      <h2 id="title">Sound Machine</h2>
      <ToggleSwitch name="Power" toggler={props.toggler} />
      <ToggleSwitch name="Bank" toggler={props.toggler} />
       <input id="volume" type="range" defaultValue={props.volume} step={0.01} min={0} max={1} onChange={props.getVolume} disabled={!props.power} />
      <p id="volume-box">{Math.round(props.volume*100)}</p>
      <p id="display">{props.display}</p>
    </div>
  )
}
/*
  Drum Pad Component ******************************************************
*/
function DrumPad(props){
  useEffect(() => {
    document.addEventListener('keydown', handleKeyPress);
    document.addEventListener('keyup', handleKeyUp)
    return function cleanUp(){
      document.removeEventListener('keydown', handleKeyPress)
      document.removeEventListener('keyup', handleKeyUp)
    }
  })
  function handleKeyUp(evt){
    const padId = document.getElementById(evt.key.toUpperCase());
    if(padId){
      document
        .getElementById(padId.getAttribute('name'))
        .classList.remove('active');
    }
  }
  function handleKeyPress(evt){
    if(evt.repeat) return;
    playSound(evt, evt.key.toUpperCase())
  }
  function playSound(evt, key=false){
    let sound;
    if(props.power){
      if(key){
        sound = document.getElementById(key)
        if(sound){
          document.getElementById(sound.getAttribute('name')).classList.add('active');
          props.getDisplay(sound.getAttribute('name').replace(/-/g, ' '))
        }
      } else {
        sound = document.getElementById(evt.target.innerText);
        props.getDisplay(evt.target.id.replace(/-/g, ' '));
      }
      if(sound){
        sound.currentTime = 0;
        sound.volume = props.volume;
        sound.play();
      }
    }
  }
  const pads = props.bank.map( (sound, index) => {
    return ( 
      <div key={index} className="drum-pad" id={sound.id} onClick={playSound}>
        <audio src={sound.url} id={sound.keyTrigger} name={sound.id} className="clip" />
        <span className="dp-text">{sound.keyTrigger}</span>
      </div>
    )
  })
  return(
    <div id="drum-pad">
      {pads}
    </div>
  )
}
/*
  Toggle Component ***********************************************************
*/
function ToggleSwitch(props){
  const [onOff, setOnOff] = useState(true);
  function toggle(){
    setOnOff(!onOff);
    props.toggler(props.name);
  }
  return (
    <div id="toggle">
      <p id="toggle-text">{props.name}</p>
      <div className="toggle-box" onClick={toggle}>
        <div className={ onOff ? 'toggle-switch' : 'toggle-switch translateRight'}></div>
      </div>
    </div>
  )
}
/*
  Main App Component *********************************************************
*/
function App(){
  const [bank, setBank] = useState(true);
  const [power, setPower] = useState(false);
  const [volume, setVolume] = useState(1);
  const [display, setDisplay] = useState('')
  
  function getDisplay(name){
    setDisplay(name)
  }
  function toggler(name){
    if(name === 'Bank'){
      setBank(!bank)
    }else if(name === 'Power'){
      setDisplay('');
      setPower(!power);
    }
  }
  
  function getVolume(evt){
    if(power){
      setVolume(evt.target.value);
    }
  }
  
  return(
    <div id="drum-machine">
      <DrumPad power={power} bank={bank ? bankOne : bankTwo} volume={volume} getDisplay={getDisplay}/>
      <PadControls power={power} volume={volume} getVolume={getVolume} display={display} toggler={toggler} />
    </div>
  )
}

export default App;
