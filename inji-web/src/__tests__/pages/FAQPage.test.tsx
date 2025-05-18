import React from 'react';
import { screen} from '@testing-library/react';
import { FAQPage } from '../../pages/FAQPage';
import { renderWithRouter,mockusei18n } from '../../test-utils/mockUtils';

mockusei18n();
describe('Testing the Layout of FaqPage', () => {
  test('Check if the layout is matching with the snapshots', () => {
    const { asFragment } = renderWithRouter(<FAQPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Testing the Functionality of FaqPage', () => {
  beforeEach(()=>{
    mockusei18n();
  })
  test('Check if NavBar title is rendered correctly', () => {
    renderWithRouter(<FAQPage />);
    expect(screen.getByTestId('NavBar-Text')).toHaveTextContent('Faq');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
