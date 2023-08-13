import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
// import OKBTN from '@assets/images/okbtn.svg';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import constants from '@constants/index';

interface DoneProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}

const Done = ({ setPage, page }: DoneProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <SafeAreaView style={styles.container}>
      {/* <OKBTN style={styles.svg} /> */}
      <TouchableOpacity
        style={styles.afterBottomBox}
        onPress={() =>
          navigation.reset({ routes: [{ name: 'MainStackNavigator' }] })
        }
      >
        <Text style={styles.bottomText}>동의합니다.</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Done;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  svg: {
    maxWidth: constants.WINDOW_WIDTH - 60,
    maxHeight: constants.WINDOW_WIDTH - 60,
  },
  afterBottomBox: {
    display: 'flex',
    justifyContent: 'center',
    height: 60,
    borderRadius: 20,
    width: '90%',
    backgroundColor: '#F561A6',
  },
  bottomText: {
    textAlign: 'center',
    color: 'white',
    alignItems: 'center',
    fontWeight: 'bold',
    fontSize: 18,
  },
});
