export default (
  chainId:number,
  name:string,
  contract:string,
  tokenUri:string,
  balance:number,
) => JSON.stringify({
  domain: {
    chainId,
    name,
    verifyingContract: contract,
    version: '1',
  },
  message: {
    tokenUri,
    balance,
  },
  types: {
    EIP712Domain: [
      { name: 'name', type: 'string' },
      { name: 'version', type: 'string' },
      { name: 'chainId', type: 'uint256' },
      { name: 'verifyingContract', type: 'address' },
    ],
    mintVoucher: [
      { name: 'tokenUri', type: 'string' },
      { name: 'balance', type: 'uint256' },
    ],
  },
  primaryType: 'mintVoucher',
});
