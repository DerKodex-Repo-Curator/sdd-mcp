/**
 * Response type for MCP tools.
 */
export type ToolResult = {
  content: string
  metadata: ToolMetadata
}

/**
 * Metadata type for MCP tools.
 */
export type ToolMetadata = {
  template_id: string
  version: string
  allowed_tools: string[]
  parameters: Record<string, unknown>
  warning?: string
}

/**
 * Input type for the spec-init tool.
 */
export type SpecInitInput = {
  project_description: string
}

/**
 * Input type for the spec-requirements tool.
 */
export type SpecRequirementsInput = {
  feature_name: string
}

/**
 * Input type for the spec-status tool.
 */
export type SpecStatusInput = {
  feature_name: string
}

/**
 * Input type for the validate-design tool.
 */
export type ValidateDesignInput = {
  feature_name: string
}

/**
 * Input type for the validate-gap tool.
 */
export type ValidateGapInput = {
  feature_name: string
}

/**
 * Input type for the spec-design tool.
 */
export type SpecDesignInput = {
  feature_name: string
  auto_approve?: boolean
}

/**
 * Input type for the spec-tasks tool.
 */
export type SpecTasksInput = {
  feature_name: string
  auto_approve?: boolean
}

/**
 * Input type for the spec-impl tool.
 */
export type SpecImplInput = {
  feature_name: string
  task_numbers?: string[]
}

/**
 * Feedback item update descriptor for spec-feedback.
 */
export type SpecFeedbackItemUpdates = {
  requirements?: string[]
  design?: string[]
  tasks?: string[]
}

/**
 * Feedback item definition for spec-feedback.
 */
export type SpecFeedbackItem = {
  id?: string
  title: string
  severity?: 'blocker' | 'major' | 'minor' | 'info'
  impact?: string
  recommendation?: string
  targets: ('requirements' | 'design' | 'tasks')[]
  updates?: SpecFeedbackItemUpdates
}

/**
 * Input type for the spec-feedback tool.
 */
export type SpecFeedbackInput = {
  feature_name: string
  mode?: 'report' | 'apply'
  feedback?: SpecFeedbackItem[]
  report_path?: string
  dry_run?: boolean
}

/**
 * Input type for the steering tool (no parameters).
 */
export type SteeringInput = Record<string, never>

/**
 * Input type for the steering-custom tool (no parameters).
 */
export type SteeringCustomInput = Record<string, never>
