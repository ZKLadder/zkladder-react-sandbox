const shortenAddress = (address: string) => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length, address.length - 4)}`;
};

const weiToEth = (balance: number) => parseFloat((balance / 10 ** 18).toFixed(4));

export { shortenAddress, weiToEth };
