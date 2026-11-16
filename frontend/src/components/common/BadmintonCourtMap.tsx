import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ViewStyle,
  TouchableOpacity,
} from 'react-native';
import { AeroColors, BorderRadius, Typography } from '@/constants/theme';

export interface BadmintonCourtMapProps {
  style?: ViewStyle;
  highlightedNodes?: number[]; // Legacy / static preview support
  selectedNodes?: number[];    // Interactive selected nodes
  disabledNodes?: number[];    // Tier-restricted / inactive nodes
  onNodePress?: (nodeId: number) => void;
  interactive?: boolean;       // Enable touchable nodes (default: false)
  showLabels?: boolean;
}

export function BadmintonCourtMap({
  style,
  highlightedNodes = [0, 1, 2],
  selectedNodes,
  disabledNodes = [],
  onNodePress,
  interactive = false,
  showLabels = true,
}: BadmintonCourtMapProps) {
  // Determine if a node is active/selected
  const isSelected = (nodeId: number) => {
    if (selectedNodes !== undefined) {
      return selectedNodes.includes(nodeId);
    }
    return highlightedNodes.includes(nodeId);
  };

  const isDisabled = (nodeId: number) => disabledNodes.includes(nodeId);

  // Render standard court node (1 to 6)
  const renderCourtNode = (nodeId: number, label: string) => {
    const selected = isSelected(nodeId);
    const disabled = isDisabled(nodeId);

    const nodeCircleStyle = [
      styles.nodeCircle,
      selected && styles.nodeCircleSelected,
      disabled && styles.nodeCircleDisabled,
    ];

    const nodeTextStyle = [
      styles.nodeNumber,
      selected && styles.nodeNumberSelected,
      disabled && styles.nodeNumberDisabled,
    ];

    const content = (
      <>
        <View style={nodeCircleStyle}>
          {disabled ? (
            <Text style={styles.disabledIcon}>✕</Text>
          ) : (
            <Text style={nodeTextStyle}>{nodeId}</Text>
          )}
        </View>
        {showLabels && (
          <Text
            style={[
              styles.nodeLabel,
              selected && styles.nodeLabelSelected,
              disabled && styles.nodeLabelDisabled,
            ]}>
            {label}
          </Text>
        )}
      </>
    );

    if (interactive) {
      return (
        <TouchableOpacity
          key={nodeId}
          activeOpacity={0.75}
          onPress={() => onNodePress?.(nodeId)}
          disabled={disabled}
          style={styles.nodeTouchable}
          accessibilityRole="button"
          accessibilityLabel={`Position ${nodeId}: ${label}`}
          accessibilityState={{ selected, disabled }}>
          {content}
        </TouchableOpacity>
      );
    }

    return (
      <View key={nodeId} style={styles.nodeWrapper}>
        {content}
      </View>
    );
  };

  // Render Base 0 (Neutral Center Anchor)
  const renderBaseNode = () => {
    const selected = isSelected(0);
    const disabled = isDisabled(0);

    const content = (
      <>
        <View
          style={[
            styles.baseNodeCircle,
            selected && styles.baseNodeSelected,
            disabled && styles.baseNodeDisabled,
          ]}>
          <Text style={styles.baseNodeText}>0</Text>
          <Text style={styles.baseNodeSubtext}>BASE</Text>
        </View>
        {showLabels && (
          <Text
            style={[
              styles.baseNodeLabel,
              selected && styles.baseNodeLabelSelected,
            ]}>
            Recovery T
          </Text>
        )}
      </>
    );

    if (interactive) {
      return (
        <TouchableOpacity
          key="base-0"
          activeOpacity={0.8}
          onPress={() => onNodePress?.(0)}
          disabled={disabled}
          style={styles.baseNodeTouchable}
          accessibilityRole="button"
          accessibilityLabel="Position 0: Base Recovery Anchor"
          accessibilityState={{ selected, disabled }}>
          {content}
        </TouchableOpacity>
      );
    }

    return (
      <View key="base-0" style={styles.baseNodeWrapper}>
        {content}
      </View>
    );
  };

  return (
    <View style={[styles.canvas, style]}>
      {/* Court Boundary Frame */}
      <View style={styles.court}>
        {/* Badminton Net Line (Top of Half Court) */}
        <View style={styles.netLine} />

        {/* Short Service Line */}
        <View style={styles.shortServiceLine} />

        {/* Long Service Line */}
        <View style={styles.longServiceLine} />

        {/* Centre Line (Dividing Left & Right) */}
        <View style={styles.centreLine} />

        {/* Left Doubles Tramline */}
        <View style={styles.leftTramline} />

        {/* Right Doubles Tramline */}
        <View style={styles.rightTramline} />

        {/* Tactical Nodes Overlay */}
        <View style={styles.nodesOverlay}>
          {/* Row 1: Front Net (Positions 1 & 2) */}
          <View style={styles.nodeRowFront}>
            {renderCourtNode(1, 'Net L')}

            {/* Net Zone Marker */}
            <View style={styles.netZoneBadge}>
              <Text style={styles.netZoneText}>NET ZONE</Text>
            </View>

            {renderCourtNode(2, 'Net R')}
          </View>

          {/* Row 2: Mid-Court & Centre T (Positions 3, 0, 4) */}
          <View style={styles.nodeRowMid}>
            {renderCourtNode(3, 'Drive L')}
            {renderBaseNode()}
            {renderCourtNode(4, 'Drive R')}
          </View>

          {/* Row 3: Rear Court (Positions 5 & 6) */}
          <View style={styles.nodeRowRear}>
            {renderCourtNode(5, 'Rear L')}

            {/* Rear Line Marker */}
            <View style={styles.rearZoneBadge}>
              <Text style={styles.rearZoneText}>BASELINE</Text>
            </View>

            {renderCourtNode(6, 'Rear R')}
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  canvas: {
    width: '100%',
    aspectRatio: 16 / 10,
    backgroundColor: AeroColors.surface,
    borderRadius: BorderRadius.md,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  court: {
    width: '94%',
    height: '92%',
    borderWidth: 1.5,
    borderColor: 'rgba(135, 155, 148, 0.4)',
    borderRadius: 3,
    position: 'relative',
    backgroundColor: '#E8F7F3',
  },
  netLine: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 3,
    backgroundColor: AeroColors.deepTeal,
  },
  shortServiceLine: {
    position: 'absolute',
    top: '32%',
    left: 0,
    right: 0,
    height: 1.5,
    backgroundColor: 'rgba(135, 155, 148, 0.4)',
  },
  longServiceLine: {
    position: 'absolute',
    bottom: '16%',
    left: 0,
    right: 0,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(135, 155, 148, 0.4)',
  },
  centreLine: {
    position: 'absolute',
    top: '32%',
    bottom: 0,
    left: '50%',
    width: 1.5,
    marginLeft: -0.75,
    backgroundColor: 'rgba(135, 155, 148, 0.4)',
  },
  leftTramline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: '8%',
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(135, 155, 148, 0.3)',
  },
  rightTramline: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    right: '8%',
    width: 1,
    borderStyle: 'dashed',
    borderWidth: 0.5,
    borderColor: 'rgba(135, 155, 148, 0.3)',
  },
  nodesOverlay: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'space-between',
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  nodeRowFront: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeRowMid: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  nodeRowRear: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  // Node wrappers & touchables (>= 44px hit target)
  nodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  nodeTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
    minHeight: 44,
  },

  // Node Circle Styles
  nodeCircle: {
    width: 28,
    height: 28,
    borderRadius: BorderRadius.full,
    backgroundColor: AeroColors.pureWhite,
    borderWidth: 1.5,
    borderColor: AeroColors.mutedSage,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: AeroColors.deepTeal,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 2,
    elevation: 1,
  },
  nodeCircleSelected: {
    backgroundColor: AeroColors.deepTeal,
    borderColor: AeroColors.seafoam,
    borderWidth: 2,
    transform: [{ scale: 1.08 }],
    shadowColor: AeroColors.seafoam,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  nodeCircleDisabled: {
    backgroundColor: 'rgba(135, 155, 148, 0.12)',
    borderColor: 'rgba(135, 155, 148, 0.25)',
    borderStyle: 'dashed',
    shadowOpacity: 0,
    elevation: 0,
  },

  // Node Typography
  nodeNumber: {
    ...Typography.labelSm,
    fontSize: 11,
    color: AeroColors.darkSlate,
    fontWeight: '700',
  },
  nodeNumberSelected: {
    color: AeroColors.seafoam,
    fontWeight: '800',
  },
  nodeNumberDisabled: {
    color: AeroColors.mutedSage,
    opacity: 0.4,
  },
  disabledIcon: {
    fontSize: 9,
    color: AeroColors.mutedSage,
    opacity: 0.5,
    fontWeight: '700',
  },
  nodeLabel: {
    fontSize: 8,
    fontWeight: '600',
    color: AeroColors.mutedSage,
    marginTop: 2,
  },
  nodeLabelSelected: {
    color: AeroColors.deepTeal,
    fontWeight: '700',
  },
  nodeLabelDisabled: {
    opacity: 0.35,
  },

  // Base 0 Anchor Styles
  baseNodeWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 44,
  },
  baseNodeTouchable: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 48,
    minHeight: 48,
  },
  baseNodeCircle: {
    width: 38,
    height: 38,
    borderRadius: BorderRadius.full,
    backgroundColor: AeroColors.deepTeal,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: AeroColors.seafoam,
    shadowColor: AeroColors.deepTeal,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  baseNodeSelected: {
    backgroundColor: AeroColors.deepTeal,
    borderColor: AeroColors.seafoam,
    transform: [{ scale: 1.05 }],
  },
  baseNodeDisabled: {
    opacity: 0.4,
  },
  baseNodeText: {
    fontSize: 12,
    fontWeight: '800',
    color: AeroColors.pureWhite,
    lineHeight: 13,
  },
  baseNodeSubtext: {
    fontSize: 7,
    fontWeight: '800',
    color: AeroColors.seafoam,
    letterSpacing: 0.5,
    lineHeight: 8,
  },
  baseNodeLabel: {
    fontSize: 8,
    fontWeight: '700',
    color: AeroColors.deepTeal,
    marginTop: 2,
  },
  baseNodeLabelSelected: {
    color: AeroColors.deepTeal,
  },

  // Court Badges
  netZoneBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: 'rgba(18, 59, 58, 0.08)',
    borderRadius: 4,
  },
  netZoneText: {
    fontSize: 8,
    fontWeight: '700',
    color: AeroColors.deepTeal,
    letterSpacing: 0.5,
  },
  rearZoneBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    backgroundColor: 'rgba(18, 59, 58, 0.08)',
    borderRadius: 4,
  },
  rearZoneText: {
    fontSize: 8,
    fontWeight: '700',
    color: AeroColors.mutedSage,
    letterSpacing: 0.5,
  },
});
