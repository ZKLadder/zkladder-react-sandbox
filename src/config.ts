export default {
  api: {
    url: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
  },
  ipfs: {
    projectId: process.env.REACT_APP_INFURA_IPFS_ID as string,
    projectSecret: process.env.REACT_APP_INFURA_IPFS_SECRET as string,
  },
  zkl: {
    memberNft: process.env.REACT_APP_MEMBER_NFT || '0xa5Cf9B89e11B0fAa5123882eDd4358726B443B31',
    memberSketchCid: process.env.REACT_APP_MEMBER_SKETCH || 'https://bafkreigczchei6lds3onuneunf3uk5664jkumdpxugmia5cdngtglr6aaa.ipfs.infura-ipfs.io',
    memberNftChainId: process.env.REACT_APP_MEMBER_CHAINID || '137',
  },
};
