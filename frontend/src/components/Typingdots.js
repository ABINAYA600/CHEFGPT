import React from "react";

/* minimal inline style - placed in chatwindow.css or here as component */
const TypingDots = () => (
  <div style={{display:'flex',gap:6,alignItems:'center'}}>
    <div className="dot" style={{width:8,height:8,borderRadius:4,background:'#ccc',opacity:0.9,animation:'blink 1s infinite'}}/>
    <div className="dot" style={{width:8,height:8,borderRadius:4,background:'#ccc',opacity:0.6,animation:'blink 1s 0.15s infinite'}}/>
    <div className="dot" style={{width:8,height:8,borderRadius:4,background:'#ccc',opacity:0.4,animation:'blink 1s 0.3s infinite'}}/>
    <style>{`@keyframes blink{0%{transform:translateY(0)}50%{transform:translateY(-6px)}100%{transform:translateY(0)}}`}</style>
  </div>
);

export default TypingDots;
