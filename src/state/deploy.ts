import { atom } from 'recoil';
import { NewDeploymentStateInterface } from '../interfaces/deploy';

const deployState = atom(({
  key: 'deployState',
  default: {
    currentStep: 1,
    config: {
      name: '',
      symbol: '',
      description: '',
      beneficiaryAddress: '',
      image: undefined,
      script: undefined,
    },
    roles: [{
      id: '',
      name: '',
      description: '',
      price: 0,
    }],
  } as NewDeploymentStateInterface,
  dangerouslyAllowMutability: true,
}));

export { deployState };
