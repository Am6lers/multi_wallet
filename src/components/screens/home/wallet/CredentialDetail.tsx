import React, { useMemo } from 'react';
import { Image, StyleSheet } from 'react-native';
import { Text, View } from 'react-native-ui-lib';
import Colors from '@constants/colors';
import Constants from '@constants/app';
import Header from '@components/atoms/Header';

const CredentialDetail = ({ route }: { route: any }) => {
  const CRDData = useMemo(() => route.params.CRDData, [route]);
  return (
    <View useSafeArea style={styles.container}>
      <Header />
      <View style={styles.main}>
        <Image
          source={{ uri: `https://${CRDData.image}` }}
          style={styles.image}
        />
        <Text text60BO style={styles.title}>{`Name: ${CRDData.name}`}</Text>
        <Text text60BO style={styles.title}>{`Birth: ${CRDData.birth}`}</Text>
        <Text text60BO style={styles.title}>{`Type: ${CRDData.type}`}</Text>
        <Text
          text80
          color={Colors.Gray}
          style={styles.subTitle}
        >{`${CRDData.id}`}</Text>
      </View>
    </View>
  );
};

export default CredentialDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: Constants.PAGE_M1,
  },
  main: {
    alignItems: 'center',
    paddingHorizontal: Constants.PAGE_M1,
  },
  image: {
    width: Constants.WINDOW_WIDTH / 2,
    height: Constants.WINDOW_WIDTH / 2,
    resizeMode: 'contain',
    marginBottom: 50,
  },
  title: {
    marginVertical: 8,
  },
  subTitle: {
    textAlign: 'center',
    marginTop: 20,
  },
});
