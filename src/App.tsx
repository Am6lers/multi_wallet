/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { NavigationContainer } from '@react-navigation/native';
import React, { Suspense } from 'react';
import type { PropsWithChildren } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import {
  RecoilRoot,
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
} from 'recoil';
// import SignStackNavigator from './navigators/SignStackNavigator';
import { Provider, useDispatch, useSelector } from 'react-redux';
import { store } from './store';
import InitialStackNavigator from './components/navigator/InitialNavigator';
import { Loading, loadingState } from './store/atoms';
import LoadingView from './components/atoms/Loading';

const AppWrapper = () => {
  const isLoaiding = useRecoilValue<Loading>(loadingState);
  return (
    <NavigationContainer>
      <LoadingView loadingData={isLoaiding} />
      <InitialStackNavigator />
    </NavigationContainer>
  );
};

const App = (): JSX.Element => {
  return (
    <Provider store={store}>
      <Suspense fallback={<></>}>
        <RecoilRoot>
          <AppWrapper />
        </RecoilRoot>
      </Suspense>
    </Provider>
  );
};

export default App;
