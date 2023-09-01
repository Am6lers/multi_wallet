import { TabView, SceneMap, TabBar } from 'react-native-tab-view';
import React, { useMemo } from 'react';
import { StyleSheet, useWindowDimensions } from 'react-native';
import { View } from 'react-native-ui-lib';
import NftList from '@components/organism/home/NftList';
import TokenList from '@components/organism/home/TokenList';
import Constants from '@constants/app';
import Colors from '@constants/colors';
import CredentialList from '@components/organism/home/CredentialList';

const AssetView = () => {
  const FirstRoute = React.memo(() => <NftList />);

  const SecondRoute = React.memo(() => <CredentialList />);
  const layout = useWindowDimensions();

  const [index, setIndex] = React.useState(0);

  const renderScene = ({
    route,
  }: {
    route: {
      key: string;
    };
  }) => {
    switch (route.key) {
      case 'first':
        return <FirstRoute />;
      case 'second':
        return <SecondRoute />;
    }
  };

  const [routes] = React.useState([
    { key: 'first', title: 'Nfts' },
    { key: 'second', title: 'Credentials' },
  ]);

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      renderTabBar={(props: any) => (
        <TabBar
          labelStyle={styles.labelStyle}
          indicatorStyle={styles.indicatorStyle}
          indicatorContainerStyle={styles.indicatorContainerStyle}
          {...props}
        />
      )}
    />
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
