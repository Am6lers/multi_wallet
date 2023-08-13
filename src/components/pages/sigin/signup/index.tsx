import { SafeAreaView } from 'react-native-safe-area-context';
import React, { useCallback, useState } from 'react';
import Agree from './Agree';
import { StyleSheet, View } from 'react-native';
import PinInput from './InputPin';
import Done from './Done';

const SignUp = () => {
  const [page, setPage] = useState<number>(0);

  const pages = useCallback(() => {
    switch (page) {
      case 0:
        return <Agree setPage={setPage} page={page} />;
      case 1:
        return <PinInput setPage={setPage} page={page} />;
      case 2:
        return <Done setPage={setPage} page={page} />;
    }
  }, [page]);

  return <View style={styles.container}>{pages()}</View>;
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
