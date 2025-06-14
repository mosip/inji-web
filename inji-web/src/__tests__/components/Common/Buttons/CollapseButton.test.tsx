import {setMockUseSelectorState} from '../../../../test-utils/mockReactRedux';
import { render, fireEvent } from '@testing-library/react';
import { useSelector } from 'react-redux';
import { CollapseButton } from '../../../../components/Common/Buttons/CollapseButton';
import * as i18nUtils from '../../../../utils/i18n';

jest.mock('../../../../assets/CollapseIcon.svg', () => 'mock-icon.svg');

describe('CollapseButton', () => {
  const mockOnClick = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    setMockUseSelectorState({
      common: { language: 'en' }
    });
  });

  it('renders with default class and calls onClick when clicked', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue('en'); // LTR language
    jest.spyOn(i18nUtils, 'isRTL').mockReturnValue(false);

    const { getByRole } = render(
      <CollapseButton isCollapsed={false} onClick={mockOnClick} className="test-class" />
    );

    const button = getByRole('button');
    expect(button).toHaveClass('test-class');

    const image = button.querySelector('img');
    expect(image).toHaveAttribute('src', 'mock-icon.svg');
    expect(image).not.toHaveClass('rotate-180');

    fireEvent.click(button);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('rotates icon for collapsed state in LTR language', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue('en'); // LTR
    jest.spyOn(i18nUtils, 'isRTL').mockReturnValue(false);

    const { getByRole } = render(
      <CollapseButton isCollapsed={true} onClick={mockOnClick} className="" />
    );

    const image = getByRole('img');
    expect(image).toHaveClass('rotate-180');
  });

  it('does not rotate icon for collapsed state in RTL language', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue('ar'); // RTL
    jest.spyOn(i18nUtils, 'isRTL').mockReturnValue(true);

    const { getByRole } = render(
      <CollapseButton isCollapsed={true} onClick={mockOnClick} className="" />
    );

    const image = getByRole('img');
    expect(image).not.toHaveClass('rotate-180');
  });

  it('rotates icon when expanded in RTL language', () => {
    (useSelector as unknown as jest.Mock).mockReturnValue('ar'); // RTL
    jest.spyOn(i18nUtils, 'isRTL').mockReturnValue(true);

    const { getByRole } = render(
      <CollapseButton isCollapsed={false} onClick={mockOnClick} className="" />
    );

    const image = getByRole('img');
    expect(image).toHaveClass('rotate-180');
  });
});
