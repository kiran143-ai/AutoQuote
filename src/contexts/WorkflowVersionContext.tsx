import { createContext, useContext } from 'react';

export type WorkflowVersion = 'v1' | 'v2';

export const WorkflowVersionContext = createContext<WorkflowVersion>('v1');

export function useWorkflowVersion(): WorkflowVersion {
  return useContext(WorkflowVersionContext);
}
