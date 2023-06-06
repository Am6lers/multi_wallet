import { ParamListBase, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import InputPin from '@components/PinInput';
import Engine from '@core/engine';

interface PinInputProps {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
}

const PinInput = ({ page, setPage }: PinInputProps) => {
  const engine = Engine();
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const moveToNextStep = async () => {
    // const vault = await engine.CreateNewWallet('1235');
    // console.log('vault', vault);
    setPage(page + 1);
  };
  return <InputPin nextStepAction={moveToNextStep} />;
};

export default PinInput;
