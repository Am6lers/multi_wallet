import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { ReactElement, useMemo } from 'react';
import Main from '@pages/main';
import Setting from '@pages/setting';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Main">
      <Tab.Screen name="Main" component={Main} />
      <Tab.Screen name="Setting" component={Setting} />
    </Tab.Navigator>
  );
};

export default TabNavigator;
