const getFormattedJson = () => JSON.stringify({
  domain: {
    name: 'zkladder.com',
    version: '1',
  },
  message: {
    content: 'Hello from your friends at ZKLadder. Please accept this signature request to get started',
    timestamp: Date.now(),
  },
  types: {
    message: [
      { name: 'content', type: 'string' },
      { name: 'timestamp', type: 'uint256' },
    ],
  },
  primaryType: 'message',
});

export default async (provider:any, address:string) => {
  const contents = getFormattedJson();
  const signature = await provider.request({
    method: 'eth_signTypedData_v4',
    params: [
      address,
      contents,
    ],
  });

  // Return as b64 string as defined by ZKL API
  // @TODO Add link to API docs
  return Buffer.from(`${contents}_${signature}`).toString('base64');
};
