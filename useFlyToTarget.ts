import { useCallback, useRef, useEffect } from 'react';
import gsap from 'gsap';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

// Ensure plugin is registered when the module is imported
if (typeof window !== 'undefined') {
  gsap.registerPlugin(MotionPathPlugin);
}

export interface FlyToTargetConfig {
  // Motion parameters
  duration?: number;
  ease?: string;
  swoopAmount?: number;

  // Scale animation parameters
  scale?: boolean;
  grabScale?: number;
  scaleStartDelay?: number;
  scaleUpDuration?: number;
  scaleUpEase?: string;
  scalePeak?: number;
  scalePause?: number;
  scaleDownDuration?: number;
  scaleDownEase?: string;
  scaleTarget?: number;

  // Shadow parameters
  enableShadow?: boolean;
  baseShadowBlur?: number;

  // Callbacks
  onComplete?: () => void;
  onStart?: () => void;
}

const DEFAULT_CONFIG: Required<FlyToTargetConfig> = {
  duration: 0.45,
  ease: 'power3.out',
  swoopAmount: -100,
  scale: true,
  grabScale: 1.2,
  scaleStartDelay: 0,
  scaleUpDuration: 0.2,
  scaleUpEase: 'power3.in',
  scalePeak: 2.5,
  scalePause: 0.15,
  scaleDownDuration: 0.1,
  scaleDownEase: 'none',
  scaleTarget: 1.0,
  enableShadow: true,
  baseShadowBlur: 4,
  onComplete: () => {},
  onStart: () => {},
};

/**
 * Hook for animating elements to fly from their current position to a target element
 * with optional curved path and scale animations.
 *
 * @example
 * const flyToTarget = useFlyToTarget();
 *
 * // Later, trigger the animation
 * flyToTarget(dartElement, targetElement, {
 *   duration: 0.5,
 *   swoopAmount: -100,
 *   onComplete: () => console.log('Animation complete!')
 * });
 */
export function useFlyToTarget() {
  const activeAnimationsRef = useRef<gsap.core.Timeline[]>([]);

  const flyToTarget = useCallback((
    sourceElement: HTMLElement | null,
    targetElement: HTMLElement | null,
    userConfig: FlyToTargetConfig = {}
  ) => {
    if (!sourceElement || !targetElement) {
      console.warn('useFlyToTarget: source or target element is null');
      return null;
    }

    const config = { ...DEFAULT_CONFIG, ...userConfig };

    // Get current position (including any transforms)
    const sourceRect = sourceElement.getBoundingClientRect();
    const targetRect = targetElement.getBoundingClientRect();

    // Get current transform values
    const currentX = gsap.getProperty(sourceElement, 'x') as number;
    const currentY = gsap.getProperty(sourceElement, 'y') as number;

    // Calculate the target absolute position (center to center)
    const targetX = currentX + (targetRect.left + targetRect.width / 2 - sourceRect.left - sourceRect.width / 2);
    const targetY = currentY + (targetRect.top + targetRect.height / 2 - sourceRect.top - sourceRect.height / 2);

    // Call onStart callback
    config.onStart();

    // Create timeline
    const tl = gsap.timeline({
      onComplete: config.onComplete,
    });

    // Build motion animation config
    const motionConfig: gsap.TweenVars = {
      duration: config.duration,
      ease: config.ease,
    };

    if (config.swoopAmount !== 0) {
      // Calculate control point for bezier curve
      const midX = (currentX + targetX) / 2;
      const midY = (currentY + targetY) / 2;

      // Calculate perpendicular offset
      const dx = targetX - currentX;
      const dy = targetY - currentY;
      const perpX = -dy;
      const perpY = dx;
      const length = Math.sqrt(perpX * perpX + perpY * perpY);
      const normalizedPerpX = perpX / length;
      const normalizedPerpY = perpY / length;

      // Control point offset by swoopAmount
      const controlX = midX + normalizedPerpX * config.swoopAmount;
      const controlY = midY + normalizedPerpY * config.swoopAmount;

      motionConfig.motionPath = {
        path: [
          { x: currentX, y: currentY },
          { x: controlX, y: controlY },
          { x: targetX, y: targetY }
        ],
        curviness: 2,
        resolution: 6,
      };
    } else {
      motionConfig.x = targetX;
      motionConfig.y = targetY;
    }

    // Add motion animation to timeline
    tl.to(sourceElement, motionConfig, 0);

    // Add scale animation if enabled
    if (config.scale) {
      const scaleConfig: gsap.TweenVars = {
        scale: config.scalePeak,
        delay: config.scaleStartDelay,
        duration: config.scaleUpDuration,
        ease: config.scaleUpEase,
      };

      // Add shadow animation if enabled
      if (config.enableShadow) {
        const startBlur = config.baseShadowBlur * config.grabScale;
        const maxBlur = config.baseShadowBlur * config.scalePeak * 0.5;

        gsap.set(sourceElement, {
          boxShadow: `0px 2px ${startBlur}px rgba(0,0,0,0.3)`
        });

        scaleConfig.boxShadow = `0px 2px ${maxBlur}px rgba(0,0,0,0.6)`;
      }

      // Scale up
      tl.fromTo(
        sourceElement,
        { scale: config.grabScale },
        scaleConfig,
        0
      );

      // Scale down
      const scaleDownConfig: gsap.TweenVars = {
        delay: config.scalePause,
        scale: config.scaleTarget,
        duration: config.scaleDownDuration,
        ease: config.scaleDownEase,
      };

      if (config.enableShadow) {
        scaleDownConfig.boxShadow = '0px 0px 0px rgba(0,0,0,0.0)';
      }

      tl.to(
        sourceElement,
        scaleDownConfig,
        `>${config.scaleStartDelay + config.scaleUpDuration}`
      );
    } else {
      // If scale animation is disabled, still set initial scale
      gsap.set(sourceElement, { scale: config.grabScale });
    }

    // Track active animation
    activeAnimationsRef.current.push(tl);

    return tl;
  }, []);

  /**
   * Kill all active animations created by this hook
   */
  const killAll = useCallback(() => {
    activeAnimationsRef.current.forEach(tl => tl.kill());
    activeAnimationsRef.current = [];
  }, []);

  /**
   * Kill a specific animation timeline
   */
  const kill = useCallback((timeline: gsap.core.Timeline | null) => {
    if (timeline) {
      timeline.kill();
      activeAnimationsRef.current = activeAnimationsRef.current.filter(tl => tl !== timeline);
    }
  }, []);

  return {
    flyToTarget,
    killAll,
    kill,
  };
}
