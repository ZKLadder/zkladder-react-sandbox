import React from 'react';
import {
  render,
  screen,
  waitFor,
  cleanup,
} from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import { postsState } from '../../../state/cms';
import PostsMenu from '../../../components/unauthenticated/PostsMenu';

jest.mock('../../../components/unauthenticated/FeaturedPost', () => ({
  __esModule: true,
  default: () => <p>FEATURED POST</p>,
}));

const initializeState = (settings:any) => {
  settings.set(postsState, {
    loaded: true,
    error: '',
    posts: [
      'one', 'two', 'three', 'four', 'five',
    ],
  });
};

const initializeErrorState = (settings:any) => {
  settings.set(postsState, {
    loaded: true,
    error: 'An error has occured',
    posts: [],
  });
};

describe('Posts Menu component', () => {
  afterEach(cleanup);
  beforeEach(() => jest.clearAllMocks());
  beforeAll(() => {
    // Silence key prop error
    jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  test('It renders', async () => {
    render(
      <RecoilRoot initializeState={initializeState}>
        <PostsMenu />
      </RecoilRoot>,
    );

    expect(screen.getAllByText('FEATURED POST')).toHaveLength(5);
  });

  test('It renders an error', async () => {
    render(
      <RecoilRoot initializeState={initializeErrorState}>
        <PostsMenu />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('An error has occured')).toBeVisible();
    });
  });
});
