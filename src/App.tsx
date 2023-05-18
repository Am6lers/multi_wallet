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
import SignStackNavigator from './navigators/SignStackNavigator';
const AppWrapper = () => {
  return (
    <NavigationContainer>
      <SignStackNavigator />
    </NavigationContainer>
  );
};

const App = (): JSX.Element => {
  return (
    <Suspense fallback={<></>}>
      <RecoilRoot>
        <AppWrapper />
      </RecoilRoot>
    </Suspense>
  );
};

export default App;
