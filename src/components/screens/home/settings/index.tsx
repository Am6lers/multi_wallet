import React from 'react';
import {
  SectionList,
  SectionListData,
  StyleSheet,
  ListRenderItem,
} from 'react-native';
import {
  Text,
  View,
  Colors,
  Spacings,
  BorderRadiuses,
  TextField,
} from 'react-native-ui-lib';
import Constants from '@constants/app';
import TL from '@translate/index';
import {
  ParamListBase,
  RouteProp,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SearchField from '@components/atoms/SearchField';
import Icon from 'react-native-vector-icons/FontAwesome6';

type SettingItem = {
  text?: string;
  icon: string;
  action?: () => void;
};

const renderItem: ListRenderItem<SettingItem> = ({ item, index }) => {
  return (
    <View left row marginV-5 padding-10 key={`${item.text}+${index}`}>
      <View paddingH-5>
        <Icon name={item.icon} size={30} color={Colors.black} />
      </View>
      <Text text70BO onPress={item.action}>
        {item.text}
      </Text>
    </View>
  );
};

const renderSectionHeader = ({
  section,
}: {
  section: SectionListData<SettingItem, { title: string }>;
}) => {
  return (
    <Text text50BO marginV-15 key={section.title}>
      {section.title}
    </Text>
  );
};

const SettingList = () => {
  const navigation = useNavigation<NativeStackNavigationProp<ParamListBase>>();
  const manages = [
    {
      text: TL.t('setting.wallet.token'),
      icon: 'coins',
      action: () => navigation.navigate('TokenList'),
    },
    {
      text: TL.t('setting.wallet.nft'),
      icon: 'coins',
      action: () => navigation.navigate('NFTList'),
    },
  ];

  const assets = [
    {
      text: TL.t('setting.asset.send_token'),
      icon: 'coins',
      action: () => navigation.navigate('SendToken'),
    },
    {
      text: TL.t('setting.asset.send_nft'),
      icon: 'coins',
      action: () => navigation.navigate('SendNFT'),
    },
    {
      text: TL.t('setting.asset.receive'),
      icon: 'coins',
      action: () => navigation.navigate('Receive'),
    },
    {
      text: TL.t('setting.asset.transactions'),
      icon: 'coins',
      action: () => navigation.navigate('Transactions'),
    },
  ];

  const securities = [
    {
      text: TL.t('setting.security.password'),
      icon: 'coins',
      action: () => navigation.navigate('Password'),
    },
    {
      text: TL.t('setting.security.connected_site'),
      icon: 'coins',
      action: () => navigation.navigate('ConnectedSite'),
    },
  ];
  const settings = [
    {
      text: TL.t('setting.setting.currency'),
      icon: 'coins',
      action: () => navigation.navigate('Currency'),
    },
    {
      text: TL.t('setting.setting.language'),
      icon: 'coins',
      action: () => navigation.navigate('Language'),
    },
    {
      text: TL.t('setting.setting.notification'),
      icon: 'coins',
      action: () => navigation.navigate('Notification'),
    },
  ];
  const supports = [
    {
      text: TL.t('setting.support.faq'),
      icon: 'coins',
      action: () => navigation.navigate('FAQ'),
    },
    {
      text: TL.t('setting.support.website'),
      icon: 'coins',
      action: () => navigation.navigate('Website'),
    },
    {
      text: TL.t('setting.support.contact_feedback'),
      icon: 'coins',
      action: () => navigation.navigate('ContactFeedback'),
    },
  ];

  const sections = [
    {
      title: TL.t('setting.content.wallet'),
      data: manages,
    },
    {
      title: TL.t('setting.content.asset'),
      data: assets,
    },
    {
      title: TL.t('setting.content.security'),
      data: securities,
    },
    {
      title: TL.t('setting.content.setting'),
      data: settings,
    },
    {
      title: TL.t('setting.content.support'),
      data: supports,
    },
  ];

  return (
    <SectionList
      sections={sections}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const SettingScreen = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
        <Text grey40 text50BO marginT-20>
          {TL.t('setting.top.all')}
        </Text>
        <SearchField text={'⌥ Search for features'} />
        <SettingList />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    flex: 1,
  },
});

export default SettingScreen;
