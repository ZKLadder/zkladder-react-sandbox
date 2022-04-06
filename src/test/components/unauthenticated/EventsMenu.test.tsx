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
              {
                title: 'Title 2',
                date: '2022-12-29T12:00:00+05:00',
                description: 'Description 2',
                image: {
                  url: 'https://www.fillmurray.com/200/300',
                  fileName: 'murray2.jpg'
                }
              },
              {
                title: 'Title 3',
                date: '2022-12-30T12:00:00+05:00',
                description: 'Description 3',
                image: {
                  url: 'https://www.fillmurray.com/200/300',
                  fileName: 'murray3.jpg'
                }
              },
              {
                title: 'Title 4',
                date: '2022-12-31T12:00:00+05:00',
                description: 'Description 4',
                image: {
                  url: 'https://www.fillmurray.com/200/300',
                  fileName: 'murray4.jpg'
                }
              }
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

      expect(screen.getByText('TITLE 2')).toBeVisible();
      expect(screen.getByText('THU DEC 29')).toBeVisible();
      expect(screen.getByAltText('murray2.jpg')).toBeVisible();

      expect(screen.getByText('TITLE 3')).toBeVisible();
      expect(screen.getByText('FRI DEC 30')).toBeVisible();
      expect(screen.getByAltText('murray3.jpg')).toBeVisible();

      expect(screen.getByText('TITLE 4')).toBeVisible();
      expect(screen.getByText('SAT DEC 31')).toBeVisible();
      expect(screen.getByAltText('murray4.jpg')).toBeVisible();
    })
  })

  test('Renders Error message when API call fails', async () => {
    const mocks = [
      {
        request: {
          query: EVENTS,
        },
        result: {
          data: null,
        }
      }
    ];

    render(
      <MockedProvider mocks={mocks}>
        <EventsMenu />
      </MockedProvider>
    );
    await waitFor(() => {
      expect(screen.getByText('Error: Response not successful: Received status code 400')).toBeVisible();
    })
  })
});
