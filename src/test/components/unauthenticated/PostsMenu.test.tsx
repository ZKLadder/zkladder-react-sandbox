import React from 'react';
import axios from 'axios';
import { QueryClientProvider, QueryClient } from 'react-query';
import {
  render,
  screen,
  waitFor,
  cleanup,
} from '@testing-library/react';
import PostsMenu from '../../../components/unauthenticated/PostsMenu';

jest.mock('axios', () => jest.fn());
const mockAxios = axios as jest.Mocked<any>;

describe('Posts Menu component', () => {
  afterEach(cleanup);
  beforeEach(() => jest.clearAllMocks());

  const client = new QueryClient();

  test('Renders component with Loading message', async () => {
    render(
      <QueryClientProvider client={client}>
        <PostsMenu />
      </QueryClientProvider>,
    );

    expect(screen.getByRole('status')).toBeVisible();
  });

  test('Makes Successful API Call and renders it', async () => {
    mockAxios.mockResolvedValueOnce({
      data: {
        data: {
          postCategories: [
            {
              name: 'Featured DAO',
              id: '1',
              posts: [
                {
                  id: '1',
                  title: 'Title 1',
                  subHeadline: 'Sub-Headline 1',
                  fullDescription: 'Description 1',
                  images: [
                    {
                      url: 'https://www.fillmurray.com/200/300',
                      fileName: 'murray1.jpg',
                    },
                    {
                      url: 'https://www.fillmurray.com/200/300',
                      fileName: 'murray2.jpg',
                    },
                  ],
                  slug: 'title-1',
                  text: {
                    markdown: 'This is the text',
                  },
                },
              ],
            },
          ],
        },
      },
    });

    render(
      <QueryClientProvider client={client}>
        <PostsMenu />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('FEATURED DAO')).toBeVisible();
      expect(screen.getByText('TITLE 1')).toBeVisible();
      expect(screen.getByText('SUB-HEADLINE 1')).toBeVisible();
      expect(screen.getByText('Description 1')).toBeVisible();
      expect(screen.getByAltText('murray1.jpg')).toBeVisible();
    });
  });

  test('Renders Error message when API call fails', async () => {
    mockAxios.mockRejectedValueOnce(new Error('Request failed with status code 400'));

    render(
      <QueryClientProvider client={client}>
        <PostsMenu />
      </QueryClientProvider>,
    );
    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeVisible();
      expect(screen.getByText('Request failed with status code 400')).toBeVisible();
    });
  });
});
