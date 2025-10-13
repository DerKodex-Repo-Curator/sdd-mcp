import { describe, expect, it } from 'vitest'
import { adaptTemplateForMCP } from './template-adapter.js'

describe('adaptTemplateForMCP', () => {
  it('converts Run `/kiro:xxx` pattern to tool execution form', () => {
    const input = 'Run `/kiro:spec-requirements {{feature_name}}` to proceed'
    const expected = 'Run spec-requirements tool {{feature_name}} to proceed'

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('converts backtick-wrapped `/kiro:xxx` pattern', () => {
    const input = 'Use `/kiro:spec-design <feature-name>` command'
    const expected = 'Use `spec-design tool <feature-name>` command'

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('converts non-backtick `/kiro:xxx` pattern', () => {
    const input = 'The /kiro:spec-tasks command will help'
    const expected = 'The spec-tasks tool command will help'

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('converts multiple `/kiro:` patterns', () => {
    const input = `Follow these steps:
1. Run \`/kiro:spec-requirements <feature>\`
2. Run \`/kiro:spec-design <feature>\`
3. Run \`/kiro:spec-tasks <feature>\``

    const expected = `Follow these steps:
1. Run spec-requirements tool <feature>
2. Run spec-design tool <feature>
3. Run spec-tasks tool <feature>`

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('converts pattern including -y flag', () => {
    const input = 'Run `/kiro:spec-design {{feature_name}} -y` to auto-approve'
    const expected = 'Run spec-design tool {{feature_name}} -y to auto-approve'

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('converts pattern with task numbers', () => {
    const input = '`/kiro:spec-impl {{feature_name}} 1,2,3` will run specific tasks'
    const expected = '`spec-impl tool {{feature_name}} 1,2,3` will run specific tasks'

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })

  it('returns text without /kiro: unchanged', () => {
    const input = 'This is a normal text without any command references'

    expect(adaptTemplateForMCP(input)).toBe(input)
  })

  describe('positional placeholder conversion', () => {
    it('converts spec-requirements $1 to {{feature_name}}', () => {
      const input = 'Generate requirements for $1 feature'
      const expected = 'Generate requirements for {{feature_name}} feature'

      expect(adaptTemplateForMCP(input, 'spec-requirements')).toBe(expected)
    })

    it('converts spec-design $1 and $2', () => {
      const input = 'Design $1 with auto_approve=$2'
      const expected = 'Design {{feature_name}} with auto_approve={{auto_approve}}'

      expect(adaptTemplateForMCP(input, 'spec-design')).toBe(expected)
    })

    it('converts spec-init $ARGUMENTS to {{project_description}}', () => {
      const input = 'Initialize project: $ARGUMENTS'
      const expected = 'Initialize project: {{project_description}}'

      expect(adaptTemplateForMCP(input, 'spec-init')).toBe(expected)
    })

    it('does not convert multi-digit placeholders like $10', () => {
      const input = 'Use $1 and $10 and $11'
      const expected = 'Use {{feature_name}} and $10 and $11'

      expect(adaptTemplateForMCP(input, 'spec-requirements')).toBe(expected)
    })

    it('leaves placeholders intact when templateId is unknown', () => {
      const input = 'This is $1 and $2'

      expect(adaptTemplateForMCP(input, 'unknown-template')).toBe(input)
    })

    it('leaves placeholders intact when templateId is empty', () => {
      const input = 'This is $1 and $2'

      expect(adaptTemplateForMCP(input, '')).toBe(input)
      expect(adaptTemplateForMCP(input)).toBe(input)
    })

    it('converts both positional placeholders and /kiro: patterns', () => {
      const input = 'Run `/kiro:spec-design $1 -y` to proceed'
      const expected = 'Run spec-design tool {{feature_name}} -y to proceed'

      expect(adaptTemplateForMCP(input, 'spec-design')).toBe(expected)
    })
  })

  it('converts real template excerpt', () => {
    const input = `## Next Steps After Initialization

Follow the strict spec-driven development workflow:
1. **\`/kiro:spec-requirements <feature-name>\`** - Create and generate requirements.md
2. **\`/kiro:spec-design <feature-name>\`** - Create and generate design.md (requires approved requirements)
3. **\`/kiro:spec-tasks <feature-name>\`** - Create and generate tasks.md (requires approved design)

**Clear next step**: \`/kiro:spec-requirements <feature-name>\``

    const expected = `## Next Steps After Initialization

Follow the strict spec-driven development workflow:
1. **\`spec-requirements tool <feature-name>\`** - Create and generate requirements.md
2. **\`spec-design tool <feature-name>\`** - Create and generate design.md (requires approved requirements)
3. **\`spec-tasks tool <feature-name>\`** - Create and generate tasks.md (requires approved design)

**Clear next step**: \`spec-requirements tool <feature-name>\``

    expect(adaptTemplateForMCP(input)).toBe(expected)
  })
})
