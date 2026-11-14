import React from 'react';
import {
  Tabs,
  TabList,
  TabTrigger,
  TabSlot,
} from 'expo-router/ui';
import { View, StyleSheet } from 'react-native';
import { usePathname } from 'expo-router';
import { CurvedScoopNavBar, NavTabButton, NAV_TABS } from '@/components/navigation/CurvedScoopNavBar';

export default function AppTabs() {
  const pathname = usePathname();

  return (
    <View style={styles.container}>
      <Tabs>
        <TabSlot style={{ height: '100%' }} />
        <TabList asChild>
          <CurvedScoopNavBar currentPath={pathname}>
            {NAV_TABS.map((tab) => (
              <TabTrigger key={tab.key} name={tab.name} href={tab.href as any} asChild>
                <NavTabButton tab={tab} />
              </TabTrigger>
            ))}
          </CurvedScoopNavBar>
        </TabList>
      </Tabs>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#080C14',
  },
});
