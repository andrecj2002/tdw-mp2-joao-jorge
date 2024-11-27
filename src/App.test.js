import { render, screen } from '@testing-library/react';
import HomePage from './homepage';


test("renders 'Hunter's Book' heading", () => {
  render(<HomePage />);
  const headingElement = screen.getByText(/Hunter's Book/i);
  expect(headingElement).toBeInTheDocument();
});
