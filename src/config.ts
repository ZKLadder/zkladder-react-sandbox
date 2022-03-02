export default {
  api: {
    url: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
  },
  ipfs: {
    projectId: process.env.REACT_APP_INFURA_IPFS_ID as string,
    projectSecret: process.env.REACT_APP_INFURA_IPFS_SECRET as string,
  },
  zkl: {
    memberNft: process.env.REACT_APP_MEMBER_NFT || '0xa2667DEe29136B840E19CF1198eF1e9a0A609EB0',
    memberSketchCid: process.env.REACT_APP_MEMBER_SKETCH || 'https://bafkreigu6uen66hb3hp2zgmd66odboslapbzxfjgrefgoc7saqwseu6uri.ipfs.infura-ipfs.io',
    memberNftChainId: process.env.REACT_APP_MEMBER_CHAINID || '4',
  },
};
