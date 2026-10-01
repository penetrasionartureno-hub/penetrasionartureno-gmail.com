/**
 * Currency utility for Córdobas Nicaragüenses (NIO - C$)
 */

export function formatCordobas(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'C$ 0';
  }
  return `C$ ${Math.round(amount).toLocaleString('es-NI')}`;
}

export function formatNumberOnly(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0';
  }
  return Math.round(amount).toLocaleString('es-NI');
}
