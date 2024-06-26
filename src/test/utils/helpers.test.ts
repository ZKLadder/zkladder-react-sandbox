/* eslint-disable no-loss-of-precision */
import {
  shortenAddress, weiToEth, hashString, isValidUrl, uid,
} from '../../utils/helpers';

const { v4 } = require('uuid');

jest.mock('uuid', () => ({
  v4: jest.fn(),
}));

const mockUUID = v4 as jest.Mocked<any>;

describe('shortenAddress', () => {
  test('shortenAddress functions as expected', () => {
    expect(shortenAddress('0x72d20C99db9d4FE13D0De2F8b0B6ba71B7c53163')).toStrictEqual('0x72d2...3163');
    expect(shortenAddress('0x6307D9f8Ce2040cFb21cA98AB7834888Eae0ea1D')).toStrictEqual('0x6307...ea1D');
    expect(shortenAddress('0xA983F8B561C4a70fBF3170e5dcF4ED5dEf040023')).toStrictEqual('0xA983...0023');
    expect(shortenAddress('0xc5F8949AB20e63B37Df6a7593Fbb32F9C5126321')).toStrictEqual('0xc5F8...6321');
  });

  test('shortenAddress is resilient against misformatted addresses', () => {
    expect(shortenAddress('123')).toStrictEqual('123');
    expect(shortenAddress('not an address')).toStrictEqual('not an...ress');
    expect(shortenAddress('123456789')).toStrictEqual('123456789');
    expect(shortenAddress('12345678901')).toStrictEqual('123456...8901');
  });
});

describe('weiToEth', () => {
  test('weiToEth functions as expected', () => {
    expect(weiToEth(12345678912345678)).toStrictEqual(0.0123);
  });
});

describe('hashString', () => {
  test('hashString functions as expected', () => {
    expect(hashString('12345678912345678')).toStrictEqual(1222314937);
  });
});

describe('isValidUrl', () => {
  test('isValidUrl functions as expected', () => {
    expect(isValidUrl('https://tirl.xyz')).toStrictEqual(true);
    expect(isValidUrl('https://abc.123')).toStrictEqual(true);
    expect(isValidUrl('http://www.zkladder.com')).toStrictEqual(true);
    expect(isValidUrl('notaurl')).toStrictEqual(false);
  });
});

describe('uid', () => {
  test('uid returns correct value', () => {
    // precomputed
    mockUUID.mockReturnValueOnce('7654321')
      .mockReturnValueOnce('1234567')
      .mockReturnValueOnce('auniquestring');

    expect(uid()).toStrictEqual(1130384588);
    expect(uid()).toStrictEqual(2018166324);
    expect(uid()).toStrictEqual(1509719549);
  });
});
