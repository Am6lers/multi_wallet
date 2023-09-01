import {
  EvmNft,
  EvmNftTransfer,
  GetWalletNFTTransfersResponse,
  GetWalletNFTTransfersResponseAdapter,
  GetWalletNFTsResponseAdapter,
} from '@moralisweb3/common-evm-utils';
import Moralis from 'moralis/.';
import React, { useEffect, useState } from 'react';
import engine from '@core/engine';
import { ListItem, Text, View } from 'react-native-ui-lib';
import { FlatList, Image, StyleSheet } from 'react-native';
import Constants from '@constants/app';

const NftList = () => {
  const { PreferencesController } = engine.context;
  const [nfts, setNfts] = useState<EvmNft[]>([]);
  const [nftTransfers, setNftTransfers] = useState<EvmNftTransfer[]>([]);

  useEffect(() => {
    nfts.length <= 0 && getNftData();
  }, []);

  const getNftData = async () => {
    const nftsResponse: GetWalletNFTsResponseAdapter =
      await Moralis.EvmApi.nft.getWalletNFTs({
        chain: '0x5',
        address: PreferencesController.getSelectedAddress(),
      });
    setNfts(nftsResponse?.result ?? []);
    // const nftsTransfersResponse: GetWalletNFTTransfersResponseAdapter =
    //   await Moralis.EvmApi.nft.getWalletNFTTransfers({
    //     chain: '0x1',
    //     format: 'decimal',
    //     direction: 'both',
    //     address: PreferencesController.getSelectedAddress(),
    //   });
    // console.log('setNftTransfers', nftsTransfersResponse?.result);
    // setNftTransfers(nftsTransfersResponse?.result);
  };

  const renderItem = ({ item }: { item: EvmNft }) => {
    console.log('nftsResponse item', item);
    return (
      <View style={styles.item}>
        <ListItem
          style={styles.itemContainer}
          onPress={() => console.log('pressed')}
        >
          <Image source={{ uri: item.tokenUri }} style={styles.image} />
          <Text grey10 text60L marginL-10>
            {item.chain.name}
          </Text>
          <Text grey10 text60L marginL-10>
            {item.name || 'unknown'}
          </Text>
        </ListItem>
      </View>
    );
  };

  return (
    <FlatList
      data={nfts ? nfts : []}
      renderItem={renderItem}
      keyExtractor={(item, index) => `${item.tokenUri}-${index}`}
    />
  );
};

export default React.memo(NftList);

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 60,
    width: '100%',
    padding: 10,
  },
  image: {
    width: Constants.WINDOW_WIDTH / 10,
    height: Constants.WINDOW_WIDTH / 10,
    marginRight: 10,
    borderRadius: 20,
  },
  text: {
    fontSize: 16,
  },
  item: {
    marginHorizontal: 10,
    paddingVertical: 10,
    borderBottomWidth: 1,
    justifyContent: 'center',
  },
});
