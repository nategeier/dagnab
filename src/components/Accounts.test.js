import React from 'react';
import Accounts from './Accounts';
import renderer from 'react-test-renderer';

it('should do it', () => {
  expect(2).toBe(2);

  const component = renderer.create(<Accounts />).toJSON();
});
