import { Text, View } from 'react-native-ui-lib';
import { StyleSheet } from 'react-native';
import Colors from '@constants/colors';

const Backup = () => {
  return (
    <View useSafeArea={true} style={styles.container}>
      <Text>Backup</Text>
    </View>
  );
};

export default Backup;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
  },
});
