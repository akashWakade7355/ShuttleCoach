import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface CalendarDay {
  id: string;
  dayName: string;
  dayNumber: number;
}

const DEFAULT_DAYS: CalendarDay[] = [
  { id: 'sun', dayName: 'Sun', dayNumber: 12 },
  { id: 'mon', dayName: 'Mon', dayNumber: 13 },
  { id: 'tue', dayName: 'Tue', dayNumber: 14 },
  { id: 'wed', dayName: 'Wed', dayNumber: 15 },
  { id: 'thu', dayName: 'Thu', dayNumber: 16 },
  { id: 'fri', dayName: 'Fri', dayNumber: 17 },
  { id: 'sat', dayName: 'Sat', dayNumber: 18 },
];

interface WeeklyCalendarStripProps {
  onSelectDay?: (day: CalendarDay) => void;
}

export function WeeklyCalendarStrip({ onSelectDay }: WeeklyCalendarStripProps) {
  // Wed 15 is active by default as shown in the design
  const [selectedDayId, setSelectedDayId] = useState<string>('wed');

  const handleDayPress = (day: CalendarDay) => {
    setSelectedDayId(day.id);
    onSelectDay?.(day);
  };

  return (
    <View style={styles.container}>
      <View style={styles.daysRow}>
        {DEFAULT_DAYS.map((day) => {
          const isActive = day.id === selectedDayId;
          return (
            <TouchableOpacity
              key={day.id}
              activeOpacity={0.8}
              onPress={() => handleDayPress(day)}
              style={[
                styles.dayButton,
                isActive ? styles.dayButtonActive : styles.dayButtonInactive,
              ]}
              accessibilityRole="button"
              accessibilityLabel={`${day.dayName} ${day.dayNumber}`}>
              <Text
                style={[
                  styles.dayNameText,
                  isActive ? styles.dayNameActive : styles.dayNameInactive,
                ]}>
                {day.dayName}
              </Text>
              <Text
                style={[
                  styles.dayNumberText,
                  isActive ? styles.dayNumberActive : styles.dayNumberInactive,
                ]}>
                {day.dayNumber}
              </Text>
              {isActive && <View style={styles.activeDot} />}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 24,
  },
  daysRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: 6,
  },
  dayButton: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 68,
  },
  dayButtonInactive: {
    backgroundColor: '#FFFFFF', // surface-container-lowest
    shadowColor: '#191B25',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  dayButtonActive: {
    backgroundColor: '#D2AFFD', // secondary-container
    shadowColor: '#6E5096',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.18,
    shadowRadius: 6,
    elevation: 3,
  },
  dayNameText: {
    fontSize: 11,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  dayNameInactive: {
    color: '#434653', // on-surface-variant
    fontWeight: '500',
  },
  dayNameActive: {
    color: '#5C3E83', // on-secondary-container
    fontWeight: '700',
  },
  dayNumberText: {
    letterSpacing: -0.2,
  },
  dayNumberInactive: {
    fontSize: 14,
    color: '#191B25', // on-surface
    fontWeight: '700',
  },
  dayNumberActive: {
    fontSize: 18,
    color: '#5C3E83', // on-secondary-container
    fontWeight: '800',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#2353C6', // primary
    marginTop: 4,
  },
});

