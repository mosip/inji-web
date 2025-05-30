import React from 'react';
import { render, screen } from '@testing-library/react';
import { InfoSection } from '../../../components/Common/InfoSection';

function MockIcon() {
    return <svg data-testid="mock-icon" />;
}

describe('InfoSection Component', () => {
  //TODO: Snapshot tests will be unskipped at last once UI is fully ready
  it.skip('should match snapshot with all props', () => {
    const { container } = render(
      <InfoSection
        title="Test Title"
        actionText="Test Action Text"
        icon={<MockIcon />}
      />
    );

    expect(container).toMatchSnapshot();
  });

  //TODO: Snapshot tests will be unskipped at last once UI is fully ready
  it.skip('should match snapshot with minimal props', () => {
    const { container } = render(
      <InfoSection actionText="Test Action Text Only" />
    );

    expect(container).toMatchSnapshot();
  });

  it('should render with all props', () => {
    render(
      <InfoSection
        title="Test Title"
        actionText="Test Action Text"
        icon={<MockIcon />}
      />
    );

    expect(screen.getByTestId('no-cards-stored')).toBeInTheDocument();
    expect(screen.getByTestId('No-Credentials-Title')).toHaveTextContent('Test Title');
    expect(screen.getByText('Test Action Text')).toBeInTheDocument();
    // The icon is present as part of the MockIcon component
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('should render only with actionText', () => {
    render(
      <InfoSection actionText="Only Action Text" />
    );

    expect(screen.getByTestId('no-cards-stored')).toBeInTheDocument();
    expect(screen.getByText('Only Action Text')).toBeInTheDocument();
    expect(screen.queryByTestId('No-Credentials-Title')).not.toBeInTheDocument();
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });

  it('should render only with title', () => {
    render(
      <InfoSection title="Only Title" />
    );

    expect(screen.getByTestId('no-cards-stored')).toBeInTheDocument();
    expect(screen.getByTestId('No-Credentials-Title')).toHaveTextContent('Only Title');
    expect(screen.queryByText('Test Action Text')).not.toBeInTheDocument();
    expect(document.querySelector('svg')).not.toBeInTheDocument();
  });

  it('should render only with icon', () => {
    render(
      <InfoSection icon={<MockIcon />} />
    );

    expect(screen.getByTestId('no-cards-stored')).toBeInTheDocument();
    expect(screen.queryByTestId('No-Credentials-Title')).not.toBeInTheDocument();
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('should apply correct styling to container', () => {
    render(<InfoSection actionText="Test Action" />);

    const container = screen.getByTestId('no-cards-stored');
    expect(container).toHaveClass('bg-white rounded-lg shadow-iw-emptyDocuments p-6 sm:p-8 md:p-10 flex flex-col items-center justify-center min-h-[500px] my-4 sm:my-8 md:my-16');
  });

  it('should apply correct styling to title', () => {
    render(<InfoSection title="Test Title" />);

    const title = screen.getByTestId('No-Credentials-Title');
    expect(title).toHaveClass('text-xl text-center sm:text-2xl font-medium text-gray-800 mb-2');
  });
});