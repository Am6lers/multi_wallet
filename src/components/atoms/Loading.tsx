import React, { useMemo } from 'react';
import { Loading } from '@store/atoms';
import { LoaderScreen, View } from 'react-native-ui-lib';
import Constants from '@constants/app';
import { StyleSheet } from 'react-native';
import LottieView from 'lottie-react-native';
import { LOTTIE_LOADING } from '@assets/lottie/roots';

const LoadingView = ({ loadingData }: { loadingData: Loading }) => {
  const showLoading = useMemo(() => {
    return loadingData?.loading;
  }, [loadingData]);
  return (
    <>
      {showLoading && (
        <View style={styles.container}>
          <LottieView
            style={styles.lottie}
            source={LOTTIE_LOADING}
            autoPlay
            loop
          />
        </View>
      )}
    </>
  );
};

export const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 300,
    width: '100%',
    height: '100%',
    zIndex: 10,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  lottie: {
    minWidth: 200,
    minHeight: 200,
  },
});

export default LoadingView;
