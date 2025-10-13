import { describe, expect, it } from 'vitest'
import { convertLegacyPlaceholders, renderTemplate } from './template-renderer.js'

describe('renderTemplate', () => {
  it('replaces a single placeholder', () => {
    const template = 'Hello {{name}}!'
    const params = { name: 'World' }

    const result = renderTemplate(template, params)

    expect(result).toBe('Hello World!')
  })

  it('replaces multiple placeholders', () => {
    const template = '{{greeting}} {{name}}, welcome to {{place}}!'
    const params = {
      greeting: 'Hello',
      name: 'Alice',
      place: 'Wonderland',
    }

    const result = renderTemplate(template, params)

    expect(result).toBe('Hello Alice, welcome to Wonderland!')
  })

  it('formats array parameters as comma-separated text', () => {
    const template = 'Tools: {{tools}}'
    const params = {
      tools: ['Bash', 'Read', 'Write'],
    }

    const result = renderTemplate(template, params)

    expect(result).toBe('Tools: Bash, Read, Write')
  })

  it('stringifies boolean parameters', () => {
    const template = 'Enabled: {{enabled}}'
    const params = {
      enabled: true,
    }

    const result = renderTemplate(template, params)

    expect(result).toBe('Enabled: true')
  })

  it('stringifies number parameters', () => {
    const template = 'Count: {{count}}'
    const params = {
      count: 42,
    }

    const result = renderTemplate(template, params)

    expect(result).toBe('Count: 42')
  })

  it('throws when a required parameter is missing', () => {
    const template = 'Hello {{name}}!'
    const params = {}

    expect(() => renderTemplate(template, params)).toThrow('Missing required parameter: name')
  })

  it('replaces repeated placeholders consistently', () => {
    const template = '{{name}} says: "Hello, I am {{name}}"'
    const params = { name: 'Bob' }

    const result = renderTemplate(template, params)

    expect(result).toBe('Bob says: "Hello, I am Bob"')
  })
})

describe('convertLegacyPlaceholders', () => {
  it('converts $ARGUMENTS to {{project_description}}', () => {
    const template = 'Initialize with: $ARGUMENTS'
    const mapping = { $ARGUMENTS: 'project_description' }

    const result = convertLegacyPlaceholders(template, mapping)

    expect(result).toBe('Initialize with: {{project_description}}')
  })

  it('converts $1 to a named placeholder', () => {
    const template = 'Feature: $1'
    const mapping = { $1: 'feature_name' }

    const result = convertLegacyPlaceholders(template, mapping)

    expect(result).toBe('Feature: {{feature_name}}')
  })

  it('converts $2 to a named placeholder', () => {
    const template = 'Tasks: $2'
    const mapping = { $2: 'task_numbers' }

    const result = convertLegacyPlaceholders(template, mapping)

    expect(result).toBe('Tasks: {{task_numbers}}')
  })

  it('converts multiple positional placeholders at once', () => {
    const template = 'Init: $ARGUMENTS, Feature: $1, Tasks: $2'
    const mapping = {
      $ARGUMENTS: 'project_description',
      $1: 'feature_name',
      $2: 'task_numbers',
    }

    const result = convertLegacyPlaceholders(template, mapping)

    expect(result).toBe('Init: {{project_description}}, Feature: {{feature_name}}, Tasks: {{task_numbers}}')
  })

  it('leaves multi-digit placeholders such as $10 untouched', () => {
    const template = 'Feature: $1, but not $10'
    const mapping = { $1: 'feature_name' }

    const result = convertLegacyPlaceholders(template, mapping)

    expect(result).toBe('Feature: {{feature_name}}, but not $10')
  })
})
