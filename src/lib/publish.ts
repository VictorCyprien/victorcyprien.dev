/** Draft content shows in local dev and on the preview site, never in production. */
export function showsDrafts(siteEnv: string | undefined, isDev: boolean): boolean {
  return isDev || siteEnv === 'preview';
}

export function isPublished(draft: boolean, showDrafts: boolean): boolean {
  return !draft || showDrafts;
}
