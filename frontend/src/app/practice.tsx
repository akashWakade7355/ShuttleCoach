import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';

// ============================================================================
// TYPES & DATA STRUCTURES
// ============================================================================
type DifficultyLevel = 'L0' | 'L1' | 'L2';

interface ShotOption {
  id: string;
  name: string;
  tag: string;
  desc: string;
  iconSymbol: string;
  requiresMid?: boolean;
}

const ALL_SHOTS: ShotOption[] = [
  {
    id: 'Clear',
    name: 'Clear',
    tag: 'Rear Court',
    desc: 'High, deep defensive or attacking shot to back boundary.',
    iconSymbol: '🏸',
  },
  {
    id: 'Drop Shot',
    name: 'Drop Shot',
    tag: 'Rear-to-Net',
    desc: 'Soft, steep touch dropping tight over the opponent net tape.',
    iconSymbol: '⚡',
  },
  {
    id: 'Smash',
    name: 'Smash',
    tag: 'Power Attacking',
    desc: 'High-velocity downward attack punishing loose returns.',
    iconSymbol: '💥',
  },
  {
    id: 'Net Shot',
    name: 'Net Shot',
    tag: 'Forecourt',
    desc: 'Delicate spinning control tumbling across the tape.',
    iconSymbol: '✨',
  },
  {
    id: 'Drive',
    name: 'Drive',
    tag: 'Mid Court Flat',
    desc: 'Fast, flat trajectory skimming low across the mid-court.',
    iconSymbol: '↔️',
    requiresMid: true,
  },
];

const POSITION_NAMES: Record<number, string> = {
  0: 'Centre Base',
  1: 'Front Left',
  2: 'Front Right',
  3: 'Mid Left',
  4: 'Mid Right',
  5: 'Back Left',
  6: 'Back Right',
};

const OPPONENT_TARGET_NAMES: Record<number, string> = {
  1: 'T1 (Far Back Left)',
  2: 'T2 (Far Back Right)',
  3: 'T3 (Mid Left)',
  4: 'T4 (Mid Right)',
  5: 'T5 (Net Tape Left)',
  6: 'T6 (Net Tape Right)',
};

export default function PracticeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  // ============================================================================
  // MULTI-STEP NAVIGATION STATE (1 to 6, Countdown, Active, Complete)
  // ============================================================================
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [isCountdown, setIsCountdown] = useState<boolean>(false);
  const [isActiveDrill, setIsActiveDrill] = useState<boolean>(false);
  const [isComplete, setIsComplete] = useState<boolean>(false);

  // Configuration State
  const [difficulty, setDifficulty] = useState<DifficultyLevel>('L1');
  const [playerZones, setPlayerZones] = useState<number[]>([1, 2, 5, 6]);
  const [opponentZones, setOpponentZones] = useState<number[]>([1, 2]);
  const [selectedShots, setSelectedShots] = useState<string[]>(['Clear', 'Drop Shot', 'Smash']);
  const [repetitions, setRepetitions] = useState<number>(12);
  const [activeDuration, setActiveDuration] = useState<number>(8); // seconds
  const [recoveryDuration, setRecoveryDuration] = useState<number>(4); // seconds
  const [readyCountdown, setReadyCountdown] = useState<number>(5); // seconds

  // Live Drill Execution State
  const [currentRep, setCurrentRep] = useState<number>(1);
  const [drillPhase, setDrillPhase] = useState<'MOVE' | 'RECOVERY'>('MOVE');
  const [secondsRemaining, setSecondsRemaining] = useState<number>(8);
  const [activeTargetZone, setActiveTargetZone] = useState<number>(1);
  const [activeShotName, setActiveShotName] = useState<string>('Net Shot');
  const [isPaused, setIsPaused] = useState<boolean>(false);

  // Countdown timer value
  const [countdownNum, setCountdownNum] = useState<number>(5);

  // Progress Bar Animation
  const progressAnim = useRef(new Animated.Value(1 / 6)).current;

  // Mascot emotion bounce animation
  const mascotScale = useRef(new Animated.Value(1)).current;

  // Animate progress bar when step changes
  useEffect(() => {
    Animated.spring(progressAnim, {
      toValue: currentStep / 6,
      tension: 70,
      friction: 8,
      useNativeDriver: false,
    }).start();
  }, [currentStep, progressAnim]);

  // Handle difficulty switch
  const handleSelectDifficulty = (lvl: DifficultyLevel) => {
    setDifficulty(lvl);

    // Mascot micro-bounce
    Animated.sequence([
      Animated.timing(mascotScale, { toValue: 1.15, duration: 100, useNativeDriver: true }),
      Animated.spring(mascotScale, { toValue: 1, friction: 5, tension: 80, useNativeDriver: true }),
    ]).start();

    // Auto-configure recommended zones
    if (lvl === 'L0') {
      setPlayerZones([1, 2]);
    } else if (lvl === 'L1') {
      setPlayerZones([1, 2, 5, 6]);
    } else if (lvl === 'L2') {
      setPlayerZones([1, 2, 3, 4, 5, 6]);
    }
  };

  // Toggle player zones
  const togglePlayerZone = (zoneId: number) => {
    setPlayerZones((prev) => {
      if (prev.includes(zoneId)) {
        if (prev.length <= 1) {
          Alert.alert('Keep At Least 1 Zone', 'You need at least one movement target for the drill.');
          return prev;
        }
        return prev.filter((id) => id !== zoneId);
      } else {
        return [...prev, zoneId].sort((a, b) => a - b);
      }
    });
  };

  // Toggle opponent target zones
  const toggleOpponentZone = (targetId: number) => {
    setOpponentZones((prev) => {
      if (prev.includes(targetId)) {
        if (prev.length <= 1) return prev;
        return prev.filter((id) => id !== targetId);
      } else {
        return [...prev, targetId].sort((a, b) => a - b);
      }
    });
  };

  // Toggle shot
  const toggleShot = (shotId: string) => {
    setSelectedShots((prev) => {
      if (prev.includes(shotId)) {
        if (prev.length <= 1) {
          Alert.alert('Select At Least 1 Shot', 'Please keep at least one shot type active.');
          return prev;
        }
        return prev.filter((s) => s !== shotId);
      } else {
        return [...prev, shotId];
      }
    });
  };

  // Calculated session duration
  const totalActiveSeconds = repetitions * activeDuration;
  const totalRecoverySeconds = (repetitions - 1) * recoveryDuration;
  const totalEstimatedSeconds = totalActiveSeconds + totalRecoverySeconds + readyCountdown;
  const estMinutes = Math.floor(totalEstimatedSeconds / 60);
  const estSecs = totalEstimatedSeconds % 60;
  const formattedEstTime = `${estMinutes}m ${estSecs < 10 ? '0' : ''}${estSecs}s`;

  // Navigation handlers
  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      // Launch countdown
      setCountdownNum(readyCountdown);
      setIsCountdown(true);
    }
  };

  const handleBack = () => {
    if (isCountdown || isActiveDrill || isComplete) {
      setIsCountdown(false);
      setIsActiveDrill(false);
      setIsComplete(false);
      return;
    }

    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    } else {
      router.navigate('/');
    }
  };

  // ============================================================================
  // COUNTDOWN ENGINE
  // ============================================================================
  useEffect(() => {
    let timer: any = null;
    if (isCountdown) {
      if (countdownNum > 0) {
        timer = setTimeout(() => {
          setCountdownNum((prev) => prev - 1);
        }, 1000);
      } else {
        // Countdown reached 0 -> Start Live Active Drill!
        setIsCountdown(false);
        setIsActiveDrill(true);
        setCurrentRep(1);
        setDrillPhase('MOVE');
        setSecondsRemaining(activeDuration);
        setActiveTargetZone(playerZones[0] || 1);
        setActiveShotName(selectedShots[0] || 'Clear');
      }
    }
    return () => clearTimeout(timer);
  }, [isCountdown, countdownNum, activeDuration, playerZones, selectedShots]);

  // ============================================================================
  // ACTIVE DRILL ENGINE (MOVE <-> RECOVERY LOOP)
  // ============================================================================
  useEffect(() => {
    let interval: any = null;
    if (isActiveDrill && !isPaused) {
      interval = setInterval(() => {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Switch phase
            if (drillPhase === 'MOVE') {
              if (currentRep >= repetitions) {
                // Workout Completed!
                setIsActiveDrill(false);
                setIsComplete(true);
                return 0;
              }
              // Switch to RECOVERY
              setDrillPhase('RECOVERY');
              return recoveryDuration;
            } else {
              // Switch to NEXT MOVE
              setDrillPhase('MOVE');
              setCurrentRep((r) => r + 1);

              // Randomize or cycle next zone and shot
              const nextZoneIndex = Math.floor(Math.random() * playerZones.length);
              const nextShotIndex = Math.floor(Math.random() * selectedShots.length);
              setActiveTargetZone(playerZones[nextZoneIndex] || 1);
              setActiveShotName(selectedShots[nextShotIndex] || 'Clear');

              return activeDuration;
            }
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActiveDrill, isPaused, drillPhase, currentRep, repetitions, activeDuration, recoveryDuration, playerZones, selectedShots]);

  // ============================================================================
  // 1. FULLSCREEN COUNTDOWN SCREEN
  // ============================================================================
  if (isCountdown) {
    return (
      <View style={styles.countdownContainer}>
        {/* Top Status */}
        <SafeAreaView edges={['top']} style={styles.countdownTopBar}>
          <View style={styles.countdownStatusRow}>
            <View style={styles.countdownPulseDot} />
            <Text style={styles.countdownStatusText}>COACH CALIBRATING</Text>
          </View>
          <TouchableOpacity
            onPress={() => setIsCountdown(false)}
            style={styles.cancelBtn}>
            <Text style={styles.cancelBtnText}>Cancel</Text>
          </TouchableOpacity>
        </SafeAreaView>

        {/* Giant Number & Concentric Rings */}
        <View style={styles.countdownCenter}>
          <View style={styles.radarRingOuter} />
          <View style={styles.radarRingMid} />

          <View style={styles.countdownCircle}>
            <Text style={styles.countdownNumber}>{countdownNum > 0 ? countdownNum : 'GO!'}</Text>
          </View>

          <Text style={styles.countdownHeading}>Step into base position (0)</Text>
          <Text style={styles.countdownSub}>Racket in ready position. Listen for audio cue.</Text>
        </View>

        {/* Bottom Guidance */}
        <SafeAreaView edges={['bottom']} style={styles.countdownBottom}>
          <View style={styles.guidanceCard}>
            <View style={styles.guidanceBox}>
              <Text style={styles.guidanceLabel}>FIRST ZONE</Text>
              <Text style={styles.guidanceValue}>
                {playerZones[0]} ({POSITION_NAMES[playerZones[0]] || 'Front Left'})
              </Text>
            </View>
            <View style={styles.guidanceDivider} />
            <View style={styles.guidanceBox}>
              <Text style={styles.guidanceLabel}>FIRST SHOT</Text>
              <Text style={[styles.guidanceValue, { color: '#34D399' }]}>
                {selectedShots[0] || 'Clear'}
              </Text>
            </View>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  // ============================================================================
  // 2. LIVE ACTIVE DRILL SCREEN
  // ============================================================================
  if (isActiveDrill) {
    const isMove = drillPhase === 'MOVE';

    return (
      <View style={styles.activeContainer}>
        {/* Top Active Bar */}
        <SafeAreaView edges={['top']} style={styles.activeTopBar}>
          <View style={styles.activeTopLeft}>
            <View style={[styles.activeLiveDot, isMove ? styles.dotGreen : styles.dotAmber]} />
            <Text style={styles.activeLiveLabel}>AUDIO-GUIDED PRACTICE</Text>
          </View>

          <View style={styles.activeTopRight}>
            <View style={styles.repBadge}>
              <Text style={styles.repBadgeText}>
                Rep <Text style={{ color: '#D4FF00' }}>{currentRep}</Text>/{repetitions}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => setIsPaused(!isPaused)}
              style={styles.controlIconBtn}>
              <Text style={styles.controlIconText}>{isPaused ? '▶' : '⏸'}</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                Alert.alert('Exit Practice', 'Are you sure you want to stop the current drill?', [
                  { text: 'Cancel', style: 'cancel' },
                  { text: 'Stop Drill', style: 'destructive', onPress: () => setIsActiveDrill(false) },
                ]);
              }}
              style={[styles.controlIconBtn, styles.stopBtn]}>
              <Text style={[styles.controlIconText, { color: '#F87171' }]}>⏹</Text>
            </TouchableOpacity>
          </View>
        </SafeAreaView>

        {/* Central Instruction & Phase Badge */}
        <View style={styles.activeCenterInfo}>
          <View style={[styles.phasePill, isMove ? styles.phasePillMove : styles.phasePillRecovery]}>
            <Text style={[styles.phasePillText, isMove ? styles.phaseTextMove : styles.phaseTextRecovery]}>
              {isMove ? 'MOVE PHASE' : 'RECOVERY TO BASE (0)'}
            </Text>
          </View>

          <Text style={styles.activeHeading}>
            {isMove ? `Lunge to ${POSITION_NAMES[activeTargetZone]}` : 'Return to Base 0'}
          </Text>

          {/* Simulated Audio Callout Strip */}
          <View style={styles.audioCueStrip}>
            <Text style={styles.audioSpeakerIcon}>🔊</Text>
            <Text style={styles.audioCueText}>
              {isMove ? `"${POSITION_NAMES[activeTargetZone]} • ${activeShotName}!"` : '"Base 0 • Recover & Breathe"'}
            </Text>
          </View>
        </View>

        {/* Circular Countdown Ring */}
        <View style={styles.activeTimerCircle}>
          <Text style={styles.activeTimerDigits}>{secondsRemaining}</Text>
          <Text style={styles.activeTimerUnit}>SECONDS</Text>
        </View>

        {/* Mini Tactical Court Visualizer */}
        <View style={styles.activeCourtCard}>
          <View style={styles.courtHeaderRow}>
            <Text style={styles.courtHeaderTitle}>Real-time Court Target</Text>
            <Text style={styles.courtHeaderSub}>
              {isMove ? `Target: Zone ${activeTargetZone}` : 'Holding Base 0'}
            </Text>
          </View>

          <View style={styles.miniCourtGrid}>
            {[1, 2, 3, 4, 5, 6].map((z) => {
              const isTarget = isMove && activeTargetZone === z;
              return (
                <View
                  key={z}
                  style={[
                    styles.miniZone,
                    isTarget && styles.miniZoneTarget,
                  ]}>
                  <Text style={[styles.miniZoneText, isTarget && styles.miniZoneTextTarget]}>
                    {z}
                  </Text>
                </View>
              );
            })}

            {/* Base Station 0 */}
            <View style={[styles.miniBaseStation, !isMove && styles.miniBaseStationActive]}>
              <Text style={styles.miniBaseText}>0</Text>
            </View>
          </View>
        </View>

        {/* Bottom Metadata Bar */}
        <SafeAreaView edges={['bottom']} style={styles.activeBottomBar}>
          <Text style={styles.activeMetaText}>
            Target: <Text style={{ color: '#38BDF8', fontWeight: '800' }}>T{opponentZones[0] || 1}</Text>
          </Text>
          <Text style={styles.activeMetaText}>
            Shot: <Text style={{ color: '#D4FF00', fontWeight: '800' }}>{activeShotName}</Text>
          </Text>
        </SafeAreaView>
      </View>
    );
  }

  // ============================================================================
  // 3. COMPLETION SCREEN
  // ============================================================================
  if (isComplete) {
    return (
      <View style={styles.completeContainer}>
        <SafeAreaView edges={['top', 'bottom']} style={styles.completeContent}>
          <Text style={styles.completeTrophy}>🏆</Text>
          <Text style={styles.completeTitle}>Workout Completed!</Text>
          <Text style={styles.completeSubtitle}>
            Brilliant footwork! You completed all {repetitions} shadow drill repetitions.
          </Text>

          <View style={styles.completeStatsCard}>
            <View style={styles.completeStatRow}>
              <Text style={styles.completeStatLabel}>Total Volume</Text>
              <Text style={styles.completeStatValue}>{repetitions} Reps</Text>
            </View>
            <View style={styles.completeStatRow}>
              <Text style={styles.completeStatLabel}>Estimated Time</Text>
              <Text style={styles.completeStatValue}>{formattedEstTime}</Text>
            </View>
            <View style={styles.completeStatRow}>
              <Text style={styles.completeStatLabel}>Difficulty Tier</Text>
              <Text style={[styles.completeStatValue, { color: '#7C3AED' }]}>
                {difficulty === 'L0' ? 'L0 Beginner' : difficulty === 'L1' ? 'L1 Intermediate' : 'L2 Advanced'}
              </Text>
            </View>
            <View style={styles.completeStatRow}>
              <Text style={styles.completeStatLabel}>Active XP Earned</Text>
              <Text style={[styles.completeStatValue, { color: '#10B981' }]}>+180 XP</Text>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.navigate('/')}
            style={styles.finishDashboardBtn}>
            <Text style={styles.finishDashboardBtnText}>Return to Dashboard</Text>
          </TouchableOpacity>
        </SafeAreaView>
      </View>
    );
  }

  // ============================================================================
  // 4. MAIN MULTI-STEP SETUP FLOW (STEPS 1 TO 6)
  // ============================================================================
  const STEP_TITLES: Record<number, string> = {
    1: 'Practice Setup',
    2: 'Movement Zones',
    3: 'Opponent Targets',
    4: 'Shot Selection',
    5: 'Training Intensity',
    6: 'Review & Ready',
  };

  return (
    <SafeAreaView style={styles.safeArea} edges={['top']}>
      {/* ==================================================================== */}
      {/* Top Navigation Bar & Progress Bar                                    */}
      {/* ==================================================================== */}
      <View style={styles.topNav}>
        <View style={styles.topNavLeft}>
          <TouchableOpacity
            onPress={handleBack}
            activeOpacity={0.7}
            style={styles.backCircleBtn}>
            <Text style={styles.backChevron}>‹</Text>
          </TouchableOpacity>

          <View style={styles.stepBadgeCol}>
            <View style={styles.stepBadgePill}>
              <Text style={styles.stepBadgeText}>STEP {currentStep} OF 6</Text>
            </View>
            <Text style={styles.stepBreadcrumb}>{STEP_TITLES[currentStep]}</Text>
          </View>
        </View>

        <View style={styles.coachLiveRow}>
          <View style={styles.coachLiveDot} />
          <Text style={styles.coachLiveText}>Shadow Coach</Text>
        </View>
      </View>

      {/* Visual Step Progress Bar */}
      <View style={styles.progressBarTrack}>
        <Animated.View
          style={[
            styles.progressBarFill,
            {
              width: progressAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['0%', '100%'],
              }),
            },
          ]}
        />
      </View>

      {/* ==================================================================== */}
      {/* Scrollable Step Content Container                                    */}
      {/* ==================================================================== */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* ================================================================== */}
        {/* STEP 1: DIFFICULTY LEVEL                                           */}
        {/* ================================================================== */}
        {currentStep === 1 && (
          <View style={styles.stepScreen}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>
                How challenging do you want your practice to be?
              </Text>
              <Text style={styles.stepSubtitle}>
                Choose a level that matches your current training ability.
              </Text>
            </View>

            {/* Expressive Mascot Visual Container */}
            <View style={styles.mascotCard}>
              <View style={styles.mascotInfo}>
                <View style={styles.mascotBadgePill}>
                  <Text style={styles.mascotBadgeText}>
                    {difficulty === 'L0' ? 'L0 • Beginner' : difficulty === 'L1' ? 'L1 • Intermediate' : 'L2 • Advanced'}
                  </Text>
                </View>
                <Text style={styles.mascotHeadline}>
                  {difficulty === 'L0'
                    ? 'Relaxed Rhythm'
                    : difficulty === 'L1'
                    ? 'Focused Agility & Timing'
                    : 'Explosive Match Pace'}
                </Text>
                <Text style={styles.mascotDesc}>
                  {difficulty === 'L0'
                    ? 'Single side-to-side transitions with generous recovery.'
                    : difficulty === 'L1'
                    ? 'Front and rear court transitions with recovery cadence.'
                    : 'Unpredictable 6-corner agility drill at pro match tempo.'}
                </Text>
              </View>

              <Animated.View
                style={[
                  styles.mascotAvatarCircle,
                  { transform: [{ scale: mascotScale }] },
                ]}>
                <View style={styles.mascotHeadband}>
                  <View style={styles.mascotHeadbandGem} />
                </View>
                <View style={styles.mascotEyesRow}>
                  <View style={styles.mascotEye} />
                  <View style={styles.mascotEye} />
                </View>
                <View style={styles.mascotCheeksRow}>
                  <View style={styles.mascotCheek} />
                  <View style={styles.mascotCheek} />
                </View>
                <Text style={styles.mascotMouth}>
                  {difficulty === 'L0' ? '‿' : difficulty === 'L1' ? '◡' : '○'}
                </Text>
              </Animated.View>
            </View>

            {/* Difficulty Cards */}
            <View style={styles.diffOptionsList}>
              {/* L0 Beginner */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleSelectDifficulty('L0')}
                style={[styles.diffCard, difficulty === 'L0' && styles.diffCardActive]}>
                <View style={styles.diffCardLeft}>
                  <View style={[styles.diffLevelBadge, styles.badgeL0]}>
                    <Text style={styles.diffLevelNum}>L0</Text>
                    <Text style={styles.diffLevelSub}>BEGIN</Text>
                  </View>
                  <View style={styles.diffTextCol}>
                    <View style={styles.diffTitleRow}>
                      <Text style={styles.diffTitle}>Easy</Text>
                      <View style={[styles.diffPill, styles.pillGreen]}>
                        <Text style={styles.diffPillTextGreen}>Relaxed Rhythm</Text>
                      </View>
                    </View>
                    <Text style={styles.diffDescText}>
                      Single side-to-side pattern (Front, Mid, or Rear pairs).
                    </Text>
                  </View>
                </View>
                <View style={[styles.radioCircle, difficulty === 'L0' && styles.radioCircleActive]}>
                  {difficulty === 'L0' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>

              {/* L1 Intermediate */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleSelectDifficulty('L1')}
                style={[styles.diffCard, difficulty === 'L1' && styles.diffCardActive]}>
                <View style={styles.diffCardLeft}>
                  <View style={[styles.diffLevelBadge, styles.badgeL1]}>
                    <Text style={styles.diffLevelNum}>L1</Text>
                    <Text style={styles.diffLevelSub}>INTER</Text>
                  </View>
                  <View style={styles.diffTextCol}>
                    <View style={styles.diffTitleRow}>
                      <Text style={styles.diffTitle}>Medium</Text>
                      <View style={[styles.diffPill, styles.pillPurple]}>
                        <Text style={styles.diffPillTextPurple}>4 Corners</Text>
                      </View>
                    </View>
                    <Text style={styles.diffDescText}>
                      Front & Rear movement zones (Positions 1, 2, 5, 6).
                    </Text>
                  </View>
                </View>
                <View style={[styles.radioCircle, difficulty === 'L1' && styles.radioCircleActive]}>
                  {difficulty === 'L1' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>

              {/* L2 Advanced */}
              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => handleSelectDifficulty('L2')}
                style={[styles.diffCard, difficulty === 'L2' && styles.diffCardActive]}>
                <View style={styles.diffCardLeft}>
                  <View style={[styles.diffLevelBadge, styles.badgeL2]}>
                    <Text style={styles.diffLevelNum}>L2</Text>
                    <Text style={styles.diffLevelSub}>PRO</Text>
                  </View>
                  <View style={styles.diffTextCol}>
                    <View style={styles.diffTitleRow}>
                      <Text style={styles.diffTitle}>Hard</Text>
                      <View style={[styles.diffPill, styles.pillRose]}>
                        <Text style={styles.diffPillTextRose}>Full 6 Zones</Text>
                      </View>
                    </View>
                    <Text style={styles.diffDescText}>
                      Full multi-directional court agility, including mid-court drives.
                    </Text>
                  </View>
                </View>
                <View style={[styles.radioCircle, difficulty === 'L2' && styles.radioCircleActive]}>
                  {difficulty === 'L2' && <Text style={styles.radioCheck}>✓</Text>}
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ================================================================== */}
        {/* STEP 2: PLAYER MOVEMENT ZONES                                      */}
        {/* ================================================================== */}
        {currentStep === 2 && (
          <View style={styles.stepScreen}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Where do you want to move?</Text>
              <Text style={styles.stepSubtitle}>
                Select movement zones. You will always return to centre (0) after every shot.
              </Text>
            </View>

            {/* Rule Banner */}
            <View style={styles.ruleBanner}>
              <View style={styles.ruleBadge}>
                <Text style={styles.ruleBadgeText}>{difficulty}</Text>
              </View>
              <Text style={styles.ruleMessage}>
                {difficulty === 'L0'
                  ? 'L0 Rule: Side-to-side practice (2 positions active).'
                  : difficulty === 'L1'
                  ? 'L1 Rule: 4-Corner play (Positions 1, 2, 5, 6 active).'
                  : 'L2 Rule: Full court agility (all 6 positions active).'}
              </Text>
              <TouchableOpacity
                onPress={() => setPlayerZones([1, 2, 3, 4, 5, 6])}
                style={styles.ruleAction}>
                <Text style={styles.ruleActionText}>All 6</Text>
              </TouchableOpacity>
            </View>

            {/* 3D Perspective Court Visualizer */}
            <View style={styles.courtCardContainer}>
              <View style={styles.courtBoard}>
                {/* Net Divider */}
                <View style={styles.courtNet}>
                  <View style={styles.courtNetBar} />
                  <Text style={styles.courtNetLabel}>BWF NET</Text>
                </View>

                {/* Opponent Half (Visual Context) */}
                <View style={styles.opponentHalfContext}>
                  <Text style={styles.opponentHalfLabel}>Opponent Half</Text>
                </View>

                {/* Player Half Grid (6 Zones + Base 0) */}
                <View style={styles.playerHalfGrid}>
                  {[1, 2, 3, 4, 5, 6].map((zoneId) => {
                    const isSelected = playerZones.includes(zoneId);
                    return (
                      <TouchableOpacity
                        key={zoneId}
                        activeOpacity={0.8}
                        onPress={() => togglePlayerZone(zoneId)}
                        style={[
                          styles.courtZoneTile,
                          isSelected && styles.courtZoneTileSelected,
                        ]}>
                        <View style={[styles.zoneNumberBadge, isSelected && styles.zoneNumberBadgeSelected]}>
                          <Text style={styles.zoneNumberText}>{zoneId}</Text>
                        </View>
                        <Text style={styles.zoneTileName}>
                          {POSITION_NAMES[zoneId].replace('Centre', 'Mid')}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}

                  {/* Permanent Centre 0 Base Station */}
                  <View style={styles.baseStationOverlay} pointerEvents="none">
                    <View style={styles.baseStationPill}>
                      <Text style={styles.baseStationNum}>0</Text>
                    </View>
                    <Text style={styles.baseStationTag}>Base</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Dynamic Active Flow Tags */}
            <View style={styles.flowSummaryBox}>
              <Text style={styles.flowSummaryHeader}>Active Movement Drill Flow:</Text>
              <View style={styles.flowTagsRow}>
                {playerZones.map((z) => (
                  <View key={z} style={styles.flowPill}>
                    <Text style={styles.flowPillText}>
                      Zone {z} → Base 0
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* ================================================================== */}
        {/* STEP 3: OPPONENT TARGET ZONES                                      */}
        {/* ================================================================== */}
        {currentStep === 3 && (
          <View style={styles.stepScreen}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Where is your opponent positioned?</Text>
              <Text style={styles.stepSubtitle}>
                Choose target zones on the opponent's court. Stored independently from your movement.
              </Text>
            </View>

            {/* Banner */}
            <View style={styles.ruleBannerSky}>
              <View style={styles.ruleBadgeSky}>
                <Text style={styles.ruleBadgeText}>VS</Text>
              </View>
              <Text style={styles.ruleMessageSky}>
                Opponent Targets (Sky Blue) are distinct from your movement zones.
              </Text>
              <TouchableOpacity
                onPress={() => setOpponentZones([1, 2, 3, 4, 5, 6])}
                style={styles.ruleAction}>
                <Text style={styles.ruleActionSkyText}>Select All</Text>
              </TouchableOpacity>
            </View>

            {/* Opponent Court Board */}
            <View style={styles.courtCardContainer}>
              <View style={styles.courtBoard}>
                {/* Net Divider */}
                <View style={styles.courtNet}>
                  <View style={styles.courtNetBar} />
                  <Text style={styles.courtNetLabel}>BWF NET</Text>
                </View>

                {/* Opponent Half (Active Selection) */}
                <View style={styles.opponentInteractiveGrid}>
                  {[1, 2, 3, 4, 5, 6].map((tId) => {
                    const isSelected = opponentZones.includes(tId);
                    return (
                      <TouchableOpacity
                        key={tId}
                        activeOpacity={0.8}
                        onPress={() => toggleOpponentZone(tId)}
                        style={[
                          styles.opponentTargetTile,
                          isSelected && styles.opponentTargetTileSelected,
                        ]}>
                        <View style={[styles.targetNumberBadge, isSelected && styles.targetBadgeSelected]}>
                          <Text style={styles.targetNumberText}>T{tId}</Text>
                        </View>
                        <Text style={styles.targetTileName}>
                          {tId <= 2 ? 'Far Back' : tId <= 4 ? 'Mid Court' : 'Net Tape'}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Player Base Context (Bottom) */}
                <View style={styles.playerHalfContext}>
                  <Text style={styles.playerHalfContextLabel}>Your Player Base</Text>
                  <Text style={styles.playerHalfContextSub}>
                    {playerZones.length} movement zones active
                  </Text>
                </View>
              </View>
            </View>

            {/* Target Summary Chips */}
            <View style={styles.flowSummaryBox}>
              <Text style={styles.flowSummaryHeader}>Opponent Target Scenarios:</Text>
              <View style={styles.flowTagsRow}>
                {opponentZones.map((t) => (
                  <View key={t} style={styles.targetPill}>
                    <Text style={styles.targetPillText}>{OPPONENT_TARGET_NAMES[t]}</Text>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* ================================================================== */}
        {/* STEP 4: SHOT SELECTION                                             */}
        {/* ================================================================== */}
        {currentStep === 4 && (
          <View style={styles.stepScreen}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Choose your shots</Text>
              <Text style={styles.stepSubtitle}>
                Select supported shot types for your chosen court zones.
              </Text>
            </View>

            {/* Validation Banner */}
            <View style={styles.validationBanner}>
              <Text style={styles.validationBannerText}>
                Filtered by your selected court movement zones.
              </Text>
              <View style={styles.activeShotCountPill}>
                <Text style={styles.activeShotCountText}>{selectedShots.length} Active</Text>
              </View>
            </View>

            {/* Shot Options List */}
            <View style={styles.shotsList}>
              {ALL_SHOTS.map((shot) => {
                const isSelected = selectedShots.includes(shot.id);

                return (
                  <TouchableOpacity
                    key={shot.id}
                    activeOpacity={0.85}
                    onPress={() => toggleShot(shot.id)}
                    style={[styles.shotCard, isSelected && styles.shotCardActive]}>
                    <View style={styles.shotCardLeft}>
                      <View style={styles.shotIconBox}>
                        <Text style={styles.shotIconSymbol}>{shot.iconSymbol}</Text>
                      </View>
                      <View style={styles.shotMetaCol}>
                        <View style={styles.shotTitleRow}>
                          <Text style={styles.shotName}>{shot.name}</Text>
                          <View style={styles.shotTagBadge}>
                            <Text style={styles.shotTagBadgeText}>{shot.tag}</Text>
                          </View>
                        </View>
                        <Text style={styles.shotDesc}>{shot.desc}</Text>
                      </View>
                    </View>

                    <View style={[styles.shotCheckCircle, isSelected && styles.shotCheckCircleActive]}>
                      {isSelected && <Text style={styles.shotCheckMark}>✓</Text>}
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        )}

        {/* ================================================================== */}
        {/* STEP 5: TRAINING INTENSITY (REPS, ACTIVE, REST)                   */}
        {/* ================================================================== */}
        {currentStep === 5 && (
          <View style={styles.stepScreen}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>Set your training intensity</Text>
              <Text style={styles.stepSubtitle}>
                Decide repetition volume and work-to-rest timing.
              </Text>
            </View>

            {/* A. Repetitions Volume Stepper Card */}
            <View style={styles.intensityCard}>
              <View style={styles.intensityCardHeader}>
                <Text style={styles.intensitySectionLabel}>A. PRACTICE VOLUME</Text>
                <View style={styles.intensityBadgePill}>
                  <Text style={styles.intensityBadgeText}>Guided Repetitions</Text>
                </View>
              </View>

              <View style={styles.stepperRow}>
                <TouchableOpacity
                  onPress={() => setRepetitions(Math.max(4, repetitions - 2))}
                  style={styles.stepperBtn}>
                  <Text style={styles.stepperBtnText}>−</Text>
                </TouchableOpacity>

                <View style={styles.stepperCenter}>
                  <Text style={styles.stepperNum}>{repetitions}</Text>
                  <Text style={styles.stepperSub}>total repetitions</Text>
                </View>

                <TouchableOpacity
                  onPress={() => setRepetitions(Math.min(40, repetitions + 2))}
                  style={[styles.stepperBtn, styles.stepperBtnPlus]}>
                  <Text style={[styles.stepperBtnText, { color: '#FFFFFF' }]}>+</Text>
                </TouchableOpacity>
              </View>

              {/* Preset Chips */}
              <View style={styles.presetChipsRow}>
                {[8, 12, 16, 24].map((r) => (
                  <TouchableOpacity
                    key={r}
                    onPress={() => setRepetitions(r)}
                    style={[styles.presetChip, repetitions === r && styles.presetChipActive]}>
                    <Text style={[styles.presetChipText, repetitions === r && styles.presetChipTextActive]}>
                      {r} reps
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* B. Active Time per Repetition */}
            <View style={styles.intensityCard}>
              <View style={styles.intensityCardHeader}>
                <Text style={styles.intensitySectionLabel}>B. TIME PER REPETITION</Text>
                <View style={[styles.intensityBadgePill, { backgroundColor: '#ECFDF5' }]}>
                  <Text style={[styles.intensityBadgeText, { color: '#047857' }]}>Active Phase</Text>
                </View>
              </View>
              <Text style={styles.intensityHelperText}>
                Active time per repetition, including movement, shot execution, and return to centre.
              </Text>

              <View style={styles.timerChipsRow}>
                {[5, 8, 10, 12, 15].map((sec) => (
                  <TouchableOpacity
                    key={sec}
                    onPress={() => setActiveDuration(sec)}
                    style={[styles.timerChip, activeDuration === sec && styles.timerChipActive]}>
                    <Text style={[styles.timerChipText, activeDuration === sec && styles.timerChipTextActive]}>
                      {sec}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* C. Recovery Time between Repetitions */}
            <View style={styles.intensityCard}>
              <View style={styles.intensityCardHeader}>
                <Text style={styles.intensitySectionLabel}>C. RECOVERY TIME</Text>
                <View style={[styles.intensityBadgePill, { backgroundColor: '#F0F9FF' }]}>
                  <Text style={[styles.intensityBadgeText, { color: '#0369A1' }]}>Rest Interval</Text>
                </View>
              </View>
              <Text style={styles.intensityHelperText}>
                Recovery happens between repetitions at base 0 (does not apply after final rep).
              </Text>

              <View style={styles.timerChipsRow}>
                {[3, 4, 6, 8].map((sec) => (
                  <TouchableOpacity
                    key={sec}
                    onPress={() => setRecoveryDuration(sec)}
                    style={[styles.timerChip, recoveryDuration === sec && styles.timerChipActive]}>
                    <Text style={[styles.timerChipText, recoveryDuration === sec && styles.timerChipTextActive]}>
                      {sec}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* ================================================================== */}
        {/* STEP 6: READY COUNTDOWN & REVIEW                                   */}
        {/* ================================================================== */}
        {currentStep === 6 && (
          <View style={styles.stepScreen}>
            <View style={styles.stepHeader}>
              <Text style={styles.stepTitle}>You&apos;re almost ready!</Text>
              <Text style={styles.stepSubtitle}>
                Review your training plan and get ready to step onto the court.
              </Text>
            </View>

            {/* A. Preparation Countdown Selector */}
            <View style={styles.intensityCard}>
              <View style={styles.intensityCardHeader}>
                <Text style={styles.intensitySectionLabel}>A. READY COUNTDOWN</Text>
                <Text style={styles.intensitySectionSubLabel}>Preparation Time</Text>
              </View>
              <Text style={styles.intensityHelperText}>
                How much time do you need to get into your ready stance?
              </Text>

              <View style={styles.timerChipsRow}>
                {[3, 5, 10].map((sec) => (
                  <TouchableOpacity
                    key={sec}
                    onPress={() => setReadyCountdown(sec)}
                    style={[styles.timerChip, readyCountdown === sec && styles.timerChipActive, { flex: 1 }]}>
                    <Text style={[styles.timerChipText, readyCountdown === sec && styles.timerChipTextActive]}>
                      {sec}s
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* B. Dynamic Calculated Estimated Session Duration Card */}
            <View style={styles.calculatedCard}>
              <View style={styles.calcHeaderRow}>
                <Text style={styles.calcHeaderTitle}>DYNAMIC SESSION CALCULATION</Text>
                <View style={styles.calcNoRestBadge}>
                  <Text style={styles.calcNoRestText}>No Final Rest</Text>
                </View>
              </View>

              <View style={styles.calcMetricsRow}>
                <View>
                  <Text style={styles.calcTotalDigits}>{formattedEstTime}</Text>
                  <Text style={styles.calcTotalLabel}>Total estimated session</Text>
                </View>
                <View style={styles.calcBreakdownCol}>
                  <Text style={styles.calcBreakdownText}>Active: <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>{totalActiveSeconds}s</Text></Text>
                  <Text style={styles.calcBreakdownText}>Recovery: <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>{totalRecoverySeconds}s</Text></Text>
                  <Text style={styles.calcBreakdownText}>Ready: <Text style={{ fontWeight: '800', color: '#FFFFFF' }}>{readyCountdown}s</Text></Text>
                </View>
              </View>

              <Text style={styles.calcFormulaText}>
                Formula: (Reps × Active) + ((Reps − 1) × Rest) + Ready Countdown
              </Text>
            </View>

            {/* C. Comprehensive Overview Review */}
            <View style={styles.overviewCard}>
              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>Difficulty Level</Text>
                <View style={styles.overviewValuePill}>
                  <Text style={styles.overviewValuePillText}>
                    {difficulty === 'L0' ? 'L0 Beginner' : difficulty === 'L1' ? 'L1 Intermediate' : 'L2 Advanced'}
                  </Text>
                </View>
              </View>

              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>Movement Zones</Text>
                <Text style={styles.overviewValue}>
                  {playerZones.join(', ')} ({playerZones.length} zones via Base 0)
                </Text>
              </View>

              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>Opponent Targets</Text>
                <Text style={styles.overviewValue}>
                  {opponentZones.map((z) => `T${z}`).join(', ')}
                </Text>
              </View>

              <View style={styles.overviewRow}>
                <Text style={styles.overviewLabel}>Practiced Shots</Text>
                <Text style={styles.overviewValue}>{selectedShots.join(', ')}</Text>
              </View>

              <View style={[styles.overviewRow, { borderBottomWidth: 0 }]}>
                <Text style={styles.overviewLabel}>Cadence Configuration</Text>
                <Text style={styles.overviewValue}>
                  {repetitions} Reps • {activeDuration}s Active • {recoveryDuration}s Rest
                </Text>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* ==================================================================== */}
      {/* Bottom Primary CTA Button                                            */}
      {/* ==================================================================== */}
      <View style={[styles.bottomActionBar, { paddingBottom: Math.max(insets.bottom, 12) }]}>
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={handleNext}
          style={styles.primaryCtaBtn}>
          <Text style={styles.primaryCtaText}>
            {currentStep < 6 ? 'Continue' : 'START PRACTICE'}
          </Text>
          <Text style={styles.primaryCtaArrow}>→</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ============================================================================
// STYLES
// ============================================================================
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8F6FF', // Soft Lavender Misty Canvas
  },

  /* TOP NAV */
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#F8F6FF',
  },
  topNavLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backCircleBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  backChevron: {
    fontSize: 24,
    color: '#0E1326',
    fontWeight: '300',
    marginTop: -2,
  },
  stepBadgeCol: {},
  stepBadgePill: {
    backgroundColor: '#EDE9FE',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignSelf: 'flex-start',
  },
  stepBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#7C3AED',
    letterSpacing: 0.6,
  },
  stepBreadcrumb: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 2,
  },
  coachLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  coachLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10B981',
  },
  coachLiveText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0E1326',
  },

  /* PROGRESS BAR */
  progressBarTrack: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(124, 58, 237, 0.08)',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#7C3AED',
  },

  /* SCROLL CONTENT */
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 100,
  },
  stepScreen: {},
  stepHeader: {
    marginBottom: 16,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0E1326',
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  stepSubtitle: {
    fontSize: 12.5,
    color: '#64748B',
    marginTop: 4,
    lineHeight: 18,
    fontWeight: '500',
  },

  /* MASCOT CARD (STEP 1) */
  mascotCard: {
    backgroundColor: '#F3E8FF',
    borderRadius: 24,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    position: 'relative',
  },
  mascotInfo: {
    flex: 1,
    paddingRight: 12,
  },
  mascotBadgePill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 9999,
    paddingHorizontal: 9,
    paddingVertical: 3,
    alignSelf: 'flex-start',
    marginBottom: 6,
  },
  mascotBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
  },
  mascotHeadline: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0E1326',
    lineHeight: 20,
  },
  mascotDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 3,
    lineHeight: 16,
  },
  mascotAvatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#C4B5FD',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 10,
    elevation: 4,
    position: 'relative',
  },
  mascotHeadband: {
    position: 'absolute',
    top: 14,
    width: 54,
    height: 10,
    borderRadius: 4,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mascotHeadbandGem: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#D4FF00',
  },
  mascotEyesRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 14,
  },
  mascotEye: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: '#0E1326',
  },
  mascotCheeksRow: {
    flexDirection: 'row',
    gap: 30,
    position: 'absolute',
    bottom: 22,
  },
  mascotCheek: {
    width: 8,
    height: 4,
    borderRadius: 2,
    backgroundColor: 'rgba(244, 114, 182, 0.5)',
  },
  mascotMouth: {
    fontSize: 12,
    color: '#0E1326',
    fontWeight: '900',
    position: 'absolute',
    bottom: 12,
  },

  /* DIFFICULTY OPTIONS */
  diffOptionsList: {
    gap: 10,
  },
  diffCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    borderWidth: 2,
    borderColor: 'transparent',
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  diffCardActive: {
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.15,
  },
  diffCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  diffLevelBadge: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeL0: {
    backgroundColor: '#ECFDF5',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  badgeL1: {
    backgroundColor: '#F3E8FF',
    borderWidth: 1,
    borderColor: '#DDD6FE',
  },
  badgeL2: {
    backgroundColor: '#FFF1F2',
    borderWidth: 1,
    borderColor: '#FECDD3',
  },
  diffLevelNum: {
    fontSize: 14,
    fontWeight: '900',
    color: '#0E1326',
  },
  diffLevelSub: {
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    color: '#64748B',
  },
  diffTextCol: {
    flex: 1,
  },
  diffTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  diffTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0E1326',
  },
  diffPill: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 6,
  },
  pillGreen: { backgroundColor: '#ECFDF5' },
  pillPurple: { backgroundColor: '#F3E8FF' },
  pillRose: { backgroundColor: '#FFF1F2' },
  diffPillTextGreen: { fontSize: 10, fontWeight: '700', color: '#047857' },
  diffPillTextPurple: { fontSize: 10, fontWeight: '700', color: '#7C3AED' },
  diffPillTextRose: { fontSize: 10, fontWeight: '700', color: '#BE123C' },
  diffDescText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  radioCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioCircleActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  radioCheck: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '900',
  },

  /* STEP 2 & 3: COURT VISUALIZERS */
  ruleBanner: {
    backgroundColor: '#F3E8FF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ruleBadge: {
    backgroundColor: '#7C3AED',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ruleBadgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  ruleMessage: {
    fontSize: 11,
    color: '#4C1D95',
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 8,
  },
  ruleAction: {},
  ruleActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#7C3AED',
    textDecorationLine: 'underline',
  },

  ruleBannerSky: {
    backgroundColor: '#F0F9FF',
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(2, 132, 199, 0.2)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  ruleBadgeSky: {
    backgroundColor: '#0284C7',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  ruleMessageSky: {
    fontSize: 11,
    color: '#075985',
    fontWeight: '600',
    flex: 1,
    marginHorizontal: 8,
  },
  ruleActionSkyText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#0284C7',
    textDecorationLine: 'underline',
  },

  courtCardContainer: {
    alignItems: 'center',
    marginVertical: 4,
  },
  courtBoard: {
    width: '100%',
    maxWidth: 320,
    height: 310,
    backgroundColor: '#124E3F', // Authentic BWF court green
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    overflow: 'hidden',
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 6,
  },
  courtNet: {
    position: 'absolute',
    top: '48%',
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: 'center',
  },
  courtNetBar: {
    width: '100%',
    height: 3,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  courtNetLabel: {
    fontSize: 7.5,
    fontWeight: '900',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: 4,
    marginTop: -7,
  },
  opponentHalfContext: {
    height: '48%',
    backgroundColor: '#0F4235',
    opacity: 0.65,
    alignItems: 'center',
    justifyContent: 'center',
  },
  opponentHalfLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  playerHalfGrid: {
    height: '52%',
    backgroundColor: '#145A49',
    padding: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    position: 'relative',
  },
  courtZoneTile: {
    width: '48%',
    height: '30%',
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.25)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  courtZoneTileSelected: {
    backgroundColor: 'rgba(124, 58, 237, 0.45)',
    borderColor: '#C4B5FD',
  },
  zoneNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: 'rgba(14, 19, 38, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  zoneNumberBadgeSelected: {
    backgroundColor: '#7C3AED',
  },
  zoneNumberText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
  },
  zoneTileName: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '700',
    marginTop: 1,
  },
  baseStationOverlay: {
    position: 'absolute',
    top: '38%',
    left: '42%',
    alignItems: 'center',
    zIndex: 10,
  },
  baseStationPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#F59E0B',
    borderWidth: 2,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#F59E0B',
    shadowOpacity: 0.5,
    shadowRadius: 6,
  },
  baseStationNum: {
    color: '#0E1326',
    fontWeight: '900',
    fontSize: 12,
  },
  baseStationTag: {
    color: '#FFFFFF',
    fontSize: 7.5,
    fontWeight: '800',
    backgroundColor: 'rgba(14, 19, 38, 0.85)',
    paddingHorizontal: 4,
    borderRadius: 3,
    marginTop: 1,
  },

  /* OPPONENT INTERACTIVE GRID (STEP 3) */
  opponentInteractiveGrid: {
    height: '48%',
    backgroundColor: '#105342',
    padding: 6,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
  },
  opponentTargetTile: {
    width: '48%',
    height: '30%',
    backgroundColor: 'rgba(2, 132, 199, 0.15)',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  opponentTargetTileSelected: {
    backgroundColor: 'rgba(2, 132, 199, 0.55)',
    borderColor: '#38BDF8',
  },
  targetNumberBadge: {
    width: 22,
    height: 18,
    borderRadius: 6,
    backgroundColor: 'rgba(14, 19, 38, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  targetBadgeSelected: {
    backgroundColor: '#0284C7',
  },
  targetNumberText: {
    color: '#FFFFFF',
    fontSize: 9.5,
    fontWeight: '800',
  },
  targetTileName: {
    color: '#FFFFFF',
    fontSize: 8.5,
    fontWeight: '600',
    marginTop: 1,
  },
  playerHalfContext: {
    height: '52%',
    backgroundColor: '#0E3D31',
    opacity: 0.75,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playerHalfContextLabel: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 11,
    fontWeight: '800',
    textTransform: 'uppercase',
  },
  playerHalfContextSub: {
    color: '#C4B5FD',
    fontSize: 9.5,
    fontWeight: '700',
    marginTop: 2,
  },

  /* FLOW TAGS */
  flowSummaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginTop: 10,
  },
  flowSummaryHeader: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#64748B',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  flowTagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  flowPill: {
    backgroundColor: '#EDE9FE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  flowPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  targetPill: {
    backgroundColor: '#E0F2FE',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  targetPillText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0369A1',
  },

  /* STEP 4: SHOTS */
  validationBanner: {
    backgroundColor: '#F3E8FF',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  validationBannerText: {
    fontSize: 11,
    color: '#4C1D95',
    fontWeight: '600',
    flex: 1,
  },
  activeShotCountPill: {
    backgroundColor: '#FFFFFF',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  activeShotCountText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#7C3AED',
  },
  shotsList: {
    gap: 10,
  },
  shotCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 4,
    elevation: 2,
  },
  shotCardActive: {
    borderColor: '#7C3AED',
  },
  shotCardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  shotIconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: '#F3E8FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shotIconSymbol: {
    fontSize: 20,
  },
  shotMetaCol: {
    flex: 1,
  },
  shotTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  shotName: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0E1326',
  },
  shotTagBadge: {
    backgroundColor: '#EDE9FE',
    borderRadius: 4,
    paddingHorizontal: 5,
    paddingVertical: 1,
  },
  shotTagBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    color: '#7C3AED',
  },
  shotDesc: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
  shotCheckCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shotCheckCircleActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
  },
  shotCheckMark: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '900',
  },

  /* STEP 5: INTENSITY */
  intensityCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  intensityCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  intensitySectionLabel: {
    fontSize: 11,
    fontWeight: '900',
    color: '#0E1326',
    letterSpacing: 0.6,
  },
  intensitySectionSubLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#7C3AED',
  },
  intensityBadgePill: {
    backgroundColor: '#F3E8FF',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  intensityBadgeText: {
    fontSize: 9.5,
    fontWeight: '800',
    color: '#7C3AED',
  },
  intensityHelperText: {
    fontSize: 11,
    color: '#64748B',
    lineHeight: 16,
    marginBottom: 12,
  },
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 6,
  },
  stepperBtn: {
    width: 46,
    height: 46,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnPlus: {
    backgroundColor: '#7C3AED',
  },
  stepperBtnText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0E1326',
  },
  stepperCenter: {
    alignItems: 'center',
  },
  stepperNum: {
    fontSize: 34,
    fontWeight: '900',
    color: '#0E1326',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  stepperSub: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  presetChipsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  presetChip: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 9999,
    backgroundColor: '#F1F5F9',
  },
  presetChipActive: {
    backgroundColor: '#EDE9FE',
  },
  presetChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
  },
  presetChipTextActive: {
    color: '#7C3AED',
    fontWeight: '800',
  },
  timerChipsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  timerChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerChipActive: {
    backgroundColor: '#7C3AED',
    borderColor: '#7C3AED',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  timerChipText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0E1326',
  },
  timerChipTextActive: {
    color: '#FFFFFF',
  },

  /* STEP 6: REVIEW & READY */
  calculatedCard: {
    backgroundColor: '#0E1326',
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#0E1326',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  calcHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  calcHeaderTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A78BFA',
    letterSpacing: 0.8,
  },
  calcNoRestBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 9999,
    paddingHorizontal: 6,
    paddingVertical: 1.5,
  },
  calcNoRestText: {
    fontSize: 9,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.8)',
  },
  calcMetricsRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
  },
  calcTotalDigits: {
    fontSize: 32,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  calcTotalLabel: {
    fontSize: 11,
    color: '#C4B5FD',
    marginTop: 2,
  },
  calcBreakdownCol: {
    alignItems: 'flex-end',
    gap: 2,
  },
  calcBreakdownText: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.7)',
  },
  calcFormulaText: {
    fontSize: 9.5,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  overviewCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginBottom: 12,
  },
  overviewRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  overviewLabel: {
    fontSize: 11.5,
    color: '#64748B',
    fontWeight: '500',
  },
  overviewValue: {
    fontSize: 11.5,
    color: '#0E1326',
    fontWeight: '700',
  },
  overviewValuePill: {
    backgroundColor: '#EDE9FE',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  overviewValuePillText: {
    fontSize: 10.5,
    fontWeight: '800',
    color: '#7C3AED',
  },

  /* BOTTOM PRIMARY CTA */
  bottomActionBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(248, 246, 255, 0.95)',
    paddingHorizontal: 16,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(124, 58, 237, 0.08)',
  },
  primaryCtaBtn: {
    backgroundColor: '#7C3AED',
    height: 52,
    borderRadius: 18,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#7C3AED',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  primaryCtaText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  primaryCtaArrow: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '900',
  },

  /* FULLSCREEN COUNTDOWN SCREEN */
  countdownContainer: {
    flex: 1,
    backgroundColor: '#0E1326',
    justifyContent: 'space-between',
  },
  countdownTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  countdownStatusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  countdownPulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34D399',
  },
  countdownStatusText: {
    fontSize: 11,
    fontWeight: '900',
    color: '#34D399',
    letterSpacing: 1,
  },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  cancelBtnText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 12,
    fontWeight: '700',
  },
  countdownCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  radarRingOuter: {
    position: 'absolute',
    width: 280,
    height: 280,
    borderRadius: 140,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.25)',
  },
  radarRingMid: {
    position: 'absolute',
    width: 220,
    height: 220,
    borderRadius: 110,
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.4)',
  },
  countdownCircle: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#7C3AED',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 4,
    borderColor: 'rgba(255,255,255,0.25)',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 12,
  },
  countdownNumber: {
    fontSize: 64,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
  },
  countdownHeading: {
    fontSize: 20,
    fontWeight: '900',
    color: '#FFFFFF',
    marginTop: 28,
  },
  countdownSub: {
    fontSize: 12,
    color: '#C4B5FD',
    marginTop: 4,
  },
  countdownBottom: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  guidanceCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 14,
  },
  guidanceBox: {
    alignItems: 'center',
  },
  guidanceLabel: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.5)',
    letterSpacing: 0.8,
  },
  guidanceValue: {
    fontSize: 13.5,
    fontWeight: '800',
    color: '#C4B5FD',
    marginTop: 2,
  },
  guidanceDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.1)',
  },

  /* ACTIVE DRILL SCREEN */
  activeContainer: {
    flex: 1,
    backgroundColor: '#0E1326',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
  },
  activeTopBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 10,
  },
  activeTopLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  activeLiveDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  dotGreen: { backgroundColor: '#34D399' },
  dotAmber: { backgroundColor: '#F59E0B' },
  activeLiveLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: '#34D399',
    letterSpacing: 0.8,
  },
  activeTopRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  repBadge: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 9999,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  repBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  controlIconBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    backgroundColor: 'rgba(239, 68, 68, 0.2)',
  },
  controlIconText: {
    fontSize: 13,
    color: '#FFFFFF',
  },
  activeCenterInfo: {
    alignItems: 'center',
    marginTop: 6,
  },
  phasePill: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 9999,
    marginBottom: 6,
  },
  phasePillMove: {
    backgroundColor: '#10B981',
  },
  phasePillRecovery: {
    backgroundColor: '#F59E0B',
  },
  phasePillText: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1,
  },
  phaseTextMove: { color: '#0E1326' },
  phaseTextRecovery: { color: '#0E1326' },
  activeHeading: {
    fontSize: 26,
    fontWeight: '900',
    color: '#FFFFFF',
    letterSpacing: -0.3,
  },
  audioCueStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(124, 58, 237, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(124, 58, 237, 0.4)',
    borderRadius: 9999,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 8,
  },
  audioSpeakerIcon: {
    fontSize: 12,
  },
  audioCueText: {
    fontSize: 11.5,
    fontWeight: '700',
    color: '#DDD6FE',
  },
  activeTimerCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 6,
    borderColor: '#D4FF00', // Electric lime timer ring
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    shadowColor: '#D4FF00',
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 8,
    marginVertical: 4,
  },
  activeTimerDigits: {
    fontSize: 52,
    fontWeight: '900',
    color: '#FFFFFF',
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 56,
  },
  activeTimerUnit: {
    fontSize: 9,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1,
  },
  activeCourtCard: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 18,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  courtHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  courtHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: '#CBD5E1',
  },
  courtHeaderSub: {
    fontSize: 11,
    fontWeight: '700',
    color: '#F59E0B',
  },
  miniCourtGrid: {
    height: 90,
    backgroundColor: '#124E3F',
    borderRadius: 12,
    padding: 4,
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignContent: 'space-between',
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  miniZone: {
    width: '48%',
    height: '28%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  miniZoneTarget: {
    backgroundColor: '#D4FF00',
  },
  miniZoneText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 9,
    fontWeight: '900',
  },
  miniZoneTextTarget: {
    color: '#0E1326',
  },
  miniBaseStation: {
    position: 'absolute',
    left: '44%',
    top: '32%',
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#F59E0B',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  miniBaseStationActive: {
    backgroundColor: '#D4FF00',
  },
  miniBaseText: {
    color: '#0E1326',
    fontWeight: '900',
    fontSize: 9,
  },
  activeBottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.08)',
  },
  activeMetaText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 11.5,
  },

  /* COMPLETION SCREEN */
  completeContainer: {
    flex: 1,
    backgroundColor: '#F8F6FF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  completeContent: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  completeTrophy: {
    fontSize: 64,
    marginBottom: 8,
  },
  completeTitle: {
    fontSize: 26,
    fontWeight: '900',
    color: '#0E1326',
    letterSpacing: -0.3,
  },
  completeSubtitle: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 6,
    lineHeight: 18,
    paddingHorizontal: 20,
  },
  completeStatsCard: {
    width: '100%',
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    marginVertical: 20,
    gap: 12,
    shadowColor: '#7C3AED',
    shadowOpacity: 0.08,
    shadowRadius: 10,
    elevation: 3,
  },
  completeStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  completeStatLabel: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  completeStatValue: {
    fontSize: 14,
    fontWeight: '800',
    color: '#0E1326',
  },
  finishDashboardBtn: {
    width: '100%',
    backgroundColor: '#7C3AED',
    height: 52,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#7C3AED',
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  finishDashboardBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '900',
  },
});
