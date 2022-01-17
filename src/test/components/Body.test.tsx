/* eslint-disable */
import React from 'react';
import { RecoilRoot } from 'recoil';
import { render, screen, waitFor } from '@testing-library/react';
import Body from '../../components/Body';
import { walletState } from '../../state/wallet';

const initializeState = (settings:any) => {
  settings.set(walletState, { isConnected: true });
};

// @TODO Refactor test suite when routing is added
describe('Body component tests', () => {
  test('Empty test', async () => {});
});
