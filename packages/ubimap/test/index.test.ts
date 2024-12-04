import { UbiMap } from '../src';

describe('UbiMap', () => {
  it('should initialize with no data', () => {
    const ubimap = new UbiMap<[string, string]>();
    expect([...ubimap]).toHaveLength(0);
  });

  it('should initialize with provided data', () => {
    const initialData = { 'a b': 'value1', 'c d': 'value2' };
    const ubimap = new UbiMap<[string, string]>(initialData);
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

    for (const [key, value] of ubimap) {
      entries.push([key, value]);
    }

    expect(entries).toEqual([
      ['key1 key2', 'value1'],
      ['key3 key', 'value2']
    ]);
  });

  it('should iterate over all entries in the map', () => {
    const ubimap = new UbiMap<[string, string]>();
    ubimap.set('key1', 'key2', 'value1');
    ubimap.set('key3', 'key4', 'value2');
    const entries = [...ubimap];
    expect(entries).toEqual([
      ['key1 key2', 'value1'],
      ['key3 key4', 'value2']
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
    expect(ubimap.get('key1', 'key  2')).toBeUndefined();
    expect(ubimap.keys()).toHaveLength(0);
  });
});
