import ethereumLogo from '../images/networkLogos/ethereum-logo.png';
import polygonLogo from '../images/networkLogos/polygon-logo.png';

export default {
  1: {
    label: 'Ethereum Mainnet',
    token: 'ETH',
    id: '0x1',
    rpcUrl: 'https://mainnet.infura.io/v3/2d33fc4d9a9b4140b8582c1ef3bd12e8',
    blockExplorer: 'https://etherscan.io/tx/',
    logo: ethereumLogo,
  },
  3: {
    label: 'Ropsten',
    token: 'ROP',
    id: '0x3',
    rpcUrl: 'https://ropsten.infura.io/v3/2d33fc4d9a9b4140b8582c1ef3bd12e8',
    blockExplorer: 'https://ropsten.etherscan.io/tx/',
    logo: ethereumLogo,
  },
  4: {
    label: 'Rinkeby',
    token: 'RIN',
    id: '0x4',
    rpcUrl: 'https://rinkeby.infura.io/v3/2d33fc4d9a9b4140b8582c1ef3bd12e8',
    blockExplorer: 'https://rinkeby.etherscan.io/tx/',
    logo: ethereumLogo,
  },
  5: {
    label: 'Goerli',
    token: 'GOR',
    id: '0x5',
    rpcUrl: 'https://goerli.infura.io/v3/2d33fc4d9a9b4140b8582c1ef3bd12e8',
    blockExplorer: 'https://goerli.etherscan.io/tx/',
    logo: ethereumLogo,
  },
  137: {
    label: 'Polygon',
    token: 'MATIC',
    id: '0x89',
    rpcUrl: 'https://polygon-mainnet.infura.io/v3/2d33fc4d9a9b4140b8582c1ef3bd12e8',
    blockExplorer: 'https://polygonscan.com/tx/',
    logo: polygonLogo,
  },
  1337: {
    label: 'Ganache',
    token: 'LOCAL',
    id: '0x1691',
    rpcUrl: 'http://localhost:7545',
    logo: ethereumLogo,
  },
  31337: {
    label: 'Hardhat',
    token: 'TEST-ETH',
    id: '0x7A69',
    rpcUrl: 'http://localhost:8545',
    logo: ethereumLogo,
  },
};
