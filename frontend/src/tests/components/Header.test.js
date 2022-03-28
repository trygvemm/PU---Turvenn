import React from 'react';
import 'regenerator-runtime/runtime';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import * as redux from 'react-redux';
import Header from '../../components/Header';

describe('Header - header text', () => {
  it('should render default header text when not logged in', () => {
    const selectorSpy = jest.spyOn(redux, 'useSelector');
    selectorSpy.mockReturnValue({ user: null });

    render(<Header />);

    const title = screen.queryByRole('heading', { name: /turvenn/i });

    expect(title).not.toBe(null);
    expect(title).toBeInTheDocument();
  });

  it('should render different text when logged in', () => {
    const selectorSpy = jest.spyOn(redux, 'useSelector');
    selectorSpy.mockReturnValue({
      user: {
        firstName: 'Test'
      }
    });

    render(<Header />);

    const title = screen.queryByRole('heading', { name: /hei test!/i });

    expect(title).not.toBe(null);
    expect(title).toBeInTheDocument();
  });
});
