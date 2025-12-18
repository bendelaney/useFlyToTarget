'use client';

import React, { useRef } from 'react';
import AppFrame from '@/components/AppFrame';
import { DragLockProvider } from '@/components/DragDrop/DragDrop';
import { PopoverProvider } from '@repo/components/Popover';
import { useFlyToTarget } from '@/hooks/useFlyToTarget';

export default function Sandbox() {
  const { flyToTarget } = useFlyToTarget();

  // Example 1: Simple Click
  const item1Ref = useRef<HTMLDivElement>(null);
  const target1Ref = useRef<HTMLDivElement>(null);

  const handleExample1 = () => {
    flyToTarget(item1Ref.current, target1Ref.current, {
      duration: 0.5,
      swoopAmount: -100,
      scale: true,
      scalePeak: 2,
    });
  };

  // Example 2: Straight line, no scale
  const item2Ref = useRef<HTMLDivElement>(null);
  const target2Ref = useRef<HTMLDivElement>(null);

  const handleExample2 = () => {
    flyToTarget(item2Ref.current, target2Ref.current, {
      duration: 0.3,
      swoopAmount: 0, // straight line
      scale: false,
    });
  };

  // Example 3: Shrink to nothing (hide animation)
  const item3Ref = useRef<HTMLDivElement>(null);
  const target3Ref = useRef<HTMLDivElement>(null);

  const handleExample3 = () => {
    flyToTarget(item3Ref.current, target3Ref.current, {
      duration: 0.7,
      ease: 'back.out(1.1)',
      swoopAmount: 50,
      scale: true,
      grabScale: 1.0,
      scalePeak: 1.2,
      scaleTarget: 0, // shrink to nothing
      onComplete: () => {
        // Reset after animation
        setTimeout(() => {
          if (item3Ref.current) {
            item3Ref.current.style.transform = 'translate(0, 0) scale(1)';
          }
        }, 500);
      }
    });
  };

  // Example 4: Curved path with bounce
  const item4Ref = useRef<HTMLDivElement>(null);
  const target4Ref = useRef<HTMLDivElement>(null);

  const handleExample4 = () => {
    flyToTarget(item4Ref.current, target4Ref.current, {
      duration: 0.8,
      ease: 'bounce.out',
      swoopAmount: 150,
      scale: true,
      scalePeak: 2.5,
    });
  };

  // Example 5: Multiple items to same target
  const item5aRef = useRef<HTMLDivElement>(null);
  const item5bRef = useRef<HTMLDivElement>(null);
  const item5cRef = useRef<HTMLDivElement>(null);
  const target5Ref = useRef<HTMLDivElement>(null);

  const handleExample5 = () => {
    // Stagger the animations
    flyToTarget(item5aRef.current, target5Ref.current, {
      duration: 0.5,
      swoopAmount: -80,
    });

    setTimeout(() => {
      flyToTarget(item5bRef.current, target5Ref.current, {
        duration: 0.5,
        swoopAmount: -80,
      });
    }, 150);

    setTimeout(() => {
      flyToTarget(item5cRef.current, target5Ref.current, {
        duration: 0.5,
        swoopAmount: -80,
        onComplete: () => {
          // Reset all after last one completes
          setTimeout(() => {
            [item5aRef, item5bRef, item5cRef].forEach(ref => {
              if (ref.current) {
                ref.current.style.transform = 'translate(0, 0) scale(1)';
              }
            });
          }, 500);
        }
      });
    }, 300);
  };

  return (
    <AppFrame sidebarContent="">
      <DragLockProvider>
        <PopoverProvider scrollContainerRef={{ current: null }}>
          <div className="sandbox-container">

            <div className="examples-grid">

              {/* Example 1: Basic Click */}
              <div className="example-card">
                <h3 className="example-title">1. Basic Click Animation</h3>
                <p className="example-description">Click the box to see it fly to the target with scale</p>
                <div className="example-stage">
                  <div
                    ref={item1Ref}
                    className="item blue"
                    onClick={handleExample1}
                  >
                    Click me
                  </div>
                  <div ref={target1Ref} className="target">Target</div>
                </div>
              </div>

              {/* Example 2: Straight Line */}
              <div className="example-card">
                <h3 className="example-title">2. Straight Line (No Curve)</h3>
                <p className="example-description">Fast straight-line motion without scale animation</p>
                <div className="example-stage">
                  <div
                    ref={item2Ref}
                    className="item green"
                    onClick={handleExample2}
                  >
                    Click me
                  </div>
                  <div ref={target2Ref} className="target">Target</div>
                </div>
              </div>

              {/* Example 3: Shrink to Nothing */}
              <div className="example-card">
                <h3 className="example-title">3. Hide Animation</h3>
                <p className="example-description">Shrinks to nothing at the target (like hiding a list)</p>
                <div className="example-stage">
                  <div
                    ref={item3Ref}
                    className="item red"
                    onClick={handleExample3}
                  >
                    Hide me
                  </div>
                  <div ref={target3Ref} className="target small">Button</div>
                </div>
              </div>

              {/* Example 4: Bouncy Curve */}
              <div className="example-card">
                <h3 className="example-title">4. Bouncy Curved Path</h3>
                <p className="example-description">Large curve with bounce easing</p>
                <div className="example-stage">
                  <div
                    ref={item4Ref}
                    className="item purple"
                    onClick={handleExample4}
                  >
                    Bounce!
                  </div>
                  <div ref={target4Ref} className="target">Target</div>
                </div>
              </div>

              {/* Example 5: Multiple Items */}
              <div className="example-card full-width">
                <h3 className="example-title">5. Multiple Items (Staggered)</h3>
                <p className="example-description">Three items flying to the same target with staggered timing</p>
                <div className="example-stage wide">
                  <div className="items-group">
                    <div ref={item5aRef} className="item small orange">1</div>
                    <div ref={item5bRef} className="item small orange">2</div>
                    <div ref={item5cRef} className="item small orange">3</div>
                  </div>
                  <div ref={target5Ref} className="target">Collect</div>
                </div>
                <button className="trigger-button" onClick={handleExample5}>
                  Trigger All
                </button>
              </div>

            </div>

            <div className="info-panel">
              <h2>useFlyToTarget Hook Examples</h2>
              <p>These examples demonstrate different ways to use the <code>useFlyToTarget</code> hook.</p>
              <ul>
                <li>Click any colored box to trigger its animation</li>
                <li>Each example shows different configuration options</li>
                <li>The hook handles all GSAP animation logic internally</li>
              </ul>
            </div>

          </div>

          <style jsx>{`
            .sandbox-container {
              padding: 40px;
              min-height: 100vh;
            }

            .examples-grid {
              display: grid;
              grid-template-columns: repeat(2, 1fr);
              gap: 30px;
              margin-bottom: 40px;
            }

            .example-card {
              background: white;
              border-radius: 12px;
              padding: 24px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .example-card.full-width {
              grid-column: 1 / -1;
            }

            .example-title {
              margin: 0 0 8px 0;
              font-size: 18px;
              font-weight: 600;
              color: #333;
            }

            .example-description {
              margin: 0 0 20px 0;
              font-size: 14px;
              color: #666;
            }

            .example-stage {
              position: relative;
              background: #f5f5f5;
              border-radius: 8px;
              padding: 40px;
              min-height: 200px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }

            .example-stage.wide {
              min-height: 150px;
            }

            .items-group {
              display: flex;
              gap: 16px;
            }

            .item {
              padding: 16px 24px;
              border-radius: 8px;
              color: white;
              font-weight: 600;
              cursor: pointer;
              user-select: none;
              transition: transform 0.2s;
              box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            }

            .item:hover {
              transform: scale(1.05);
            }

            .item:active {
              transform: scale(0.95);
            }

            .item.small {
              padding: 12px 16px;
              font-size: 14px;
            }

            .item.blue {
              background: #4a90e2;
            }

            .item.green {
              background: #4caf50;
            }

            .item.red {
              background: #e74c3c;
            }

            .item.purple {
              background: #9b59b6;
            }

            .item.orange {
              background: #f39c12;
            }

            .target {
              padding: 12px 20px;
              border-radius: 8px;
              background: rgba(0, 0, 0, 0.1);
              border: 2px dashed rgba(0, 0, 0, 0.3);
              color: #666;
              font-weight: 600;
              font-size: 14px;
            }

            .target.small {
              padding: 8px 16px;
              font-size: 12px;
            }

            .trigger-button {
              margin-top: 16px;
              padding: 12px 24px;
              border-radius: 8px;
              border: none;
              background: #333;
              color: white;
              font-weight: 600;
              cursor: pointer;
              transition: background 0.2s;
            }

            .trigger-button:hover {
              background: #555;
            }

            .info-panel {
              background: white;
              border-radius: 12px;
              padding: 32px;
              box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            }

            .info-panel h2 {
              margin: 0 0 16px 0;
              font-size: 24px;
              color: #333;
            }

            .info-panel p {
              margin: 0 0 16px 0;
              color: #666;
              line-height: 1.6;
            }

            .info-panel code {
              background: #f5f5f5;
              padding: 2px 6px;
              border-radius: 4px;
              font-family: monospace;
              font-size: 14px;
            }

            .info-panel ul {
              margin: 0;
              padding-left: 24px;
              color: #666;
            }

            .info-panel li {
              margin-bottom: 8px;
              line-height: 1.6;
            }
          `}</style>
        </PopoverProvider>
      </DragLockProvider>
    </AppFrame>
  );
}
