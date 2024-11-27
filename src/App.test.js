import { render, screen } from '@testing-library/react';
import HomePage from './HomePage';


test("renders 'Hunter's Book' heading", () => {
  render(<HomePage />);
  const headingElement = screen.getByText(/Hunter's Book/i);
  expect(headingElement).toBeInTheDocument();
});
