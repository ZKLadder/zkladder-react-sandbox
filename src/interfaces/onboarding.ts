import { MemberNft } from '@zkladder/zkladder-sdk-ts';

interface MintVoucher {
  balance:number,
  contractAddress:string,
  userAddress: string,
  signedVoucher:{
    minter:string,
    balance:number,
    signature:string
  }
}

interface MintConfirmation{
  contractAddress:string,
  userAddress:string,
  membership: string,
  tokenId:number,
  txHash:string
}

interface OnboardingStateInterface {
  currentStep:number,
  userSignature:string,
  zklMemberNft: MemberNft,
  mintVoucher:MintVoucher,
  mintConfirmation: MintConfirmation,
  attestationHash: number,
  p5Sketch:{sketch:string}
}

export type { OnboardingStateInterface };
