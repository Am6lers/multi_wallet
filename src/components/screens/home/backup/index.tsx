import { Text, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';
import Header from '@components/atoms/Header';

const Backup = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={{ zIndex: 2 }}>
            <Header title="지갑 백업하기" />
          </View>
          <View></View>
        </View>
        <Text>Backup</Text>
      </View>
    </View>
  );
};

export default Backup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
  outline: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    zIndex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
