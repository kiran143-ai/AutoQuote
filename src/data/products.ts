import type { ProductId } from '../types';

export interface Product {
  id: ProductId;
  label: string;
  short: string;
}

export const products: Product[] = [
{
  id: 'EPPVUL_AVME',
  label: 'EPPVUL — AV M&E (COLI)',
  short: 'EPPVUL AVME'
},
{
  id: 'EPPVUL_PBME',
  label: 'EPPVUL — Premium-Based M&E',
  short: 'EPPVUL PBME'
}];


export function productLabel(id: ProductId): string {
  return products.find((p) => p.id === id)?.label ?? id;
}

export function productShort(id: ProductId): string {
  return products.find((p) => p.id === id)?.short ?? id;
}