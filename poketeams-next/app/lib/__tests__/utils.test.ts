import { POKE_TYPE_BG_CLASS, capitalize, filterLike, getArrayPage, getPaginationNumbers, getTotalPageCount } from '../utils'
import { describe, it, expect } from 'vitest'

describe('Poke Type BG class map', () => {
  it('should return the correct class given a valid type', () => {
    expect(POKE_TYPE_BG_CLASS.grass).toMatch('bg-grass')
  })
})

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

describe('Contains string', () => {
  // Arrange
  it('should match strings that contain the query as a case insensitive substring', () => {
    // Arrange
    const query = 'bu'

    // Act
    const result = filterLike(['Butterfree', 'electrabuzz', 'foo'], query)

    // Assert
    expect(result).toContain('Butterfree')
    expect(result).toContain('electrabuzz')
    expect(result).not.toContain('foo')
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
  it('should return correct array of values', () => {
    expect(getPaginationNumbers(1, 2, 3)).toEqual([1, 2])
    expect(getPaginationNumbers(1, 4, 3)).toEqual([1, 2, 3])
    expect(getPaginationNumbers(50, 70, 3)).toEqual([49, 50, 51])
    expect(getPaginationNumbers(50, 70, 5)).toEqual([48, 49, 50, 51, 52])
    expect(getPaginationNumbers(69, 70, 5)).toEqual([67, 68, 69, 70])
  })
})
