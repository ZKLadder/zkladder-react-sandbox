export default {
  api: {
    url: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
  },
  ipfs: {
    projectId: process.env.REACT_APP_INFURA_IPFS_ID as string,
    projectSecret: process.env.REACT_APP_INFURA_IPFS_SECRET as string,
  },
  zkl: {
    memberNft: process.env.REACT_APP_MEMBER_NFT || '0xaa331b70845b11f1afb0a566c566a2a16018558a',
    memberSketchCid: process.env.REACT_APP_MEMBER_SKETCH || 'https://bafkreigu6uen66hb3hp2zgmd66odboslapbzxfjgrefgoc7saqwseu6uri.ipfs.infura-ipfs.io',
    memberNftChainId: process.env.REACT_APP_MEMBER_CHAINID || '137',
  },
};
