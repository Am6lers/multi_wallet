import { StyleSheet } from 'react-native';
import {
  BorderRadiuses,
  Colors,
  Spacings,
  TextField,
  View,
} from 'react-native-ui-lib';

const SearchField = ({ text }: { text: string }) => {
  return (
    <View>
      <TextField
        marginV-30
        marginH-20
        placeholder={text}
        returnKeyType="search"
        containerStyle={styles.search}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  search: {
    borderRadius: BorderRadiuses.br30,
    backgroundColor: Colors.grey70,
    padding: Spacings.s3,
  },
});

export default SearchField;
