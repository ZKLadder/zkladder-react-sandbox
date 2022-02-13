import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import P5Sketch, { saveImage } from '../../../components/shared/P5Sketch';

const P5 = require('p5');

jest.mock('p5', () => (jest.fn()));

Object.defineProperty(document, 'getElementById', {
  configurable: true,
  writable: true,
  value: () => ({
    toDataURL: jest.fn(),
  }),
});

Object.defineProperty(window, 'fetch', {
  configurable: true,
  writable: true,
  value: () => ({
    blob: jest.fn(),
  }),
});

global.File = class MockFile {
  filename: string;

  constructor() {
    this.filename = 'mockFile';
  }
} as any;

describe('P5Sketch component tests', () => {
  test('It renders', async () => {
    P5.prototype.remove = jest.fn();
    render(<P5Sketch
      sketch="mockSketch"
      config={{
        mockProperty: 'mockValue',
      }}
    />);

    await waitFor(() => {
      expect(screen.getByTestId('canvas')).toBeInTheDocument();
      expect((window as any).mockProperty).toBe('mockValue');
    });
  });
});

describe('saveImage tests', () => {
  test('It renders', async () => {
    render(<P5Sketch
      sketch="mockSketch"
      config={{}}
    />);

    const file = await saveImage('fileName') as any;

    await waitFor(() => {
      expect(file?.filename).toBe('mockFile');
    });
  });
});
