import { mkdtempSync, rmdirSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join, resolve } from 'node:path'
import { afterAll, beforeAll, describe, expect } from 'vitest'
import { scanDir } from '../utils/sidebar'

let tempDir: string

beforeAll(() => {
  tempDir = mkdtempSync(join(tmpdir(), 'test-'))
  writeFileSync(join(tempDir, 'test1.md'), '# Test 1')
  writeFileSync(join(tempDir, 'test2.md'), '# Test 2')
  writeFileSync(join(tempDir, 'test.txt'), 'Test text file')
})

afterAll(() => {
  rmdirSync(tempDir, { recursive: true })
})

describe('scanDir', () => {
  it('should return markdown files with correct structure', () => {
    const res = scanDir(tempDir)
    expect(res).toBeInstanceOf(Array)
    expect(res.length).toBe(2)
    res.forEach((item) => {
      expect(item).toHaveProperty('filename')
      expect(item).toHaveProperty('link')
      expect(item.filename).toMatch(/\.md$/)
      expect(item.link).toBe(resolve(tempDir, item.filename))
    })
  })

  it('should return an empty array if no markdown files are found', () => {
    const emptyDir = mkdtempSync(join(tmpdir(), 'empty-'))
    const res = scanDir(emptyDir)
    expect(res).toEqual([])
    rmdirSync(emptyDir, { recursive: true })
  })
})
