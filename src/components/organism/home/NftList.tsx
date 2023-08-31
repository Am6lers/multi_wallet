import {
  EvmNft,
  GetWalletNFTTransfersResponseAdapter,
  GetWalletNFTsResponseAdapter,
} from '@moralisweb3/common-evm-utils';
import Moralis from 'moralis/.';
import React, { useEffect } from 'react';
import engine from '@core/engine';
import { Text, View } from 'react-native-ui-lib';
import { FlatList, Image, StyleSheet } from 'react-native';

const NftList = () => {
  const { PreferencesController } = engine.context;
  const [nfts, setNfts] = React.useState<EvmNft[]>();

  useEffect(() => {
    !nfts && getNftData();
  }, []);

  const getNftData = async () => {
    // const nftsTransfersResponse: GetWalletNFTTransfersResponseAdapter =
    //   await Moralis.EvmApi.nft.getWalletNFTTransfers({
    //     chain: '0x5',
    //     format: 'decimal',
    //     direction: 'both',
    //     address: PreferencesController.getSelectedAddress(),
    //   });
    const nftsResponse: GetWalletNFTsResponseAdapter =
      await Moralis.EvmApi.nft.getWalletNFTs({
        chain: '0x5',
        address: PreferencesController.getSelectedAddress(),
      });
    setNfts(nftsResponse?.result);
    console.log('nftsResponse', nftsResponse.result);
  };

  const renderItem = ({ item }: { item: EvmNft }) => {
    console.log('nftsResponse item', item.tokenUri);
    const name = item.name;
    return (
      <View style={styles.itemContainer}>
        <Image source={{ uri: item.tokenUri }} style={styles.image} />
        <Text style={styles.text}>{item.name || 'Unknown'}</Text>
      </View>
    );
  };

  return (
    <FlatList
      data={nfts ? nfts.result : []}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
    />
  );
};

export default NftList;

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 80,
    width: '100%',
    padding: 10,
  },
  image: {
    width: 60,
    height: 60,
    marginRight: 10,
  },
  text: {
    fontSize: 16,
  },
});
