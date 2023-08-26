import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { StyleSheet } from 'react-native';
import {
  Button,
  GridList,
  GridListItem,
  Spacings,
  Text,
  View,
} from 'react-native-ui-lib';
import Colors from '@constants/colors';
import { Shadow } from 'react-native-shadow-2';
import Keypad from '../atoms/Keypad';
import TL from '@translate/index';
import Constants from '@constants/app';

const Pin = ({ entered }: { entered: boolean }) => {
  return (
    <View style={{ marginHorizontal: 10 }}>
      {entered ? (
        <Shadow offset={[0, 4]} distance={5}>
          <View style={styles.pin} />
        </Shadow>
      ) : (
        <View style={styles.disabled} />
      )}
    </View>
  );
};

const PinInput = ({
  isCreate = false,
  setPin,
}: {
  isCreate?: boolean;
  setPin: (pins: string) => void;
}) => {
  const [inputPins, setInputPins] = useState<string[]>(new Array(6).fill(''));
  const [verifyPins, setVerifyPins] = useState<string[]>(new Array(6).fill(''));
  const [errorMessage, setErrorMessage] = useState<string>();
  const isConfirmPwd = useMemo(
    () => isCreate && inputPins.filter((pin: String) => pin != '').length < 6,
    [inputPins],
  );
  const pinArray = useMemo(
    () => (isConfirmPwd ? inputPins : verifyPins),
    [inputPins, verifyPins, isConfirmPwd],
  );

  useEffect(() => {
    if (verifyPins.filter((pin: String) => pin != '').length >= 6) {
      if (isCreate && inputPins.toString() === verifyPins.toString()) {
        setPin(inputPins.toString());
      } else if (isCreate) {
        setErrorMessage(TL.t('initial.error.pin'));
        setTimeout(clearPins, 2000);
      } else {
        setPin(verifyPins.toString());
      }
    }
  }, [inputPins, verifyPins]);

  const clearPins = useCallback(() => {
    setInputPins(new Array(6).fill(''));
    setVerifyPins(new Array(6).fill(''));
    setErrorMessage(undefined);
  }, []);

  const title = useMemo(() => {
    if (isCreate) {
      if (isConfirmPwd) {
        return TL.t('initial.password.create');
      } else {
        return TL.t('initial.password.onemore');
      }
    } else {
      return TL.t('initial.password.verify');
    }
  }, [isCreate, isConfirmPwd]);

  const entered = useCallback(
    (index: number) => {
      if (isConfirmPwd) {
        return inputPins?.[index] ? true : false;
      } else {
        return verifyPins?.[index] ? true : false;
      }
    },
    [inputPins, verifyPins, isConfirmPwd],
  );

  const setPins = useCallback(
    (pins: number[]) => {
      let newPins = isConfirmPwd ? inputPins : verifyPins;
      newPins.forEach((pin, index) => {
        if (pins?.[index]) {
          newPins[index] = pins[index].toString();
        } else {
          newPins[index] = '';
        }
      });
      if (isConfirmPwd) {
        setInputPins([...newPins]);
      } else {
        setVerifyPins([...newPins]);
      }
    },
    [inputPins, verifyPins],
  );

  return (
    <View style={styles.container}>
      <Text text50L center>
        {title}
      </Text>
      <View style={styles.pinBox}>
        <View style={styles.pincodes}>
          {pinArray?.map((pin, index) => {
            return <Pin key={`${index}${pin}`} entered={entered(index)} />;
          })}
        </View>
        {errorMessage && (
          <Text text70 center color={Colors.Red} style={styles.error}>
            {errorMessage}
          </Text>
        )}
      </View>
      <Keypad setNumbers={setPins} limit={6} />
    </View>
  );
};

export default PinInput;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  pin: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.PointColor,
  },
  pincodes: {
    flexDirection: 'row',
    alignSelf: 'center',
  },
  disabled: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: Colors.Light1,
  },
  pinBox: {
    height: Constants.WINDOW_HEIGHT / 20 + 13,
  },
  error: {
    marginTop: 10,
  },
});
