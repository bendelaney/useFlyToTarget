'use client';

import React, { useState, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { Flip } from 'gsap/Flip';
import { CustomEase } from 'gsap/CustomEase';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';
import { useFlyToTarget } from '@/hooks/useFlyToTarget';

gsap.registerPlugin(Flip, CustomEase, MotionPathPlugin);

export default function Sandbox() {
  const dartRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const [isAtTarget, setIsAtTarget] = useState(false);
  const [isTouched, setIsTouched] = useState(false);

  const { flyToTarget: animateFlyToTarget } = useFlyToTarget();
  
// Default animation parameters
// (from config output)
// {
//   "motionDuration": 0.45,
//   "motionEase": "power3.out",
//   "swoopAmount": -100,
//   "scale": true,
//   "scaleStartDelay": 0,
//   "scaleUpDuration": 0.2,
//   "scaleUpEase": "power3.in",
//   "scalePeak": 1.9,
//   "scalePause": 0.05,
//   "scaleDownDuration": 0.1,
//   "scaleDownEase": "none",
//   "scaleTarget": 0.4
// }

// Animation parameters
  const [motionDuration, setMotionDuration] = useState(0.45);
  const [motionEase, setMotionEase] = useState('power3.out');
  const [scale, setScale] = useState(true);
  const [swoopAmount, setSwoopAmount] = useState(-100);

  // Scale animation parameters
  const [scalePeak, setScalePeak] = useState(1.9);
  const [scaleUpDuration, setScaleUpDuration] = useState(0.2);
  const [scaleUpEase, setScaleUpEase] = useState('power3.in');
  const [scaleStartDelay, setScaleStartDelay] = useState(0.0);
  const [scalePause, setScalePause] = useState(0.05);
  const [scaleDownDuration, setScaleDownDuration] = useState(0.1);
  const [scaleDownEase, setScaleDownEase] = useState('none');
  const [scaleTarget, setScaleTarget] = useState(0.4);

  const easeOptions = [
    'none',
    'power1.in', 'power1.out', 'power1.inOut',
    'power2.in', 'power2.out', 'power2.inOut',
    'power3.in', 'power3.out', 'power3.inOut',
    'power4.in', 'power4.out', 'power4.inOut',
    'back.in', 'back.out', 'back.inOut',
    'elastic.in', 'elastic.out', 'elastic.inOut',
    'expo.in', 'expo.out', 'expo.inOut',
    'bounce.in', 'bounce.out', 'bounce.inOut',
    'circ.in', 'circ.out', 'circ.inOut',
  ];

  const flyToTarget = () => {
    animateFlyToTarget(dartRef.current, targetRef.current, {
      motionDuration,
      motionEase,
      swoopAmount,
      scale,
      scaleStartDelay,
      scaleUpDuration,
      scaleUpEase,
      scalePeak,
      scalePause,
      scaleDownDuration,
      scaleDownEase,
      scaleTarget,
      onComplete: () => {
        setIsAtTarget(true);
      },
    });
  };

  const handleReset = () => {
    if (!dartRef.current) return;

    // Kill any running animations first
    gsap.killTweensOf(dartRef.current);

    // Clear all GSAP transforms
    gsap.set(dartRef.current, { x: 0, y: 0, rotation: 0, scale: 1 });

    // Kill and recreate draggable by changing state
    setIsAtTarget(false);
  };

  return (
    <>
      <div className="sandbox-container">

        {/* Controls Panel */}
        <div className="controls-panel">

          <div className="parameters-panel">
            <h3 className="parameters-title">Parameters</h3>

            <label className="parameter-label">
              Duration: {motionDuration.toFixed(2)}s
              <input
                type="range"
                min="0.10"
                max="3.00"
                step="0.01"
                value={motionDuration}
                onChange={(e) => setMotionDuration(parseFloat(e.target.value))}
              />
            </label>

            <label className="parameter-label">
              Ease:
              <select
                className="ease-select"
                value={motionEase}
                onChange={(e) => setMotionEase(e.target.value)}
              >
                {easeOptions.map(e => (
                  <option key={e} value={e}>{e}</option>
                ))}
              </select>
            </label>

            <label className="parameter-label">
              Swoop Amount: {swoopAmount}px
              <input
                type="range"
                min="-200"
                max="200"
                step="10"
                value={swoopAmount}
                onChange={(e) => setSwoopAmount(parseFloat(e.target.value))}
              />
            </label>

            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={scale}
                onChange={(e) => setScale(e.target.checked)}
              />
              Animate Scale
            </label>

            {scale && (
            <>
              <label className="parameter-label">
                Scale Start Delay: {scaleStartDelay.toFixed(2)}
                <input
                  type="range"
                  min="0"
                  max="1.0"
                  step="0.01"
                  value={scaleStartDelay}
                  onChange={(e) => setScaleStartDelay(parseFloat(e.target.value))}
                />
              </label>

              <label className="parameter-label">
                Scale Up Duration: {scaleUpDuration.toFixed(2)}s
                <input
                  type="range"
                  min="0.10"
                  max="3.00"
                  step="0.01"
                  value={scaleUpDuration}
                  onChange={(e) => setScaleUpDuration(parseFloat(e.target.value))}
                />
              </label>

              <label className="parameter-label">
                Scale Up Ease:
                <select
                  className="scale-ease-select"
                  value={scaleUpEase}
                  onChange={(e) => setScaleUpEase(e.target.value)}
                >
                  {easeOptions.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </label>

              <label className="parameter-label">
                Scale Peak: {scalePeak.toFixed(2)}
                <input
                  type="range"
                  min="1.0"
                  max="3.0"
                  step="0.1"
                  value={scalePeak}
                  onChange={(e) => setScalePeak(parseFloat(e.target.value))}
                />
              </label>


              <label className="parameter-label">
                Scale Pause: {scalePause.toFixed(2)}
                <input
                  type="range"
                  min="0"
                  max="4.0"
                  step="0.01"
                  value={scalePause}
                  onChange={(e) => setScalePause(parseFloat(e.target.value))}
                />
              </label>

              <label className="parameter-label">
                Scale Down Duration: {scaleDownDuration.toFixed(2)}
                <input
                  type="range"
                  min="0"
                  max="4.0"
                  step="0.01"
                  value={scaleDownDuration}
                  onChange={(e) => setScaleDownDuration(parseFloat(e.target.value))}
                />
              </label>

              <label className="parameter-label">
                Scale Down Ease:
                <select
                  className="scale-ease-select"
                  value={scaleDownEase}
                  onChange={(e) => setScaleDownEase(e.target.value)}
                >
                  {easeOptions.map(e => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </label>

              <label className="parameter-label">
                Scale Target: {scaleTarget.toFixed(2)}
                <input
                  type="range"
                  min="0"
                  max="4.0"
                  step="0.1"
                  value={scaleTarget}
                  onChange={(e) => setScaleTarget(parseFloat(e.target.value))}
                />
              </label>
            </>
            )}

            <button
              onClick={handleReset}
              disabled={!isAtTarget}
              className={`reset-button ${isAtTarget ? 'enabled' : 'disabled'}`}
              >
              🔄 Reset
            </button>
          </div>

          <div className="config-output-panel">
            <div className="config-output-content">
              {JSON.stringify({
                motionDuration,
                motionEase,
                swoopAmount,
                scale,
                scaleStartDelay,
                scaleUpDuration,
                scaleUpEase,
                scalePeak,
                scalePause,
                scaleDownDuration,
                scaleDownEase,
                scaleTarget,
              }, null, 2)}
            </div>
          </div>
        </div>

        {/* Target - Upper Right */}
        <div
          id="target"
          ref={targetRef}
          className="target-circle"
        />


        {/* Dart Home - Mid-Lower Left */}
        <div
          id="dart-home"
          className="dart-home"
        >
          <div
            id="dart"
            ref={dartRef}
            onClick={() => flyToTarget()}
            className={`dart ${isTouched ? 'grabbing' : 'grabbable'}`}
          />
        </div>
      </div>

      <style jsx>{`
        body {background-color: #dad8d0;}
        .sandbox-container {
          position: relative;
          width: 100%;
          height: 100vh;
          overflow: hidden;
          // background: rgba(0, 0, 0, 0.8);
        }

        .controls-panel {
          position: absolute;
          top: 0px;
          left: 0px;
          z-index: 100;
          display: flex;
        }

        .parameters-panel {
          background: rgba(0, 0, 0, 0.8);
          padding: 20px;
          color: white;
          display: flex;
          flex-direction: column;
          gap: 12px;
          min-width: 320px;
        }

        .parameters-title {
          margin: 0;
          margin-bottom: 8px;
        }

        .parameter-label {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .ease-select,
        .scale-ease-select {
          padding: 6px;
          border-radius: 4px;
        }

        .checkbox-label {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .reset-button {
          margin-top: 8px;
          padding: 10px 16px;
          border-radius: 6px;
          border: none;
          color: white;
          font-weight: bold;
          transition: background 0.2s;
        }

        .reset-button.enabled {
          background: #4caf50;
          cursor: pointer;
        }

        .reset-button.disabled {
          background: #666;
          cursor: not-allowed;
        }

        .config-output-panel {
          min-height: 120px;
          max-height: 300px;
          overflow: auto;
          padding-top: 20px;
        }
          
        .config-output-content {
          padding: 10px;
          background: rgba(255, 255, 255, 0.25);
          border-radius: 12px;
          font-size: 12px;
          font-family: monospace;
          white-space: pre-wrap;
          word-break: break-all;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .target-circle {
          position: absolute;
          top: 80px;
          right: 120px;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: rgba(255, 100, 100, 0.6);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .dart-home {
          position: absolute;
          bottom: calc(100vh/2);
          left: calc(100vw/2);
        }

        .dart {
          width:  100px;
          height: 100px;
          z-index: 10000;
          position: absolute;
          border-radius: 30px;
          background: #4caf50;
          background: color(display-p3 0.29 0.68 0.31);
          user-select: none;

          &:active {
            box-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
          }
        }

        .dart.grabbable {
          cursor: grab;
        }

        .dart.grabbing {
          cursor: grabbing;
        }
      `}</style>
    </>
  );
}