import React from 'react';
import { screen} from '@testing-library/react';
import { HelpPage } from '../../pages/HelpPage';
import { renderWithRouter,mockusei18n } from '../../test-utils/mockUtils';

mockusei18n();
describe('Testing the Layout of HelpPage', () => {
  test('Check if the layout is matching with the snapshots', () => {
    const { asFragment } = renderWithRouter(<HelpPage />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Testing the Functionality of HelpPage', () => {
  beforeEach(()=>{
    mockusei18n();
  })
  test('Check if NavBar title is rendered correctly', () => {
    renderWithRouter(<HelpPage />);
    expect(screen.getByTestId('NavBar-Text')).toHaveTextContent('Help');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
