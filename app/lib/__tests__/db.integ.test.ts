import clientPromise from '../db'
import { describe, expect, it } from 'vitest'

describe('DB test', () => {
  it('Ping succeeds', async () => {
    const client = await clientPromise
    const result = await client.db('poketeams').command({ ping: 1 })
    expect(result).toBeDefined()
    expect(result).toEqual({ ok: 1 })
  })
})
