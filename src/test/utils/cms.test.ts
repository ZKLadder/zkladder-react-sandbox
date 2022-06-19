import axios from 'axios';
import {
  getPosts,
} from '../../utils/cms';
import config from '../../config';

jest.mock('axios', () => ({ request: jest.fn() }));

const mockAxios = axios as jest.Mocked<any>;

describe('Generic ZKL API request wrapper', () => {
  test('Calls axios with the correct parameters', async () => {
    mockAxios.request.mockResolvedValueOnce('test');

    await getPosts();

    expect(mockAxios.request).toHaveBeenCalledWith({
      url: config.cms.url,
      method: 'post',
      data: {
        query: `query getPosts {
  posts {
    id
    postTitle
    postUrl
    publishedAt
    subTitle
    updatedAt
    secondaryImage {
      url
    }
    imageCaption
    fullDescription
    mainImage {
      url
    }
  }
}`,
      },
    });
  });

  test('Returns response data correctly', async () => {
    mockAxios.request.mockResolvedValueOnce({
      data: {
        data: {
          posts: 'MockData',
        },
      },
    });

    const response = await getPosts();

    expect(response).toStrictEqual('MockData');
  });

  test('Rethrows axios errors correctly', async () => {
    mockAxios.request.mockRejectedValueOnce({
      message: 'Not working',
      config: {
        method: 'get',
        baseURL: 'a/base/url',
        url: 'a/test/url',
      },
    });

    try {
      await getPosts();
      expect(true).toBe(false); // should be unreachable
    } catch (error) {
      expect(error).toStrictEqual(new Error('API error'));
    }
  });
});
