import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';

const mockMemberNftInstance = {
  getCollectionMetadata: jest.fn(),
  totalSupply: jest.fn(),
  isTransferrable: jest.fn(),
  royaltyBasis: jest.fn(),
  beneficiaryAddress: jest.fn(),
  getRoleMembers: jest.fn(),
  getToken: jest.fn(),
  signMintVoucher: jest.fn(),

  // transactions
  grantRole: jest.fn(),
  setContractUri: jest.fn(),
  setRoyalty: jest.fn(),
  setBeneficiary: jest.fn(),
  setIsTransferrable: jest.fn(),
};

function RecoilObserver({ node, onChange }:{node:any, onChange:any}) {
  const value = useRecoilValue(node);
  useEffect(() => onChange(value), [onChange, value]);
  return null;
}

export { mockMemberNftInstance, RecoilObserver };
