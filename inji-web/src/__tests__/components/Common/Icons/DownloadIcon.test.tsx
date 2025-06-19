import {render} from '@testing-library/react';
import '@testing-library/jest-dom';
import {DownloadIcon} from '../../../../components/Common/Icons/DownloadIcon';

describe('DownloadIcon Component', () => {
  const defaultProps = {
    testId: 'icon-download'
  };

  const renderDownloadIcon = (props = {}) => {
    return render(<DownloadIcon {...defaultProps} {...props} />);
  };

  it('matches snapshot with default props (non-gradient)', () => {
    const { asFragment } = renderDownloadIcon();
    expect(asFragment()).toMatchSnapshot();
  });

  it('matches snapshot with gradient version', () => {
    const { asFragment } = renderDownloadIcon({ gradient: true });
    expect(asFragment()).toMatchSnapshot();
  });
});