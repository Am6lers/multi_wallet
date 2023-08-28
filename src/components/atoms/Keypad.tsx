import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, GridList, Spacings, View } from 'react-native-ui-lib';
import Colors from '@constants/colors';
import { StyleSheet } from 'react-native';
import Constants from '@constants/app';

const Keypad = ({
  setNumbers,
  limit = 6,
}: {
  setNumbers: (numbers: number[]) => void;
  limit?: number;
}) => {
  const [inputNumber, setInputNumbers] = useState<number[]>([]);
  const width = useMemo(() => Constants.WINDOW_WIDTH - 20, []);
  const keypads = [
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
  ];

  const onPress = useCallback(
    (num: number) => {
      let newNumbers: number[];
      if (num >= 0) {
        newNumbers = [...inputNumber, num];
        setInputNumbers(newNumbers);
      } else {
        newNumbers = inputNumber.slice(0, -1);
        setInputNumbers(newNumbers);
      }
      if (newNumbers.length < limit) {
        setNumbers(newNumbers);
      } else {
        setNumbers(newNumbers);
        setInputNumbers([]);
      }
    },
    [inputNumber],
  );

  return (
    <View>
      {keypads.map((pads, index) => {
        return (
          <GridList
            key={`${pads}+${index}`}
            data={pads}
            scrollEnabled={false}
            itemSpacing={0}
            containerWidth={width}
            renderItem={({ item, index }) => (
              <Button
                key={`${item}+${index}`}
                label={`${item}`}
                onPress={() => onPress(item)}
                backgroundColor={Colors.White}
                labelStyle={styles.buttonLabel}
                style={styles.button}
              />
            )}
          />
        );
      })}
      <GridList
        data={[-1, 0, -2]}
        scrollEnabled={false}
        itemSpacing={0}
        containerWidth={width}
        renderItem={({ item, index }) => (
          <Button
            key={`${item}+${index}`}
            label={`${item === -1 ? '' : item}`}
            onPress={() => onPress(item)}
            backgroundColor={Colors.White}
            labelStyle={styles.buttonLabel}
            style={styles.button}
            disabled={item === -1}
            disabledBackgroundColor={Colors.White}
          />
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  button: {
    height: Constants.WINDOW_HEIGHT / 8,
  },
  buttonLabel: {
    color: Colors.Dark,
  },
});

export default React.memo(Keypad);
