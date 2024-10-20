import React from "react";
import { act } from 'react';
import { render } from '@testing-library/react';
import { renderContent, constructContent } from '../../utils/builder';

describe('renderContent', () => {
  test('should render plain text content', () => {
    const content = 'This is a plain text content';
    let container: HTMLElement = document.createElement('div');
    act(() => {
      const result = render(<div>{renderContent(content)}</div>);
      container = result.container;
    });
    expect(container.textContent).toBe(content);
  });

  test('should render HTML content with modified anchor tags', () => {
    const content = { __html: '<a href="#">Link</a>' };
    let container: HTMLElement = document.createElement('div');
    act(() => {
      const result = render(<div>{renderContent(content)}</div>);
      container = result.container;
    });
    const anchor = container.querySelector('a');
    expect(anchor).toBeInTheDocument();
    expect(anchor).toHaveClass('text-blue-600 hover:text-blue-800 underline font-semibold');
  });
});

describe('constructContent', () => {
  test('should return an array of plain text descriptions', () => {
    const descriptions = ['Description 1', 'Description 2'];
    const result = constructContent(descriptions, false);
    expect(result).toEqual(descriptions);
  });

  test('should return an array of HTML descriptions', () => {
    const descriptions = ['<p>Description 1</p>', '<p>Description 2</p>'];
    const result = constructContent(descriptions, true);
    expect(result).toEqual([{ __html: '<p>Description 1</p>' }, { __html: '<p>Description 2</p>' }]);
  });
});
