/**
 * Example usage patterns for useFlyToTarget hook
 */

import { useRef } from 'react';
import { useFlyToTarget } from './useFlyToTarget';

// Example 1: Trigger on click
function ClickExample() {
  const itemRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { flyToTarget } = useFlyToTarget();

  const handleClick = () => {
    flyToTarget(itemRef.current, targetRef.current, {
      duration: 0.5,
      swoopAmount: -100,
      onComplete: () => {
        console.log('Item reached target!');
      }
    });
  };

  return (
    <>
      <div ref={itemRef} onClick={handleClick}>
        Click me to fly!
      </div>
      <div ref={targetRef}>Target</div>
    </>
  );
}

// Example 2: Trigger on drag release (like your Sandbox)
function DragExample() {
  const itemRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { flyToTarget } = useFlyToTarget();

  // In your Draggable.create config:
  const onDragEnd = () => {
    flyToTarget(itemRef.current, targetRef.current, {
      duration: 0.45,
      ease: 'power3.out',
      swoopAmount: -100,
      scale: true,
      scalePeak: 2.5,
    });
  };

  return (
    <>
      <div ref={itemRef}>Drag me</div>
      <div ref={targetRef}>Target</div>
    </>
  );
}

// Example 3: Hide list animation (like your handleHideToggle)
function HideListExample() {
  const listRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const { flyToTarget } = useFlyToTarget();

  const handleHide = () => {
    const listElement = listRef.current;
    if (!listElement) return;

    // Set fixed positioning before animation
    const rect = listElement.getBoundingClientRect();
    listElement.style.position = 'fixed';
    listElement.style.top = `${rect.top}px`;
    listElement.style.left = `${rect.left}px`;
    listElement.style.width = `${rect.width}px`;
    listElement.style.height = `${rect.height}px`;
    listElement.style.zIndex = '10000';

    flyToTarget(listElement, buttonRef.current, {
      duration: 0.7,
      ease: 'back.out(1.1)',
      swoopAmount: 0, // straight line
      scale: true,
      grabScale: 1.0,
      scalePeak: 1.13,
      scaleTarget: 0,
      onComplete: () => {
        // Remove from DOM or update state
        console.log('List hidden!');
      }
    });
  };

  return (
    <>
      <div ref={listRef}>List to hide</div>
      <button ref={buttonRef} onClick={handleHide}>Hide Lists</button>
    </>
  );
}

// Example 4: Trigger on hover
function HoverExample() {
  const itemRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { flyToTarget } = useFlyToTarget();

  const handleMouseEnter = () => {
    flyToTarget(itemRef.current, targetRef.current, {
      duration: 0.3,
      ease: 'power2.out',
      swoopAmount: 50,
      scale: false, // no scale animation
    });
  };

  return (
    <>
      <div ref={itemRef} onMouseEnter={handleMouseEnter}>
        Hover over me!
      </div>
      <div ref={targetRef}>Target</div>
    </>
  );
}

// Example 5: Programmatic trigger (e.g., after API call)
function ApiExample() {
  const itemRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { flyToTarget } = useFlyToTarget();

  const handleSubmit = async () => {
    // Do some API call
    await fetch('/api/submit');

    // Then animate
    flyToTarget(itemRef.current, targetRef.current, {
      duration: 0.5,
      swoopAmount: -80,
      onComplete: () => {
        console.log('Submission complete!');
      }
    });
  };

  return (
    <>
      <div ref={itemRef}>Form item</div>
      <button onClick={handleSubmit}>Submit</button>
      <div ref={targetRef}>Success indicator</div>
    </>
  );
}

// Example 6: Using querySelector for dynamic elements
function DynamicElementExample() {
  const { flyToTarget } = useFlyToTarget();

  const handleAnimate = (itemId: string, targetId: string) => {
    const itemElement = document.querySelector(`[data-id="${itemId}"]`) as HTMLElement;
    const targetElement = document.querySelector(`[data-target="${targetId}"]`) as HTMLElement;

    flyToTarget(itemElement, targetElement, {
      duration: 0.6,
      swoopAmount: -100,
      scale: true,
      onComplete: () => {
        console.log(`${itemId} reached ${targetId}`);
      }
    });
  };

  return (
    <button onClick={() => handleAnimate('item-1', 'target-1')}>
      Animate
    </button>
  );
}
