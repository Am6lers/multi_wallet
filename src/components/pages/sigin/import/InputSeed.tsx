import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet, Text, TextInput, TouchableOpacity } from 'react-native';
import constants from '@constants/index';

interface DoneProps {
  setPage: React.Dispatch<React.SetStateAction<number>>;
  page: number;
}

const InputSeed = ({ setPage, page }: DoneProps) => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.svg}
        placeholder="시드를 입력해주세요"
        placeholderTextColor={'balck'}
        secureTextEntry={true}
      />
      <TouchableOpacity
        style={styles.afterBottomBox}
        onPress={() => setPage(page + 1)}
      >
        <Text style={styles.bottomText}>지갑 가져오기</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default InputSeed;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  svg: {
    height: 60,
    borderRadius: 20,
    width: '90%',
    borderBottomWidth: 1,
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
