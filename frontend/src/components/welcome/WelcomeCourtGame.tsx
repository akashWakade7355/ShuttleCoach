import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  PanResponder,
  AccessibilityInfo,
  LayoutChangeEvent,
  ViewStyle,
} from 'react-native';
import { AeroColors, BorderRadius, Typography } from '@/constants/theme';
import { BadmintonRacket } from './BadmintonRacket';
import { ShuttlecockItem } from './ShuttlecockItem';

interface Shuttlecock {
  id: number;
  x: number;
  y: number;
  speed: number;
  rotation: number;
}

interface CatchPop {
  id: number;
  x: number;
  y: number;
  opacity: number;
}

export interface WelcomeCourtGameRef {
  stopGame: () => void;
  getScore: () => number;
}

export interface WelcomeCourtGameProps {
  style?: ViewStyle;
  onScoreChange?: (score: number) => void;
  gameRef?: React.RefObject<WelcomeCourtGameRef | null>;
}

const RACKET_WIDTH = 60;
const RACKET_CATCH_RADIUS = 34; // Generous catch zone for comfortable one-thumb play

export function WelcomeCourtGame({
  style,
  onScoreChange,
  gameRef,
}: WelcomeCourtGameProps) {
  // Dimensions of the stylized court
  const [courtLayout, setCourtLayout] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Game state
  const [gameState, setGameState] = useState<'idle' | 'playing' | 'stopped'>('idle');
  const [score, setScore] = useState<number>(0);
  const [racketX, setRacketX] = useState<number>(150); // Initial center position
  const [isCatching, setIsCatching] = useState<boolean>(false);
  const [shuttlecocks, setShuttlecocks] = useState<Shuttlecock[]>([]);
  const [catchPops, setCatchPops] = useState<CatchPop[]>([]);
  const [reduceMotion, setReduceMotion] = useState<boolean>(false);

  // Mutable refs for high-frequency 60fps game loop
  const gameStateRef = useRef<'idle' | 'playing' | 'stopped'>('idle');
  const scoreRef = useRef<number>(0);
  const racketXRef = useRef<number>(150);
  const shuttlecocksRef = useRef<Shuttlecock[]>([]);
  const catchPopsRef = useRef<CatchPop[]>([]);
  const courtLayoutRef = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
  const animFrameId = useRef<number | null>(null);
  const spawnCounterRef = useRef<number>(0);
  const nextShuttleId = useRef<number>(1);
  const nextPopId = useRef<number>(1);
  const catchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Keep refs in sync
  useEffect(() => {
    gameStateRef.current = gameState;
  }, [gameState]);

  useEffect(() => {
    scoreRef.current = score;
    onScoreChange?.(score);
  }, [score, onScoreChange]);

  // Accessibility: Check reduced motion preference
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then((enabled) => {
      setReduceMotion(enabled);
    });

    const subscription = AccessibilityInfo.addEventListener(
      'reduceMotionChanged',
      (enabled) => setReduceMotion(enabled)
    );

    return () => {
      subscription?.remove?.();
    };
  }, []);

  // Expose stopGame to parent
  useEffect(() => {
    if (gameRef) {
      (gameRef as React.MutableRefObject<WelcomeCourtGameRef | null>).current = {
        stopGame: () => {
          gameStateRef.current = 'stopped';
          setGameState('stopped');
          if (animFrameId.current) {
            cancelAnimationFrame(animFrameId.current);
            animFrameId.current = null;
          }
        },
        getScore: () => scoreRef.current,
      };
    }
  }, [gameRef]);

  // Handle court layout measurement
  const handleCourtLayout = (e: LayoutChangeEvent) => {
    const { width, height } = e.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setCourtLayout({ width, height });
      courtLayoutRef.current = { width, height };
      if (gameStateRef.current === 'idle') {
        const initialX = width / 2;
        setRacketX(initialX);
        racketXRef.current = initialX;
      }
    }
  };

  // Clamps racket to court boundaries
  const updateRacketPosition = useCallback((x: number) => {
    const width = courtLayoutRef.current.width || 320;
    const clampedX = Math.max(RACKET_WIDTH / 2, Math.min(width - RACKET_WIDTH / 2, x));
    racketXRef.current = clampedX;
    setRacketX(clampedX);

    // Start game on first drag
    if (gameStateRef.current === 'idle') {
      gameStateRef.current = 'playing';
      setGameState('playing');
    }
  }, []);

  // One-thumb drag PanResponder covering the court
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (evt) => {
        updateRacketPosition(evt.nativeEvent.locationX);
      },
      onPanResponderMove: (evt) => {
        updateRacketPosition(evt.nativeEvent.locationX);
      },
      onPanResponderRelease: () => {
        // Player lifted thumb: racket stays in place, game continues
      },
    })
  ).current;

  // 60FPS Game Loop
  useEffect(() => {
    let isMounted = true;

    const gameLoop = () => {
      if (!isMounted) return;

      const currentState = gameStateRef.current;
      const { width, height } = courtLayoutRef.current;

      if (currentState === 'playing' && width > 0 && height > 0) {
        const racketY = height - 42;
        const currentRacketX = racketXRef.current;
        const currentScore = scoreRef.current;

        // 1. Spawning Logic
        spawnCounterRef.current += 1;
        // Spawn rate speeds up as score increases
        const spawnInterval = Math.max(38, Math.round(75 - currentScore * 1.5));
        const maxShuttles = Math.min(4, 2 + Math.floor(currentScore / 4));

        if (
          spawnCounterRef.current >= spawnInterval &&
          shuttlecocksRef.current.length < maxShuttles
        ) {
          spawnCounterRef.current = 0;
          const spawnX = Math.random() * (width - 60) + 30;
          // Speed gradually increases with score
          const baseSpeed = 2.4 + Math.min(currentScore * 0.12, 3.2);
          const rotation = (Math.random() - 0.5) * 16; // Subtle angle

          shuttlecocksRef.current.push({
            id: nextShuttleId.current++,
            x: spawnX,
            y: -28,
            speed: baseSpeed,
            rotation,
          });
        }

        // 2. Physics & Collision Handling
        const updatedShuttles: Shuttlecock[] = [];
        let catchesThisFrame = 0;

        for (const shuttle of shuttlecocksRef.current) {
          const nextY = shuttle.y + shuttle.speed;

          // Check Catch Zone (vertical threshold near racket head)
          const isNearRacketY = nextY >= racketY - 22 && nextY <= racketY + 12;
          const isWithinRacketWidth =
            Math.abs(shuttle.x - currentRacketX) <= RACKET_CATCH_RADIUS;

          if (isNearRacketY && isWithinRacketWidth) {
            // CAUGHT!
            catchesThisFrame += 1;

            // Trigger floating "+1" popup
            catchPopsRef.current.push({
              id: nextPopId.current++,
              x: shuttle.x,
              y: racketY - 24,
              opacity: 1,
            });

            // Trigger subtle racket feedback
            if (!reduceMotion) {
              setIsCatching(true);
              if (catchTimerRef.current) clearTimeout(catchTimerRef.current);
              catchTimerRef.current = setTimeout(() => {
                if (isMounted) setIsCatching(false);
              }, 180);
            }
            // Do not keep caught shuttlecock in array
          } else if (nextY <= height + 30) {
            // Keep falling
            updatedShuttles.push({
              ...shuttle,
              y: nextY,
            });
          }
          // If nextY > height + 30, shuttlecock falls off-screen harmlessly
        }

        shuttlecocksRef.current = updatedShuttles;
        setShuttlecocks([...updatedShuttles]);

        if (catchesThisFrame > 0) {
          setScore((prev) => prev + catchesThisFrame);
        }

        // 3. Update "+1" Floating Popups
        if (catchPopsRef.current.length > 0) {
          const updatedPops = catchPopsRef.current
            .map((pop) => ({
              ...pop,
              y: pop.y - 1.2,
              opacity: pop.opacity - 0.045,
            }))
            .filter((pop) => pop.opacity > 0);

          catchPopsRef.current = updatedPops;
          setCatchPops(updatedPops);
        }
      }

      if (gameStateRef.current !== 'stopped') {
        animFrameId.current = requestAnimationFrame(gameLoop);
      }
    };

    animFrameId.current = requestAnimationFrame(gameLoop);

    return () => {
      isMounted = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
      if (catchTimerRef.current) {
        clearTimeout(catchTimerRef.current);
      }
    };
  }, [reduceMotion]);

  const racketY = (courtLayout.height || 360) - 46;

  return (
    <View style={[styles.container, style]}>
      {/* ==================================================================== */}
      {/* Court Header: Telemetry Strip & Score Counter                        */}
      {/* ==================================================================== */}
      <View style={styles.telemetryBar}>
        <View style={styles.telemetryItem}>
          <View style={styles.telemetryDot} />
          <Text style={styles.telemetryLabel}>COURT WARM-UP</Text>
        </View>

        <View style={styles.scoreContainer}>
          <Text style={styles.scoreLabel}>SCORE</Text>
          <Text style={styles.scoreValue}>{score}</Text>
        </View>

        <View style={styles.speedIndicator}>
          <Text style={styles.speedLabel}>
            {score < 5 ? 'L0 PACE' : score < 12 ? 'L1 PACE' : 'PRO CADENCE'}
          </Text>
        </View>
      </View>

      {/* ==================================================================== */}
      {/* Central Interactive Stylized Badminton Court Canvas                  */}
      {/* ==================================================================== */}
      <View
        style={styles.courtCanvas}
        onLayout={handleCourtLayout}
        {...panResponder.panHandlers}>
        {/* Court Markings: Net Line across top */}
        <View style={styles.netLineContainer}>
          <View style={styles.netTape} />
          <View style={styles.netMesh} />
        </View>

        {/* Short Service Line */}
        <View style={styles.shortServiceLine} />

        {/* Centre Line (Dividing Court) */}
        <View style={styles.centreLine} />

        {/* Left & Right Singles / Doubles Tramlines */}
        <View style={styles.leftTramline} />
        <View style={styles.rightTramline} />

        {/* Long Service / Rear Court Line */}
        <View style={styles.rearServiceLine} />

        {/* Tactical Base 0 Marker Ring in Court Center */}
        <View style={styles.baseZeroRing}>
          <Text style={styles.baseZeroText}>T-BASE</Text>
        </View>

        {/* Falling Shuttlecocks */}
        {shuttlecocks.map((shuttle) => (
          <View
            key={shuttle.id}
            style={[
              styles.shuttlePositioner,
              {
                left: shuttle.x - 12,
                top: shuttle.y,
                transform: [{ rotate: `${shuttle.rotation}deg` }],
              },
            ]}>
            <ShuttlecockItem />
          </View>
        ))}

        {/* Subtle "+1" Floating Popups */}
        {catchPops.map((pop) => (
          <View
            key={pop.id}
            style={[
              styles.catchPopPositioner,
              {
                left: pop.x - 14,
                top: pop.y,
                opacity: pop.opacity,
              },
            ]}>
            <View style={styles.catchPopPill}>
              <Text style={styles.catchPopText}>+1</Text>
            </View>
          </View>
        ))}

        {/* Interactive Badminton Racket (Controlled along bottom) */}
        <View
          style={[
            styles.racketPositioner,
            {
              left: racketX - RACKET_WIDTH / 2,
              top: racketY,
            },
          ]}>
          <BadmintonRacket isCatching={isCatching} />
        </View>

        {/* Idle Interaction Hint: "Slide the racket to catch shuttlecocks" */}
        {gameState === 'idle' && (
          <View style={styles.hintContainer} pointerEvents="none">
            <View style={styles.hintPill}>
              <Text style={styles.hintArrow}>⟵</Text>
              <Text style={styles.hintText}>
                Slide the racket to catch shuttlecocks
              </Text>
              <Text style={styles.hintArrow}>⟶</Text>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },

  // Telemetry Top Strip
  telemetryBar: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: 'rgba(18, 59, 58, 0.05)',
    borderRadius: BorderRadius.full,
    marginBottom: 8,
  },
  telemetryItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  telemetryDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: AeroColors.seafoam,
    marginRight: 6,
  },
  telemetryLabel: {
    ...Typography.labelSm,
    fontSize: 9,
    color: AeroColors.deepTeal,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  scoreContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  scoreLabel: {
    ...Typography.labelSm,
    fontSize: 10,
    color: AeroColors.mutedSage,
    fontWeight: '700',
  },
  scoreValue: {
    ...Typography.headlineSm,
    fontSize: 18,
    fontWeight: '800',
    color: AeroColors.deepTeal,
    fontVariant: ['tabular-nums'],
  },
  speedIndicator: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: BorderRadius.full,
    backgroundColor: AeroColors.softTealTint,
  },
  speedLabel: {
    ...Typography.labelSm,
    fontSize: 9,
    color: AeroColors.deepTeal,
    fontWeight: '700',
  },

  // Stylized Badminton Court Canvas
  courtCanvas: {
    width: '100%',
    height: 380,
    backgroundColor: '#E8F7F3',
    borderRadius: BorderRadius.xl,
    borderWidth: 2,
    borderColor: 'rgba(135, 155, 148, 0.5)',
    position: 'relative',
    overflow: 'hidden',
    shadowColor: AeroColors.deepTeal,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },

  // Court Markings
  netLineContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 6,
    backgroundColor: AeroColors.deepTeal,
  },
  netTape: {
    width: '100%',
    height: 2,
    backgroundColor: AeroColors.pureWhite,
  },
  netMesh: {
    width: '100%',
    height: 4,
    backgroundColor: AeroColors.deepTeal,
  },
  shortServiceLine: {
    position: 'absolute',
    top: '28%',
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(135, 155, 148, 0.45)',
  },
  centreLine: {
    position: 'absolute',
    top: '28%',
    bottom: '16%',
    left: '50%',
    width: 1.5,
    marginLeft: -0.75,
    backgroundColor: 'rgba(135, 155, 148, 0.45)',
  },
  leftTramline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '9%',
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(135, 155, 148, 0.35)',
  },
  rightTramline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '9%',
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(135, 155, 148, 0.35)',
  },
  rearServiceLine: {
    position: 'absolute',
    bottom: '16%',
    left: 0,
    right: 0,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(135, 155, 148, 0.35)',
  },
  baseZeroRing: {
    position: 'absolute',
    top: '52%',
    left: '50%',
    marginLeft: -26,
    marginTop: -12,
    width: 52,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(101, 201, 184, 0.4)',
    backgroundColor: 'rgba(255, 255, 255, 0.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  baseZeroText: {
    fontSize: 8,
    fontWeight: '800',
    color: 'rgba(18, 59, 58, 0.45)',
    letterSpacing: 0.5,
  },

  // Dynamic Positioning Elements
  shuttlePositioner: {
    position: 'absolute',
    width: 24,
    height: 30,
    zIndex: 10,
  },
  racketPositioner: {
    position: 'absolute',
    width: RACKET_WIDTH,
    zIndex: 20,
  },
  catchPopPositioner: {
    position: 'absolute',
    width: 28,
    zIndex: 30,
    alignItems: 'center',
  },
  catchPopPill: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: BorderRadius.full,
    backgroundColor: AeroColors.seafoam,
    shadowColor: AeroColors.deepTeal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  catchPopText: {
    fontSize: 11,
    fontWeight: '800',
    color: AeroColors.darkSlate,
  },

  // First Interaction Hint
  hintContainer: {
    position: 'absolute',
    bottom: 74,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 25,
  },
  hintPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.92)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    borderColor: 'rgba(18, 59, 58, 0.12)',
    shadowColor: AeroColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  hintArrow: {
    fontSize: 12,
    color: AeroColors.seafoam,
    fontWeight: '800',
    marginHorizontal: 4,
  },
  hintText: {
    ...Typography.bodySm,
    fontSize: 12,
    fontWeight: '600',
    color: AeroColors.darkSlate,
  },
});
