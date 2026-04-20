export type WikiFrontmatter = {
  name?: string
  description?: string
  type?: string
  publish?: boolean
  reason?: string
}

export type WikiArticle = {
  slug: string[]
  slugPath: string
  title: string
  summary: string | null
  folder: string | null
  filepath: string
  frontmatter: WikiFrontmatter
  body: string
  wordCount: number
}

export type WikiTreeNode = {
  kind: 'folder' | 'article'
  name: string
  label: string
  slugPath: string
  children?: WikiTreeNode[]
  description?: string
}

export type WikiBacklink = {
  fromSlugPath: string
  fromTitle: string
}
