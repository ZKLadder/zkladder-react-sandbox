import signAuthKey from '../../utils/signAuthKey';

Object.defineProperty(window, 'Date', {
  configurable: true,
  writable: true,
  value: { now: () => (123456789) },
});

describe('signAuthKey tests', () => {
  test('signAuthKey returns a correctly formatted string', async () => {
    const jsonContents = JSON.stringify({
      domain: {
        name: 'zkladder.com',
        version: '1',
      },
      message: {
        content: 'Hello from your friends at ZKLadder. Please accept this signature request to get started',
        timestamp: 123456789,
      },
      types: {
        message: [
          { name: 'content', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
      primaryType: 'message',
    });

    const mockRequest = jest.fn();
    const provider = { request: mockRequest };

    mockRequest.mockResolvedValue('0xMockSignature');

    const result = await signAuthKey(provider, '0xmockAddress');

    expect(mockRequest).toHaveBeenCalledWith({
      method: 'eth_signTypedData',
      params: [
        '0xmockAddress',
        jsonContents,
      ],
    });

    expect(result).toEqual(Buffer.from(`${jsonContents}_0xMockSignature`).toString('base64'));
  });

  test('signAuthKey returns a correctly formatted string with Metamask provider', async () => {
    const jsonContents = JSON.stringify({
      domain: {
        name: 'zkladder.com',
        version: '1',
      },
      message: {
        content: 'Hello from your friends at ZKLadder. Please accept this signature request to get started',
        timestamp: 123456789,
      },
      types: {
        message: [
          { name: 'content', type: 'string' },
          { name: 'timestamp', type: 'uint256' },
        ],
      },
      primaryType: 'message',
    });

    const mockRequest = jest.fn();
    const provider = { request: mockRequest, isMetaMask: true };

    mockRequest.mockResolvedValue('0xMockSignature');

    const result = await signAuthKey(provider, '0xmockAddress');

    expect(mockRequest).toHaveBeenCalledWith({
      method: 'eth_signTypedData_v4',
      params: [
        '0xmockAddress',
        jsonContents,
      ],
    });

    expect(result).toEqual(Buffer.from(`${jsonContents}_0xMockSignature`).toString('base64'));
  });
});
