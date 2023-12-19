import { POKE_TYPES, type PokeType } from '../constants'
import { capitalize, filterByName, filterByType, getArrayPage, getPaginationNumbers, getTotalPageCount, validatePageParam, validateQueryParam, validateTypeParam } from '../utils'
import { describe, it, expect } from 'vitest'

describe('Capitalize', () => {
  it('should lowercase word', () => {
    expect(capitalize('word')).toEqual('Word')
    expect(capitalize('WORD')).toEqual('Word')
    expect(capitalize('wORd')).toEqual('Word')
    expect(capitalize('')).toEqual('')
    expect(capitalize('w')).toEqual('W')
    expect(capitalize('ho-oh')).toEqual('Ho-Oh')
  })

  it('should blank string unchanged', () => {
    expect(capitalize('')).toEqual('')
  })
})

describe('Filter by name', () => {
  // Arrange
  it('should match strings that contain the query as a case insensitive substring', () => {
    // Arrange
    const query = 'bu'

    // Act
    const result = filterByName([
      { name: 'Butterfree', region: 'Kanto' },
      { name: 'electrabuzz', type: 'electric' },
      { name: 'foo', bar: 'gamma' }],
    query)

    // Assert
    expect(result.length).toBe(2)
    expect(result[0]).toEqual({
      name: 'Butterfree', region: 'Kanto'
    })
    expect(result[1]).toEqual({
      name: 'electrabuzz', type: 'electric'
    })
  })
})

describe('filter by poke type', () => {
  interface WithPokeType { types: Array<{ name: PokeType }> }

  it('should be unaltered input when type filter set is empty', () => {
    const allTypes: WithPokeType[] = POKE_TYPES.map(t => ({ types: [{ name: t }] }))
    expect(filterByType(allTypes, new Set())).toEqual(allTypes)
  })

  it('should contain all entries where all types are contained', () => {
    const filterTypes = new Set<PokeType>(['poison', 'grass'])

    const matchingAll: WithPokeType = { types: [{ name: 'grass' }, { name: 'poison' }, { name: 'electric' }] }
    const matchingOnlyOne: WithPokeType = { types: [{ name: 'steel' }, { name: 'grass' }] }
    const matchingNeither: WithPokeType = { types: [{ name: 'dragon' }] }

    const array: WithPokeType[] = [matchingAll, matchingOnlyOne, matchingNeither]
    expect(filterByType(array, filterTypes)).toEqual([matchingAll])
  })
})

describe('getArrayPage', () => {
  it('should throw an error for invalid inputs', () => {
    expect(() => getArrayPage([], 0, 1)).toThrow()
    expect(() => getArrayPage([], 1, 0)).toThrow()
  })

  it('should equal page size when array has enough elements at the desired page', () => {
    // Arrange
    const expected = [2, 3]
    const given = [0, 1, 2, 3, 4, 5]
    const page = 2
    const pageSize = 2

    // Act
    const result = getArrayPage(given, page, pageSize)

    // Assert
    expect(result.length).toEqual(pageSize)
    expect(result).toEqual(expected)
  })

  it('should not exceed the page size indicated', () => {
    // Arrange
    const expected = [6]
    const given = [0, 1, 2, 3, 4, 5, 6]
    const page = 4
    const pageSize = 2

    // Act
    const result = getArrayPage(given, page, pageSize)

    // Assert
    expect(result.length).toBeLessThan(pageSize)
    expect(result).toEqual(expected)
  })

  it('should be empty when given array is empty', () => {
    expect(getArrayPage([], 1, 1)).toEqual([])
  })
})

describe('Pagination total page count', () => {
  it('should throw if given invalid page size or result size', () => {
    expect(() => getTotalPageCount(-1, 1)).toThrow()
    expect(() => getTotalPageCount(0, 0)).toThrow()
    expect(() => getTotalPageCount(1, 1)).not.toThrow()
  })

  it('should yield correct page count', () => {
    expect(getTotalPageCount(0, 2)).toBe(0)
    expect(getTotalPageCount(6, 2)).toBe(3)
    expect(getTotalPageCount(7, 2)).toBe(4)
    expect(getTotalPageCount(8, 2)).toBe(4)
  })
})

describe('Get pagination numbers', () => {
  it('should throw when not given a positive number', () => {
    expect(() => getPaginationNumbers(0, 1, 1)).toThrow()
    expect(() => getPaginationNumbers(1, 0, 1)).toThrow()
    expect(() => getPaginationNumbers(1, 1, 0)).toThrow()
  })
  it('should return correct array of values', () => {
    expect(getPaginationNumbers(1, 2, 3)).toEqual([1, 2])
    expect(getPaginationNumbers(1, 4, 3)).toEqual([1, 2, 3])
    expect(getPaginationNumbers(50, 70, 3)).toEqual([49, 50, 51])
    expect(getPaginationNumbers(50, 70, 5)).toEqual([48, 49, 50, 51, 52])
    expect(getPaginationNumbers(69, 70, 5)).toEqual([67, 68, 69, 70])
  })
})

describe('validate page parameter', () => {
  it('should be 1 when not provided, not given a number, or given 0', () => {
    expect(validatePageParam(undefined)).toBe(1)
    expect(validatePageParam('')).toBe(1)
    expect(validatePageParam('a')).toBe(1)
    expect(validatePageParam('0')).toBe(1)
  })

  it('should be the absolute value when given a negative number', () => {
    expect(validatePageParam('2')).toBe(2)
    expect(validatePageParam('-2')).toBe(2)
    expect(validatePageParam('2.5')).toBe(2)
    expect(validatePageParam('2.7')).toBe(2)
  })

  it('should be the absolute value of the first element when given an array', () => {
    expect(validatePageParam(['3', '4'])).toBe(3)
    expect(validatePageParam(['']))
  })
})

describe('validate query param', () => {
  it('should be empty when given undefined or given an empty string', () => {
    expect(validateQueryParam(undefined)).toBe('')
    expect(validateQueryParam('')).toBe('')
  })

  it('should have be the unchanged string when given any string', () => {
    expect(validateQueryParam('az2')).toBe('az2')
  })

  it('should concatenate the strings when given an array', () => {
    expect(validateQueryParam(['a', 'z', '2'])).toBe('az2')
  })

  it('should remove duplicates and non-poketype values', () => {
    const types: PokeType[] = ['grass', 'bug', 'bug']
    const nonTypes: string[] = ['foo', 'bar', 'foo']
    expect(validateTypeParam([...types, ...nonTypes])).toEqual(new Set(['grass', 'bug']))
  })
})
