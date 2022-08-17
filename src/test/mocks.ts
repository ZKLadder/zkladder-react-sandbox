import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

const mockMemberNftInstance = {
  address: '0xmockNFTaddress',

  getCollectionMetadata: jest.fn(),
  totalSupply: jest.fn(),
  isTransferrable: jest.fn(),
  royaltyBasis: jest.fn(),
  beneficiaryAddress: jest.fn(),
  getRoleMembers: jest.fn(),
  getToken: jest.fn(),
  signMintVoucher: jest.fn(),
  getTiers: jest.fn(),

  // transactions
  grantRole: jest.fn(),
  revokeRole: jest.fn(),
  setContractUri: jest.fn(),
  setRoyalty: jest.fn(),
  setBeneficiary: jest.fn(),
  setIsTransferrable: jest.fn(),
  addTiers: jest.fn(),
  updateTiers: jest.fn(),
  mintTo: jest.fn(),
};

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

export { mockMemberNftInstance, RecoilObserver };
