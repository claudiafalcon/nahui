export function pesos(n: number): string {
  return `$${n.toLocaleString('es-MX')}`;
}

export function pluralize(count: number, singular: string, plural: string): string {
  return count === 1 ? singular : plural;
}

export function articulos(count: number): string {
  return `${count} ${pluralize(count, 'artículo', 'artículos')}`;
}
