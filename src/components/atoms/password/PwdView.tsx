import React from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { colorPalette } from '@common/Theme';
import config from '@config/index';

//비밀번호 입력마다 암호화된 입력값과 에러를 보여주는 함수
const PwdView = ({ password, error }: { password: string; error: boolean }) => {
  const defaultColor = colorPalette.white35p;
  const selectColor = colorPalette.white;
  const errorColor = colorPalette.warningColor;
  return (
    <View style={styles.pinView}>
      <FlatList
        data={[0, 1, 2, 3, 4, 5]}
        scrollEnabled={false}
        horizontal={true}
        renderItem={({ index }: { index: number | string }) => {
          const dotColor =
            password.length > index
              ? error
                ? errorColor
                : selectColor
              : defaultColor;
          return (
            <View>
              <View
                style={[
                  styles.pin,
                  {
                    backgroundColor: dotColor,
                  },
                ]}
              />
            </View>
          );
        }}
      />
    </View>
  );
};

export default PwdView;

const styles = StyleSheet.create({
  error: {
    alignSelf: 'center',
    color: colorPalette.warningColor,
    position: 'absolute',
    marginTop: 100,
  },
  title: {
    color: colorPalette.white,
    alignSelf: 'center',
    marginTop: 60,
  },
  pin: {
    borderRadius: 50,
    width: 10,
    height: 10,
    backgroundColor: colorPalette.white,
    marginHorizontal: (config.WINDOW_WIDTH - 140) / 12,
  },
  pinView: {
    width: config.WINDOW_WIDTH - 80,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100,
    marginTop: 80,
  },
});
