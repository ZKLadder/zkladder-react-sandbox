import React from 'react';
import { MockedProvider } from '@apollo/client/testing';
import EventsMenu, { EVENTS } from '../../../components/unauthenticated/EventsMenu';
import { render, screen, waitFor, cleanup } from '@testing-library/react';

describe('Events Menu component', () => {
  afterEach(cleanup);

  test('Renders component with Loading message', async () => {
    render(
      <MockedProvider>
        <EventsMenu />
      </MockedProvider>
    );

    expect(screen.getByText("Loading...")).toBeVisible();
  })

  test('Makes Successful API Call', async () => {
    const mocks = [
      {
        request: {
          query: EVENTS,
        },
        result: {
          data: {
            events: [
              {
                title: 'Title 1',
                date: '2022-12-28T12:00:00+05:00',
                description: 'Description 1',
                image: {
                  url: 'https://www.fillmurray.com/200/300',
                  fileName: 'murray1.jpg'
                }
              },
            ]
          }
        }
      }
    ];

    render(
      <MockedProvider mocks={mocks}>
        <EventsMenu />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('TITLE 1')).toBeVisible();
      expect(screen.getByText('WED DEC 28')).toBeVisible();
      expect(screen.getByAltText('murray1.jpg')).toBeVisible();
    })
  })

  test('Renders Error message when API call fails', async () => {
    const mockError = [
      {
        request: {
          query: EVENTS,
        },
        error: new Error('Response not successful: Received status code 400'),
      }
    ];

    render(
      <MockedProvider mocks={mockError}>
        <EventsMenu />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Error: Response not successful: Received status code 400')).toBeVisible();
    })
  })
});
