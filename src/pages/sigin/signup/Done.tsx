import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SafeAreaView } from 'react-native-safe-area-context';
import OKBTN from '../../../images/okbtn2.svg';

const Done = () => {
  return (
    <SafeAreaView>
      <OKBTN />
    </SafeAreaView>
  );
};

export default Done;
