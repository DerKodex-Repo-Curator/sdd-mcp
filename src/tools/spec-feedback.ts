import { addPreconditions, checkPromptSize } from '../helpers.js'
import type { SpecFeedbackInput, ToolResult } from '../mcp-tools-types.js'
import { loadTemplate } from '../template-loader.js'
import { renderTemplate } from '../template-renderer.js'

const SUPPORTED_MODES = new Set(['report', 'apply'])

const formatTimestamp = (date = new Date()) => {
  const iso = date.toISOString()
  return iso
    .replace(/[-:]/g, '')
    .replace(/\.\d+Z$/, 'Z')
    .replace('T', '-')
    .slice(0, 15)
}

const slugify = (value: string): string => {
  const slug = value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 48)
  return slug.length > 0 ? slug : 'feedback'
}

/**
 * Handler for the spec-feedback tool.
 * @param input Tool input parameters.
 * @param templateDir Optional template directory (used for tests).
 * @returns Tool execution result.
 */
export const handleSpecFeedback = async (input: SpecFeedbackInput, templateDir?: string): Promise<ToolResult> => {
  if (!input.feature_name || input.feature_name.trim() === '') {
    throw new Error('Missing required parameter: feature_name')
  }

  const mode = (input.mode ?? 'report').toLowerCase()
  if (!SUPPORTED_MODES.has(mode)) {
    throw new Error(`Unsupported mode: ${input.mode}`)
  }

  const templateId = mode === 'report' ? 'spec-feedback-report' : 'spec-feedback-apply'
  const template = await loadTemplate(templateId, templateDir)

  const params: Record<string, string | string[] | boolean | number> = {
    feature_name: input.feature_name,
  }

  if (mode === 'report') {
    params.suggested_base = `${formatTimestamp()}-${slugify(input.feature_name)}-feedback`
  } else {
    const trimmedReportPath = input.report_path?.trim()
    params.report_reference =
      trimmedReportPath && trimmedReportPath.length > 0
        ? `Use the report JSON at \`${trimmedReportPath}\`.`
        : `Select the latest \`*-feedback.json\` inside \`.kiro/specs/${input.feature_name}/feedback/\`.`
  }

  const expandedPrompt = renderTemplate(template.body, params)
  const contentWithPreconditions = addPreconditions(expandedPrompt, template.metadata)
  const warning = checkPromptSize(contentWithPreconditions)

  return {
    content: contentWithPreconditions,
    metadata: {
      template_id: templateId,
      version: template.metadata.version,
      allowed_tools: template.metadata.allowedTools,
      parameters: {
        feature_name: input.feature_name,
        mode,
        ...(input.report_path ? { report_path: input.report_path } : {}),
      },
      ...(warning && { warning }),
    },
  }
}
