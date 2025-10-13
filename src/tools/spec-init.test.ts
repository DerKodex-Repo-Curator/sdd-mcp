import { mkdir, rm, writeFile } from 'node:fs/promises'
import { afterEach, beforeEach, describe, expect, it } from 'vitest'
import { handleSpecInit } from './spec-init.js'

const TEST_TEMPLATE_DIR = '/tmp/sdd-mcp-test-tools'

describe('handleSpecInit', () => {
  beforeEach(async () => {
    // Create a test directory.
    await mkdir(TEST_TEMPLATE_DIR, { recursive: true })

    // Create a template file for tests.
    const templateContent = `---
description: Test spec-init template
allowed-tools: Bash, Read, Write
argument-hint: <project-description>
version: 1.0.0
---

# Initialize Project
Project: {{project_description}}`

    await writeFile(`${TEST_TEMPLATE_DIR}/spec-init.md`, templateContent)
  })

  afterEach(async () => {
    await rm(TEST_TEMPLATE_DIR, { recursive: true, force: true })
  })

  it('generates prompt with valid input', async () => {
    const input = {
      project_description: 'Build a new MCP server',
    }

    const result = await handleSpecInit(input, TEST_TEMPLATE_DIR)

    expect(result.content).toContain('Project: Build a new MCP server')
    expect(result.metadata.template_id).toBe('spec-init')
    expect(result.metadata.version).toBe('1.0.0')
    expect(result.metadata.allowed_tools).toEqual(['Bash', 'Read', 'Write'])
    expect(result.metadata.parameters).toEqual(input)
  })

  it('inserts precondition section', async () => {
    const input = {
      project_description: 'Test project',
    }

    const result = await handleSpecInit(input, TEST_TEMPLATE_DIR)

    expect(result.content).toContain('## Pre-execution Checklist')
    expect(result.content).toContain('Template: spec-init')
    expect(result.content).toContain('Version: 1.0.0')
    expect(result.content).toContain('Allowed tools: Bash, Read, Write')
  })

  it('throws when required parameter is missing', async () => {
    const input: Partial<SpecInitInput> = {
      // project_description is missing.
    }

    await expect(handleSpecInit(input as SpecInitInput, TEST_TEMPLATE_DIR)).rejects.toThrow(
      'Missing required parameter: project_description',
    )
  })

  it('throws when parameter is empty string', async () => {
    const input = {
      project_description: '',
    }

    await expect(handleSpecInit(input, TEST_TEMPLATE_DIR)).rejects.toThrow(
      'Missing required parameter: project_description',
    )
  })

  it('includes warning when prompt size exceeds limit', async () => {
    const input = {
      project_description: 'a'.repeat(50000),
    }

    const result = await handleSpecInit(input, TEST_TEMPLATE_DIR)

    expect(result.metadata.warning).toBeDefined()
    expect(result.metadata.warning).toContain('Generated prompt exceeds size limit')
  })
})
