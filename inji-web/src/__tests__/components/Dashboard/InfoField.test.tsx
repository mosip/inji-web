import { render, screen } from '@testing-library/react';
import { InfoField } from '../../../components/Dashboard/InfoField';

describe('InfoField component', () => {
  const defaultProps = {
    label: 'Email Address',
    value: 'user@example.com',
    testId: 'email',
  };

  it('renders without crashing', () => {
    render(<InfoField {...defaultProps} />);
    const container = screen.getByTestId('info-field');
    expect(container).toBeInTheDocument();
  });

  it('displays the correct label', () => {
    render(<InfoField {...defaultProps} />);
    const label = screen.getByTestId('label-email');
    expect(label).toBeInTheDocument();
    expect(label).toHaveTextContent('Email Address');
  });

  it('displays the correct value', () => {
    render(<InfoField {...defaultProps} />);
    const value = screen.getByTestId('value-email');
    expect(value).toBeInTheDocument();
    expect(value).toHaveTextContent('user@example.com');
  });

  it('renders the horizontal rule', () => {
    render(<InfoField {...defaultProps} />);
    const hr = screen.getByTestId('horizontal-rule-email');
    expect(hr).toBeInTheDocument();
  });
});
