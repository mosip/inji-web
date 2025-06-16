import {mockusei18n } from '../../../../test-utils/mockUtils';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../../../../components/User/CredentialTypes/Header';
import { IssuerWellknownDisplayArrayObject } from '../../../../types/data';
const mockBackClick = jest.fn();
const mockHomeClick = jest.fn();

const mockDisplayObject: IssuerWellknownDisplayArrayObject = {
  name: 'Issuer Display Name',
  description: 'Test description',
  language: 'en',
  locale: 'en-US',
  title: 'Issuer Title',
  logo: {
    url: 'https://example.com/logo.png',
    alt_text: 'Issuer Logo',
  },
};

jest.mock('../../../../components/Credentials/SearchCredential', () => ({
    SearchCredential: () => <div data-testid="search-credential" />,
}));

jest.mock('../../../../components/Common/Buttons/NavBackArrowButton', () => ({
    NavBackArrowButton: (props: { onBackClick?: () => void }) => (
        <button data-testid="back-button" onClick={props.onBackClick}>
        Back
        </button>
    ),
}));

jest.mock('../../../../components/Common/Buttons/TertiaryButton', () => ({
    TertiaryButton: (props: { onClick: () => void; title: string; testId: string }) => (
        <button data-testid={props.testId} onClick={props.onClick}>
        {props.title}
        </button>
    ),
}));

beforeEach(() => {
  jest.clearAllMocks();
  mockusei18n();
});

it('renders issuer name in the title', () => {
  render(
    <Header
      onBackClick={mockBackClick}
      onClick={mockHomeClick}
      displayObject={mockDisplayObject}
    />
  );

  const title = screen.getByTestId('Stored-Credentials');
  expect(title).toBeInTheDocument();
  expect(title).toHaveTextContent('Issuer Display Name');
});

it('renders and calls back button', () => {
  render(
    <Header
      onBackClick={mockBackClick}
      onClick={mockHomeClick}
      displayObject={mockDisplayObject}
    />
  );

  const backButton = screen.getByTestId('back-button');
  fireEvent.click(backButton);
  expect(mockBackClick).toHaveBeenCalled();
});

it('renders and calls home button', () => {
  render(
    <Header
      onBackClick={mockBackClick}
      onClick={mockHomeClick}
      displayObject={mockDisplayObject}
    />
  );

  const homeButton = screen.getByTestId('home');
  expect(homeButton).toHaveTextContent('Home');
  fireEvent.click(homeButton);
  expect(mockHomeClick).toHaveBeenCalled();
});

it('renders the SearchCredential component', () => {
  render(
    <Header
      onBackClick={mockBackClick}
      onClick={mockHomeClick}
      displayObject={mockDisplayObject}
    />
  );

  const search = screen.getByTestId('search-credential');
  expect(search).toBeInTheDocument();
});

it('renders empty name gracefully when displayObject is empty', () => {
  render(
    <Header
      onBackClick={mockBackClick}
      onClick={mockHomeClick}
      displayObject={{} as IssuerWellknownDisplayArrayObject}
    />
  );

  const title = screen.getByTestId('Stored-Credentials');
  expect(title).toBeInTheDocument();
  expect(title).toBeEmptyDOMElement();
});
