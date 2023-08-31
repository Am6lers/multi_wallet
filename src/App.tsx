import { MORALIS_API_KEY } from '@env';
import { NavigationContainer } from '@react-navigation/native';
import React, { Suspense, useEffect } from 'react';
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
import { persistor, store } from './store';
import InitialStackNavigator from './components/navigator/InitialNavigator';
import { isExistAccountState, Loading, loadingState } from './store/atoms';
import LoadingView from './components/atoms/Loading';
import Engine from './core/engine';
import { PersistGate } from 'redux-persist/integration/react';
import Moralis from 'moralis';

const AppWrapper = () => {
  const isLoaiding = useRecoilValue<Loading>(loadingState);

  // Initialize for Moralis API
  if (!Moralis.Core.isStarted) {
    Moralis.start({
      apiKey: MORALIS_API_KEY,
    });
  }

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
      <PersistGate persistor={persistor}>
        <Suspense fallback={<></>}>
          <RecoilRoot>
            <AppWrapper />
          </RecoilRoot>
        </Suspense>
      </PersistGate>
    </Provider>
  );
};

export default App;
