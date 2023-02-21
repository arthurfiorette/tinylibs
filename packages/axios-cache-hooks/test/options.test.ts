import { AxiosHeaders } from 'axios';
import { defaultHashGenerator } from '../src/options';

describe('tests default options', () => {
  it('tests default hash generator', () => {
    expect(defaultHashGenerator()).toBe(0);
    expect(defaultHashGenerator(undefined, { msg: 'yay' })).not.toBe(0);
    expect(
      defaultHashGenerator({
        cached: false,
        config: { headers: new AxiosHeaders() },
        data: null,
        headers: {},
        id: 'custom-id',
        status: 200,
        statusText: '202 OK'
      })
    ).not.toBe(0);
  });
});
