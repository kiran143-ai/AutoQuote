import { useOutletContext } from 'react-router-dom';
import type { QuoteCase } from '../types';

export function useWorkspaceCase(): QuoteCase {
  return useOutletContext<QuoteCase>();
}