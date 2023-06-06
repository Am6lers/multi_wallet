import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import Agree from '../signup/Agree';
import { StyleSheet } from 'react-native';
import PinInput from '../signup/InputPin';
import Done from '../signup/Done';
import InputSeed from './InputSeed';

const Import = () => {
  const [page, setPage] = useState<number>(0);

  const pages = useCallback(() => {
    switch (page) {
      case 0:
        return <Agree setPage={setPage} page={page} />;
      case 1:
        return <PinInput setPage={setPage} page={page} />;
      case 2:
        return <InputSeed setPage={setPage} page={page} />;
      case 3:
        return <Done setPage={setPage} page={page} />;
    }
  }, [page]);

  return <SafeAreaView style={styles.container}>{pages()}</SafeAreaView>;
};

export default Import;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
