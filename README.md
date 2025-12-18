# useFlyToTarget Hook

A self-contained React hook for animating elements to "fly" from their current position to a target element with configurable curved paths, scaling, and shadows.

## Features

- **Self-contained**: All GSAP plugins and dependencies are handled internally
- **Curved paths**: Optional swoop/arc animation using bezier curves
- **Scale animations**: Configurable "lift and land" effect with scale transformations
- **Shadow effects**: Dynamic shadow blur that scales with the animation
- **Flexible triggers**: Works with clicks, drags, hovers, or any other event
- **Timeline control**: Returns GSAP timeline for advanced control
- **TypeScript support**: Full type definitions included

## Installation

No installation needed - the hook is already part of your project at:
```
/apps/scheduledesk/hooks/useFlyToTarget.ts
```

## Basic Usage

```tsx
import { useFlyToTarget } from '@/hooks/useFlyToTarget';

function MyComponent() {
  const itemRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const { flyToTarget } = useFlyToTarget();

  const handleClick = () => {
    flyToTarget(itemRef.current, targetRef.current, {
      duration: 0.5,
      swoopAmount: -100,
      onComplete: () => console.log('Animation complete!')
    });
  };

  return (
    <>
      <div ref={itemRef} onClick={handleClick}>Click me!</div>
      <div ref={targetRef}>Target</div>
    </>
  );
}
```

## Configuration Options

All configuration options are optional. Here are the defaults:

```typescript
{
  // Motion parameters
  duration: 0.45,              // Animation duration in seconds
  ease: 'power3.out',          // GSAP easing function
  swoopAmount: -100,           // Curve amount (0 = straight line, negative = swoop left/down)

  // Scale animation parameters
  scale: true,                 // Enable scale animation
  grabScale: 1.2,              // Initial scale (when grabbed/starting)
  scaleStartDelay: 0,          // Delay before scale animation starts
  scaleUpDuration: 0.2,        // Duration of scale-up phase
  scaleUpEase: 'power3.in',    // Easing for scale-up
  scalePeak: 2.5,              // Maximum scale during animation
  scalePause: 0.15,            // Pause duration at peak scale
  scaleDownDuration: 0.1,      // Duration of scale-down phase
  scaleDownEase: 'none',       // Easing for scale-down
  scaleTarget: 1.0,            // Final scale value

  // Shadow parameters
  enableShadow: true,          // Enable shadow animation
  baseShadowBlur: 4,           // Base shadow blur amount

  // Callbacks
  onComplete: () => {},        // Called when animation completes
  onStart: () => {},           // Called when animation starts
}
```

## Return Values

The hook returns an object with:

```typescript
{
  flyToTarget: (source, target, config) => Timeline | null,
  killAll: () => void,         // Kill all active animations
  kill: (timeline) => void,    // Kill a specific animation
}
```

## Usage Examples

### 1. Click Trigger

```tsx
const { flyToTarget } = useFlyToTarget();

const handleClick = () => {
  flyToTarget(itemRef.current, targetRef.current, {
    duration: 0.5,
    swoopAmount: -100,
  });
};
```

### 2. Drag Release (like Sandbox)

```tsx
const { flyToTarget } = useFlyToTarget();

Draggable.create(element, {
  type: 'x,y',
  onDragEnd: function() {
    flyToTarget(element, targetElement, {
      duration: 0.45,
      ease: 'power3.out',
      scale: true,
      scalePeak: 2.5,
    });
  },
});
```

### 3. Hide Animation (collapsing to button)

```tsx
const { flyToTarget } = useFlyToTarget();

const handleHide = () => {
  // Make element fixed position first
  const rect = listElement.getBoundingClientRect();
  gsap.set(listElement, {
    position: 'fixed',
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
    zIndex: 10000
  });

  flyToTarget(listElement, buttonElement, {
    duration: 0.7,
    ease: 'back.out(1.1)',
    swoopAmount: 0,
    scale: true,
    grabScale: 1.0,
    scalePeak: 1.13,
    scaleTarget: 0,
    onComplete: () => {
      // Remove from DOM or update state
    }
  });
};
```

### 4. No Scale, Just Motion

```tsx
flyToTarget(itemRef.current, targetRef.current, {
  duration: 0.3,
  swoopAmount: 50,
  scale: false,  // Disable scale animation
});
```

### 5. Straight Line (No Curve)

```tsx
flyToTarget(itemRef.current, targetRef.current, {
  duration: 0.4,
  swoopAmount: 0,  // Straight line motion
  scale: true,
});
```

### 6. With Dynamic Elements

```tsx
const { flyToTarget } = useFlyToTarget();

const animateById = (itemId: string, targetId: string) => {
  const item = document.querySelector(`[data-id="${itemId}"]`) as HTMLElement;
  const target = document.querySelector(`[data-id="${targetId}"]`) as HTMLElement;

  flyToTarget(item, target, {
    duration: 0.5,
    onComplete: () => console.log('Done!')
  });
};
```

### 7. Controlling the Timeline

```tsx
const { flyToTarget } = useFlyToTarget();

const timeline = flyToTarget(itemRef.current, targetRef.current, {
  duration: 0.5,
});

// Later, you can control it:
timeline?.pause();
timeline?.resume();
timeline?.reverse();
timeline?.kill();
```

## How It Works

1. **Motion**: Calculates the path from source center to target center
2. **Curve**: If `swoopAmount` is non-zero, creates a bezier curve using a perpendicular control point
3. **Scale**: Animates scale in three phases:
   - Start at `grabScale`
   - Scale up to `scalePeak` over `scaleUpDuration`
   - Pause for `scalePause`
   - Scale down to `scaleTarget` over `scaleDownDuration`
4. **Shadow**: Automatically adjusts shadow blur based on scale if `enableShadow` is true

## Tips

- **Negative swoopAmount**: Curves left/downward
- **Positive swoopAmount**: Curves right/upward
- **swoopAmount 0**: Straight line
- **scale false**: Motion only, no scale animation
- **grabScale = 1.0**: Start from natural size
- **scaleTarget = 0**: Shrink to nothing (for hide animations)
- **Fixed positioning**: For elements that need to break out of containers, set `position: fixed` before animating

## Integration with Existing Code

This hook was designed to replace manual GSAP animation code. Instead of:

```tsx
// Old way - manual GSAP
gsap.to(element, {
  x: targetX,
  y: targetY,
  duration: 0.5,
  // ... lots of configuration
});
```

Use:

```tsx
// New way - useFlyToTarget hook
flyToTarget(element, targetElement, {
  duration: 0.5,
});
```

The hook handles all the complex calculations for paths, curves, and scale animations.
