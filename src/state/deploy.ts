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
      external_link: '',
      image: undefined,
      script: undefined,
    },
  } as NewDeploymentStateInterface,
  dangerouslyAllowMutability: true,
}));

export { deployState };
