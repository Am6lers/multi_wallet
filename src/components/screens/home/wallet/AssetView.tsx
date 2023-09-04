import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import Colors from '@constants/colors';

const AssetView = () => {
  return (
    // <TabView
    //   navigationState={{ index, routes }}
    //   renderScene={renderScene}
    //   onIndexChange={setIndex}
    //   initialLayout={{ width: layout.width }}
    //   renderTabBar={(props: any) => (
    //     <TabBar
    //       labelStyle={styles.labelStyle}
    //       indicatorStyle={styles.indicatorStyle}
    //       indicatorContainerStyle={styles.indicatorContainerStyle}
    //       {...props}
    //     />
    //   )}
    // />
    <View></View>
  );
};

export default AssetView;

const styles = StyleSheet.create({
  labelStyle: {
    textTransform: 'none',
    fontSize: 15.0,
    lineHeight: 25,
    color: Colors.Dark,
  },
  indicatorStyle: {
    backgroundColor: Colors.Dark,
    height: 2,
  },
  indicatorContainerStyle: {
    backgroundColor: Colors.White,
  },
});
