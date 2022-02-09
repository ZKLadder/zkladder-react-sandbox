import { atom } from 'recoil';
import { OnboardingStateInterface } from '../interfaces/onboarding';

const onboardingState = atom(({
  key: 'onboardingState',
  default: { currentStep: 1 } as OnboardingStateInterface,
  dangerouslyAllowMutability: true,
}));

export { onboardingState };
