import React from 'react';
import axios from 'axios';
import { QueryClientProvider, QueryClient } from 'react-query';
import {
  render,
  screen,
  waitFor,
  cleanup,
} from '@testing-library/react';
import EventsMenu from '../../../components/unauthenticated/EventsMenu';

jest.mock('axios');
const mockAxios = axios as jest.Mocked<any>;

describe('Events Menu component', () => {
  afterEach(cleanup);
  beforeEach(() => jest.clearAllMocks());

  const client = new QueryClient();

  test('Renders component with Loading message', async () => {
    render(
      <QueryClientProvider client={client}>
        <EventsMenu />
      </QueryClientProvider>,
    );

    expect(screen.getByRole('status')).toBeVisible();
  });

  test('Makes Successful API Call', async () => {
    mockAxios.mockResolvedValueOnce({
      data: {
        data: {
          events: [
            {
              title: 'Title 1',
              date: '2022-12-28T12:00:00+05:00',
              description: 'Description 1',
              image: {
                url: 'https://www.fillmurray.com/200/300',
                fileName: 'murray1.jpg',
              },
            },
          ],
        },
      },
    });

    render(
      <QueryClientProvider client={client}>
        <EventsMenu />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByText('TITLE 1')).toBeVisible();
      expect(screen.getByText('WED DEC 28')).toBeVisible();
      expect(screen.getByAltText('murray1.jpg')).toBeVisible();
    });
  });

  test('Renders Error message when API call fails', async () => {
    mockAxios.mockRejectedValueOnce(new Error('Request failed with status code 400'));

    render(
      <QueryClientProvider client={client}>
        <EventsMenu />
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByRole('alert')).toBeVisible();
      expect(screen.getByText('Request failed with status code 400')).toBeVisible();
    });
  });
});
