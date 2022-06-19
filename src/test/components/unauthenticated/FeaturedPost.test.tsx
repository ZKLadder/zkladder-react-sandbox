import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { RecoilRoot } from 'recoil';
import FeaturedPost from '../../../components/unauthenticated/FeaturedPost';

describe('ProjectBox tests', () => {
  test('It renders', async () => {
    render(
      <RecoilRoot>
        <FeaturedPost
          post={{
            id: '12345',
            postTitle: 'MOCK POST',
            imageCaption: 'MOCK CAPTION',
            mainImage: { url: 'mainImage' },
            secondaryImage: { url: 'secondaryImage' },
            subTitle: 'MOCK SUB TITLE',
            fullDescription: 'MOCK FULL DESCRIPTION',
            postUrl: 'MOCK URL',
          }}
        />
      </RecoilRoot>,
    );

    await waitFor(() => {
      expect(screen.getByText('MOCK POST')).toBeVisible();
      expect(screen.getByText('MOCK CAPTION')).toBeVisible();
      expect(screen.getByText('MOCK FULL DESCRIPTION')).toBeVisible();
      expect(screen.getByTestId('mainImage')).toHaveAttribute('src', 'mainImage');
      expect(screen.getByTestId('secondaryImage')).toHaveAttribute('src', 'secondaryImage');
    });
  });
});
