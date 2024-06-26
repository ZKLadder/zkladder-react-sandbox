export default {
  api: {
    url: process.env.REACT_APP_ZKL_API || 'https://api.zkladder.com/api',
    infuraApiKey: process.env.REACT_APP_INFURA_API_KEY as string,
  },
  ipfs: {
    projectId: process.env.REACT_APP_INFURA_IPFS_ID as string,
    projectSecret: process.env.REACT_APP_INFURA_IPFS_SECRET as string,
  },
  zkl: {
    memberNft: process.env.REACT_APP_MEMBER_NFT || '0xa5Cf9B89e11B0fAa5123882eDd4358726B443B31',
    memberSketchCid: process.env.REACT_APP_MEMBER_SKETCH || 'https://zkladder.infura-ipfs.io/ipfs/bafkreictkdrnutsrtuwkm5pbdvz5shgdkzs647vq3ggis2klx2l5zauwve',
    memberNftChainId: process.env.REACT_APP_MEMBER_CHAINID || '137',
  },
  cms: {
    url: process.env.GRAPH_CMS_ENDPOINT || 'https://api-us-east-1.graphcms.com/v2/cl12mkshi8t8s01za53ae9b2y/master',
  },
};
