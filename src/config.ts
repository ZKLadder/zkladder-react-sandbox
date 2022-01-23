export default {
  api: {
    url: process.env.REACT_APP_ZKL_API || 'http://zkladder.us-east-1.elasticbeanstalk.com/api',
  },
  ipfs: {
    projectId: process.env.REACT_APP_INFURA_IPFS_ID,
    projectSecret: process.env.REACT_APP_INFURA_IPFS_SECRET,
  },
};
