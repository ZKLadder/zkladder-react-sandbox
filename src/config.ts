export default {
  api: {
    url: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
  },
  ipfs: {
    projectId: process.env.REACT_APP_INFURA_IPFS_ID as string,
    projectSecret: process.env.REACT_APP_INFURA_IPFS_SECRET as string,
  },
  zkl: {
    memberNft: process.env.REACT_APP_MEMBER_NFT || '0x5fbdb2315678afecb367f032d93f642f64180aa3',
    memberSketchCid: process.env.REACT_APP_MEMBER_SKETCH || 'https://bafkreigu6uen66hb3hp2zgmd66odboslapbzxfjgrefgoc7saqwseu6uri.ipfs.infura-ipfs.io',
  },
};
