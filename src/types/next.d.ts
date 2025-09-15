export interface PageProps<T extends Record<string, string> = { id: string }> {
  params: Promise<T>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}
