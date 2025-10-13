import { describe, expect, it } from 'vitest'
import { addPreconditions, checkPromptSize } from './helpers.js'
import type { TemplateMetadata } from './template-loader.js'

describe('addPreconditions', () => {
  const mockMetadata: TemplateMetadata = {
    id: 'test-template',
    version: '1.2.3',
    description: 'Test template',
    allowedTools: ['Bash', 'Read', 'Write'],
    argumentHint: '<arg>',
  }

  it('inserts preconditions at the top of the prompt', () => {
    const prompt = 'This is the original prompt content.'

    const result = addPreconditions(prompt, mockMetadata)

    expect(result).toContain('## Pre-execution Checklist')
    expect(result).toContain('Template: test-template')
    expect(result).toContain('Version: 1.2.3')
    expect(result).toContain('Allowed tools: Bash, Read, Write')
    expect(result).toContain('This is the original prompt content.')
  })

  it('places original prompt after preconditions', () => {
    const prompt = 'Original content here.'

    const result = addPreconditions(prompt, mockMetadata)

    const originalContentIndex = result.indexOf('Original content here.')
    const preconditionIndex = result.indexOf('## Pre-execution Checklist')

    expect(preconditionIndex).toBeLessThan(originalContentIndex)
  })

  it('inserts separator between preconditions and prompt', () => {
    const prompt = 'Content'

    const result = addPreconditions(prompt, mockMetadata)

    expect(result).toContain('---')
    const separatorIndex = result.indexOf('---')
    const contentIndex = result.indexOf('Content')
    expect(separatorIndex).toBeLessThan(contentIndex)
  })
})

describe('checkPromptSize', () => {
  it('returns undefined when prompt size is within limit', () => {
    const shortPrompt = 'This is a short prompt.'

    const result = checkPromptSize(shortPrompt)

    expect(result).toBeUndefined()
  })

  it('returns warning when prompt size exceeds limit', () => {
    // Generate a string larger than 50KB.
    const largePrompt = 'a'.repeat(51000)

    const result = checkPromptSize(largePrompt)

    expect(result).toBeDefined()
    expect(result).toContain('Generated prompt exceeds size limit')
    expect(result).toContain('50000')
  })

  it('warning message includes actual size and limit', () => {
    const largePrompt = 'a'.repeat(55000)

    const result = checkPromptSize(largePrompt)

    expect(result).toMatch(/\d+ > 50000/)
  })

  it('calculates byte size even with multibyte characters', () => {
    // Create a string with many Japanese characters (1 char = 3 bytes).
    const japanesePrompt = 'あ'.repeat(20000) // approx 60KB

    const result = checkPromptSize(japanesePrompt)

    expect(result).toBeDefined()
    expect(result).toContain('Generated prompt exceeds size limit')
  })
})
