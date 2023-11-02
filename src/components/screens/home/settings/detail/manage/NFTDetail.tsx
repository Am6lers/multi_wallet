import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { StyleSheet } from 'react-native';
import {
  BorderRadiuses,
  Button,
  Colors,
  Image,
  Spacings,
  Text,
  View,
} from 'react-native-ui-lib';
import { ParamListBase, useNavigation } from '@react-navigation/native';

interface NFTItem {
  title?: string;
  image?: string;
  description?: string;
  standard?: string;
  soulbound?: boolean;
  amount: number;
};

interface NFTDetailProps {
  route: {
    params: {
      item: NFTItem;
    };
  };
}

const NFTDetail = ({ route }: NFTDetailProps) => {
  const { item } = route.params;
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  return (
    <View style={styles.outline} useSafeArea>
      <View flex center marginT-20>
        <Image
          source={{ uri: item.image }}
          style={{ width: 200, height: 200 }}
        />
        <Text text70BO>{item.standard}</Text>
      </View>
      <View flex padding-40>
        {item.soulbound && (
          <View marginB-10>
            <Text text70BO blue20>Soulbound Token</Text>
            <Text text80BO grey40>
              Soulbound Token(SBT)는 소유자에게 귀속되며, 거래가 불가능한 토큰
              입니다.
            </Text>
          </View>
        )}
        <Text text50BO>{item.title}</Text>
        <Text text70BO>{item.description}</Text>
      </View>
      <View center>
        <Button
          style={{ width: 360, height: 50 }}
          label="Close"
          borderRadius={BorderRadiuses.br50}
          backgroundColor={Colors.black}
          onPress={() => {
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    justifyContent: 'space-between',
  },
  outline: {
    flex: 1,
  },
});

export default NFTDetail;
