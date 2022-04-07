import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import PostsMenu, { POSTS } from '../../../components/unauthenticated/PostsMenu';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

describe('Posts Menu component', () => {
  afterEach(cleanup);

  test('Renders component with Loading message', async () => {
    render(
      <MockedProvider>
        <PostsMenu />
      </MockedProvider>
    );

    expect(screen.getByText("Loading...")).toBeVisible();
  })

  test('Makes Successful API Call', async () => {
    const mocks = [
      {
        request: {
          query: POSTS,
        },
        result: {
          data: {
            postCategories: [
              {
                name: 'Featured DAO',
                posts: [
                  {
                    id: '1',
                    title: 'Title 1',
                    subHeadline: 'Sub-Headline 1',
                    fullDescription: 'Description 1',
                    images: [
                      {
                        url: 'https://www.fillmurray.com/200/300',
                        fileName: 'murray1.jpg'
                      }
                    ],
                    slug: 'title-1',
                    text: 'This is the text'
                  }
                ]
              },
              {
                name: 'Latest News',
                posts: [
                  {
                    id: '2',
                    title: 'Title 2',
                    subHeadline: 'Sub-Headline 2',
                    fullDescription: 'Description 2',
                    images: [
                      {
                        url: 'https://www.fillmurray.com/200/300',
                        fileName: 'murray2.jpg'
                      }
                    ],
                    slug: 'title-2',
                    text: {
                      markdown: 'This is the text'
                    }
                  }
                ]
              }
            ]
          }
        }
      }
    ];

    render(
      <MockedProvider mocks={mocks}>
        <PostsMenu />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('FEATURED DAO')).toBeVisible();
      expect(screen.getByText('TITLE 1')).toBeVisible();
      expect(screen.getByText('SUB-HEADLINE 1')).toBeVisible();
      expect(screen.getByText('Description 1')).toBeVisible();
      expect(screen.getByAltText('murray1.jpg')).toBeVisible();

      expect(screen.getByText('LATEST NEWS')).toBeVisible();
      expect(screen.getByText('SUB-HEADLINE 2')).toBeVisible();
      expect(screen.getByAltText('murray2.jpg')).toBeVisible();
    })
  })

  test('Renders Error message when API call fails', async () => {
    const mockError = [
      {
        request: {
          query: POSTS,
        },
        error: new Error('Response not successful: Received status code 400')
      }
    ];

    render(
      <MockedProvider mocks={mockError}>
        <PostsMenu />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Error: Response not successful: Received status code 400')).toBeVisible();
    })
  })
});
