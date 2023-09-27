import React, { FC } from 'react';
import { SectionList, SectionListData, StyleSheet, TextInput, Pressable, ListRenderItem, Touchable } from 'react-native';
import Colors from '@constants/colors';
import { Text, View, } from 'react-native-ui-lib';
import Constants from '@constants/app';
import TL from '@translate/index';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'types/navigation'

type SettingsNavigationProp = NativeStackNavigationProp<RootStackParamList['APP']['Settings'], 'SettingScreen'>;

type SettingsScreenRouteProp = RouteProp<RootStackParamList['APP']['Settings'], 'SettingScreen'>;

type Props = {
  navigation: SettingsNavigationProp
  route: SettingsScreenRouteProp
}

type SettingItem = {
  text?: string;
  icon?: string;
  action?: () => void;
};

const SettingList: FC<Props> = ( ) => {
  const navigation = useNavigation<SettingsNavigationProp>();
  const manages = [
    {
      text: TL.t('setting.wallet.manage_wallet'),
      icon: '',
      action: () => navigation.navigate('ManageWallet'),
      // action: () => navigation.navigate('Detail'),
    }, 
    {
      text: TL.t('setting.wallet.manage_token'),
      icon: '',
      action: () => navigation.navigate('ManageToken'),
    },
  ]

  const assets = [
    {
      text: TL.t('setting.asset.send'),
      icon: '',
      action: () => navigation.navigate('Send'),
    }, 
    {
      text: TL.t('setting.asset.receive'),
      icon: '',
      action: () => navigation.navigate('Receive'),
    }, 
    {
      text: TL.t('setting.asset.send_nft'),
      icon: '',
      action: () => navigation.navigate('SendNFT'),
    }, 
    {
      text: TL.t('setting.asset.transactions'),
      icon: '',
      action: () => navigation.navigate('Transactions'),
    },
  ]

  const securities = [
    {
      text: TL.t('setting.security.password'),
      icon: '',
      action: () => navigation.navigate('Password'),
    }, 
    {
      text: TL.t('setting.security.connected_site'),
      icon: '',
      action: () => navigation.navigate('ConnectedSite'),
    },
  ]
  const settings = [
    {
      text: TL.t('setting.setting.currency'),
      icon: '',
      action: () => navigation.navigate('Currency'),
    }, 
    {
      text: TL.t('setting.setting.language'),
      icon: '',
      action: () => navigation.navigate('Language'),
    }, 
    {
      text: TL.t('setting.setting.notification'),
      icon: '',
      action: () => navigation.navigate('Notification'),
    },
  ]
  const supports = [
    {
      text: TL.t('setting.support.faq'),
      icon: '',
      action: () => navigation.navigate('FAQ'),
    }, 
    {
      text: TL.t('setting.support.website'),
      icon: '',
      action: () => navigation.navigate('Website'),
    }, 
    {
      text: TL.t('setting.support.contact_feedback'),
      icon: '',
      action: () => navigation.navigate('ContactFeedback'),
    },
  ]

  const renderItem: ListRenderItem<SettingItem> = ({ item }) => {
    if(!item) return null
    return (
      <View  style={styles.item}>
        <Text text70BO onPress={item.action}>{item.icon}{item.text}</Text>
        </View>
      // </TouchableOpacity>
    )
  }

  const renderSectionHeader = ({ 
    section 
  }: { 
    section: SectionListData<SettingItem, { title: string }>
  }) => {
    if (section.title === 'Settings') return null;
    return (
      <Text text50BO style={{marginVertical: 20}}>{section.title}</Text>
    )
  }

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
    }
  ]

  return (
    <SectionList
      sections={sections}
      renderSectionHeader={renderSectionHeader}
      keyExtractor={(index) => index.toString()}
      // keyExtractor={keyExtractor}
      renderItem={renderItem}
      
      stickySectionHeadersEnabled={false}
      showsVerticalScrollIndicator={false}
    />
  );
};

const TextField = () => {
  return (
    <TextInput
      returnKeyType='search'
      placeholder='⌥ Search for features'
      style={styles.input} />
  );
};

const SettingScreen = () => {
  return (
    <View style={styles.outline} useSafeArea>
      <View style={styles.container}>
      <Text grey40 text50BO>{TL.t('setting.top.all')}</Text>
        <TextField/>
        <SettingList navigation={useNavigation()} route={useRoute()}/>
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.White,
    paddingHorizontal: Constants.PAGE_M1,
  },
  outline: {
    flex: 1,
  },
  item: {
    backgroundColor: Colors.White,
    padding: 10,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
    marginLeft: 10,
    marginTop: 20,
  },
  input: {
    backgroundColor: Colors.Light0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginHorizontal: 10,
    marginVertical: 40,
    fontSize: 18,
  }
});

export default SettingScreen;
