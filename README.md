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

1. Copy `useFlyToTarget.ts` to your project's hooks directory
2. Ensure you have the required dependencies:

```bash
npm install gsap react
# or
yarn add gsap react
# or
pnpm add gsap react
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

### 2. Drag Release (with GSAP Draggable)

```tsx
import { Draggable } from 'gsap/Draggable';

const { flyToTarget } = useFlyToTarget();

useEffect(() => {
  const draggable = Draggable.create(element, {
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

  return () => draggable[0].kill();
}, []);
```

### 3. Hide Animation (collapsing to button)

```tsx
const { flyToTarget } = useFlyToTarget();

const handleHide = () => {
  // Make element fixed position first to break out of container
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
    scaleTarget: 0,  // Shrink to nothing
    onComplete: () => {
      // Remove from DOM or update state
      listElement.remove();
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

### 8. Multiple Items to Same Target (Staggered)

```tsx
const { flyToTarget } = useFlyToTarget();

const handleCollectAll = () => {
  items.forEach((itemRef, index) => {
    setTimeout(() => {
      flyToTarget(itemRef.current, collectorRef.current, {
        duration: 0.5,
        swoopAmount: -80,
        onComplete: index === items.length - 1
          ? () => console.log('All items collected!')
          : undefined
      });
    }, index * 150); // Stagger by 150ms
  });
};
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

## Animation Path Details

The hook calculates motion paths intelligently:

- **Center-to-center**: Elements fly from their center to the target's center
- **Transform-aware**: Works with existing GSAP transforms (x, y, rotation, scale)
- **Curved paths**: Uses GSAP MotionPathPlugin for smooth bezier curves
- **Perpendicular control points**: Curve control points are calculated perpendicular to the motion path

## Tips & Tricks

### Swoop Direction
- **Negative swoopAmount**: Curves left/downward (e.g., `-100`)
- **Positive swoopAmount**: Curves right/upward (e.g., `100`)
- **swoopAmount = 0**: Straight line, no curve

### Scale Behavior
- **scale = false**: Motion only, no scale animation
- **grabScale = 1.0**: Start from natural size
- **scaleTarget = 0**: Shrink to nothing (perfect for hide animations)
- **scalePeak > grabScale**: Creates a "lift" effect

### Fixed Positioning
For elements that need to break out of containers (like modals, lists, etc.):

```tsx
const rect = element.getBoundingClientRect();
gsap.set(element, {
  position: 'fixed',
  top: rect.top,
  left: rect.left,
  width: rect.width,
  height: rect.height,
  zIndex: 10000
});
```

### Easing Options
Common GSAP easing functions:
- `power1.out`, `power2.out`, `power3.out`, `power4.out` - Smooth deceleration
- `back.out(1.1)` - Overshoots slightly then settles
- `elastic.out` - Bouncy spring effect
- `bounce.out` - Bounces at the end
- `expo.out` - Exponential deceleration
- `none` - Linear, no easing

## Interactive Examples

This repository includes two interactive demos:

1. **Sandbox-demo.tsx** - Five different usage examples:
   - Basic click animation
   - Straight line motion
   - Hide animation (shrink to nothing)
   - Bouncy curved path
   - Multiple items with stagger

2. **Sandbox-configurator.tsx** - Interactive parameter tweaker:
   - Drag & drop testing
   - Real-time parameter sliders
   - Live JSON config output
   - Perfect for fine-tuning your settings

## TypeScript Support

The hook is written in TypeScript and exports the `FlyToTargetConfig` interface:

```typescript
import { FlyToTargetConfig, useFlyToTarget } from './useFlyToTarget';

const config: FlyToTargetConfig = {
  duration: 0.5,
  swoopAmount: -100,
  scale: true,
};

const { flyToTarget } = useFlyToTarget();
flyToTarget(sourceEl, targetEl, config);
```

## Browser Support

Works in all modern browsers that support:
- ES6+
- GSAP 3.x
- React 18+

## Performance Considerations

- Animations use GSAP's optimized transform engine
- Hardware-accelerated CSS transforms
- Efficiently handles multiple simultaneous animations
- Timeline management prevents memory leaks

## Common Use Cases

- **Drag and drop**: Animate items snapping to drop zones
- **Shopping carts**: Items flying into cart on click
- **Collections**: Multiple items collecting to a single point
- **Hide/minimize**: Elements collapsing into buttons or trays
- **Gamification**: Points, badges, or rewards flying to score areas
- **Data visualization**: Elements moving between states
- **Gallery interactions**: Images flying to enlarged view

## License

MIT

## Credits

Created by Ben Delaney

Built with [GSAP](https://greensock.com/gsap/) - Professional-grade animation library
