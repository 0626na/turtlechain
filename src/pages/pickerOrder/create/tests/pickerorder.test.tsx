import React from 'react';
import { PageHeader } from '@layout/page';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { MemoryRouter as Router } from 'react-router-dom';
import { RecoilRoot } from 'recoil';
import '@testing-library/jest-dom/extend-expect';
import PageBody from '../PageBody';

describe('pickerorder page 테스트', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation((query) => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(), // deprecated
        removeListener: jest.fn(), // deprecated
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
      })),
    });
  });
  test('pageHeader 테스트', () => {
    const queryClient = new QueryClient();

    render(
      <Router>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <PageHeader title="발주등록" />
          </QueryClientProvider>
        </RecoilRoot>
      </Router>,
    );

    expect(screen.getByText('발주등록')).toBeInTheDocument();
  });

  test('pageBody 테스트', () => {
    const queryClient = new QueryClient();
    render(
      <Router>
        <RecoilRoot>
          <QueryClientProvider client={queryClient}>
            <PageBody />
          </QueryClientProvider>
        </RecoilRoot>
      </Router>,
    );

    expect(screen.getByText('발주서 설정')).toBeInTheDocument();
  });
});
