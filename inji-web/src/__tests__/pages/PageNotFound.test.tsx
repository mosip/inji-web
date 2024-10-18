import React from 'react';
import { screen, fireEvent } from '@testing-library/react';
import { PageNotFound } from '../../pages/PageNotFound';
import { renderWithRouter,mockusei18n} from '../../test-utils/mockUtils';

mockusei18n();
//todo : extract the local method to mockUtils, which is added to bypass the routing problems
// Mock the useNavigate hook
const mockNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}));

describe('Testing the Layout of PageNotFound', () => {
  test('Check the presence of the PageNotFound container', () => {
    const { asFragment } = renderWithRouter(<PageNotFound />);
    expect(asFragment()).toMatchSnapshot();
  });
});

describe('Testing the Functionality of PageNotFound', () => {
  test('Check if clicking the home button navigates to the home page', () => {
    renderWithRouter(<PageNotFound />);
    fireEvent.click(screen.getByTestId('PageNotFound-Home-Button'));
    expect(mockNavigate).toHaveBeenCalledWith('/');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
