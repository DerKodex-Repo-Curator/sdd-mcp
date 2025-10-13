import { describe, expect, it } from 'vitest'
import { handleSpecFeedback } from './spec-feedback.js'

describe('handleSpecFeedback', () => {
  it('returns report-mode instructions with context and tasks', async () => {
    const result = await handleSpecFeedback({
      feature_name: 'demo-feature',
      mode: 'report',
    })

    expect(result.content).toContain('# Specification Feedback Report')
    expect(result.content).toContain('## Task 1: Capture Feedback Inputs')
    expect(result.content).toContain('## Task 2: Produce Report Artifacts')
    expect(result.content).toMatch(/feedback\/\d{8}-\d{6}-demo-feature-feedback\.json/)
    expect(result.content).toContain('## Output Instructions')
    expect(result.metadata.parameters).toMatchObject({
      feature_name: 'demo-feature',
      mode: 'report',
    })
    expect(result.metadata.template_id).toBe('spec-feedback-report')
  })

  it('returns apply-mode instructions with update plan', async () => {
    const result = await handleSpecFeedback({
      feature_name: 'demo-feature',
      mode: 'apply',
      report_path: 'feedback/20250101-demo-feature-feedback.json',
    })

    expect(result.content).toContain('# Specification Feedback Application')
    expect(result.content).toContain('## Task 2: Update Specification Files')
    expect(result.content).toContain('Use the report JSON at `feedback/20250101-demo-feature-feedback.json`.')
    expect(result.content).toContain('## Completion Checklist')
    expect(result.metadata.parameters).toMatchObject({
      feature_name: 'demo-feature',
      mode: 'apply',
      report_path: 'feedback/20250101-demo-feature-feedback.json',
    })
    expect(result.metadata.template_id).toBe('spec-feedback-apply')
  })

  it('throws when feature_name is missing', async () => {
    await expect(
      handleSpecFeedback({
        feature_name: '',
      } as unknown as Parameters<typeof handleSpecFeedback>[0]),
    ).rejects.toThrow('Missing required parameter: feature_name')
  })

  it('throws when mode is invalid', async () => {
    await expect(
      handleSpecFeedback({
        feature_name: 'demo',
        mode: 'preview',
      } as unknown as Parameters<typeof handleSpecFeedback>[0]),
    ).rejects.toThrow('Unsupported mode: preview')
  })
})
