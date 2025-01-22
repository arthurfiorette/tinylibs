import { UbiMap } from '../src';

describe('UbiMap', () => {
  it('should initialize with no data', () => {
    const ubimap = new UbiMap<[string, string]>();
    expect([...ubimap]).toHaveLength(0);
  });

  it('should initialize with provided data', () => {
    const ubimap = new UbiMap<[string, string]>({ 'a b': 'value1', 'c d': 'value2' });

    expect(ubimap.get('a', 'b')).toBe('value1');
    expect(ubimap.get('c', 'd')).toBe('value2');
  });

  it('should set and get values', () => {
    const ubimap = new UbiMap<[string, string]>();
    ubimap.set('key1', 'key2', 'value');
    expect(ubimap.get('key1', 'key2')).toBe('value');
  });

  it('should throw an error when setting duplicate keys', () => {
    const ubimap = new UbiMap<[string, string]>();
    ubimap.set('key1', 'key2', 'value');
    expect(() => ubimap.set('key1', 'key2', 'anotherValue')).toThrow(
      /Key key1 key2 already exists in map/
    );
  });

  it('should throw an error when setting duplicate values', () => {
    const ubimap = new UbiMap<[string, string]>();
    ubimap.set('key1', 'key2', 'value');
    expect(() => ubimap.set('key3', 'key4', 'value')).toThrow(
      /Value value already exists in map/
    );
  });

  it('sets and gets using many different ways to specify keys', () => {
    const ubimap = new UbiMap<[string, string]>();

    ubimap.set('key1', 'key2', 'value');
    expect(ubimap.get('key1', 'key2')).toBe('value');
    expect(ubimap.get('key1 key2')).toBe('value');

    ubimap.set('key3 key4', 'value2');
    expect(ubimap.get('key3', 'key4')).toBe('value2');
    expect(ubimap.get('key3 key4')).toBe('value2');

    expect(ubimap.remove('key3', 'key4')).toBeTruthy();
    expect(ubimap.remove('key3 key4')).toBeFalsy();

    expect(ubimap.remove('key1 key2')).toBeTruthy();
    expect(ubimap.remove('key1', 'key2')).toBeFalsy();
  });

  it('should retrieve keys by value', () => {
    const ubimap = new UbiMap<[string, string]>();
    ubimap.set('key1', 'key2', 'value');
    expect(ubimap.getKey('value')).toBe('key1 key2');
  });

  it('ensures filter works', () => {
    const ubimap = new UbiMap<[string, string]>();
    ubimap.set('key1', 'key2', 'value1');
    ubimap.set('key3', 'key', 'value2');
    ubimap.set('key1', 'key3', 'value3');

    expect(ubimap.filter('key1')).toEqual([
      ['key1', 'key2', 'value1'],
      ['key1', 'key3', 'value3']
    ]);

    expect(ubimap.filter('key1', 'key2')).toEqual([['key1', 'key2', 'value1']]);
    expect(ubimap.filter('key1 key2')).toEqual([['key1', 'key2', 'value1']]);

    expect(ubimap.filter('key3')).toEqual([['key3', 'key', 'value2']]);

    expect(ubimap.filter('key4')).toEqual([]);

    expect(ubimap.filter()).toEqual([
      ['key1', 'key2', 'value1'],
      ['key3', 'key', 'value2'],
      ['key1', 'key3', 'value3']
    ]);
  });

  it('should return undefined for non-existing value', () => {
    const ubimap = new UbiMap<[string, string]>();
    expect(ubimap.getKey('nonexistent')).toBeUndefined();
  });

  it('should list all keys matching a prefix', () => {
    const ubimap = new UbiMap<[string, string]>();
    ubimap.set('a', 'b', 'value1');
    ubimap.set('a', 'c', 'value2');
    ubimap.set('b', 'd', 'value3');
    expect(ubimap.keys('a')).toEqual(['a b', 'a c']);
  });

  it('should list all values matching a key prefix', () => {
    const ubimap = new UbiMap<[string, string]>();
    ubimap.set('a', 'b', 'value1');
    ubimap.set('a', 'c', 'value2');
    ubimap.set('b', 'd', 'value3');
    expect(ubimap.values('a')).toEqual(['value1', 'value2']);
  });

  it('is iterable within for-of loops', () => {
    const ubimap = new UbiMap<[string, string]>();

    ubimap.set('key1', 'key2', 'value1');
    ubimap.set('key3', 'key', 'value2');

    const entries = [];

    for (const row of ubimap) {
      entries.push(row);
    }

    expect(entries).toEqual([
      ['key1', 'key2', 'value1'],
      ['key3', 'key', 'value2']
    ]);
  });

  it('should iterate over all entries in the map', () => {
    const ubimap = new UbiMap<[string, string]>();
    ubimap.set('key1', 'key2', 'value1');
    ubimap.set('key3', 'key4', 'value2');
    const entries = [...ubimap];
    expect(entries).toEqual([
      ['key1', 'key2', 'value1'],
      ['key3', 'key4', 'value2']
    ]);
  });

  it('should handle custom separators', () => {
    const ubimap = new UbiMap<[string, string], string, '-'>(undefined, '-');
    ubimap.set('key1', 'key2', 'value');
    expect(ubimap.get('key1', 'key2')).toBe('value');
    expect(ubimap.getKey('value')).toBe('key1-key2');
    expect(ubimap.keys('key1')).toEqual(['key1-key2']);
  });

  it('should handle partial tuple prefixes for listing keys', () => {
    const ubimap = new UbiMap<[string, string, string]>();
    ubimap.set('a', 'b', 'c', 'value1');
    ubimap.set('a', 'b', 'd', 'value2');
    expect(ubimap.keys('a', 'b')).toEqual(['a b c', 'a b d']);
  });

  it('should handle partial tuple prefixes for listing values', () => {
    const ubimap = new UbiMap<[string, string, string]>();
    ubimap.set('a', 'b', 'c', 'value1');
    ubimap.set('a', 'b', 'd', 'value2');
    expect(ubimap.values('a', 'b')).toEqual(['value1', 'value2']);
  });

  it('should remove a item with remove()', () => {
    const ubimap = new UbiMap<[string, string]>();
    expect(ubimap.remove('key1', 'key2')).toBeFalsy();
    ubimap.set('key1', 'key2', 'value');
    expect(ubimap.remove('key1', 'key2')).toBeTruthy();
    expect(ubimap.has('key1', 'key  2')).toBeFalsy();
    expect(ubimap.keys()).toHaveLength(0);
  });

  it('correctly calculates size()', () => {
    const ubimap = new UbiMap<[string, string]>();
    expect(ubimap.size()).toBe(0);
    ubimap.set('key1', 'key2', 'value');
    expect(ubimap.size()).toBe(1);
    ubimap.set('key3', 'key4', 'value1');
    expect(ubimap.size()).toBe(2);
    ubimap.remove('key1', 'key2');
    expect(ubimap.size()).toBe(1);
  });

  it('throws if not found', () => {
    const ubimap = new UbiMap<[string, string]>();

    try {
      ubimap.get('key1', 'key2');
      throw new Error('Expected an error to be thrown');
    } catch (error: any) {
      expect(error.message).toBe("Key 'key1 key2' not found.");
      expect(error.key).toBe('key1 key2');
    }
  });

  it('tests has()', () => {
    const ubimap = new UbiMap<[string, string]>();
    expect(ubimap.has('key1', 'key2')).toBeFalsy();
    expect(ubimap.has('key1', 'key3')).toBeFalsy();
    ubimap.set('key1', 'key2', 'value');
    expect(ubimap.has('key1', 'key2')).toBeTruthy();
    expect(ubimap.has('key1', 'key3')).toBeFalsy();
  });
});
