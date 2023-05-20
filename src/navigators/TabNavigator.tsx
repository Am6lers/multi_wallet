import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { ReactElement, useMemo } from 'react';
import Main from '@pages/main';
import Setting from '@pages/setting';
import Icon from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator initialRouteName="Main">
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          tabBarIcon: () => <Icon name="wallet" size={32} color="gray" />,
          tabBarStyle: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      />
      <Tab.Screen
        name="Setting"
        component={Setting}
        options={{
          tabBarIcon: () => (
            <Icon name="settings-sharp" size={32} color="gray" />
          ),
          tabBarStyle: {
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          },
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;
