const shortenAddress = (address: string) => {
  if (!address || address.length < 10) return address;
  return `${address.substring(0, 6)}...${address.substring(address.length, address.length - 4)}`;
};

const weiToEth = (balance: number) => parseFloat((balance / 10 ** 18).toFixed(4));

/* eslint-disable no-bitwise */
const hashString = (dataUrl:string) => {
  let hash = 0;

  for (let i = 0; i < dataUrl.length; i += 1) {
    const char = dataUrl.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash &= hash;
  }
  return hash;
};

const isValidUrl = (url:string) => {
  const inputElement = document.createElement('input');
  inputElement.type = 'url';
  inputElement.value = url;

  if (!inputElement.checkValidity()) {
    return false;
  }
  return true;
};

export {
  shortenAddress, weiToEth, hashString, isValidUrl,
};
