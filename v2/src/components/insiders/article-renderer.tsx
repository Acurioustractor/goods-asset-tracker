import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeRaw from 'rehype-raw'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import Link from 'next/link'
import type { ComponentProps } from 'react'

type Props = {
  children: string
}

export function ArticleRenderer({ children }: Props) {
  return (
    <article className="wiki-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeRaw, rehypeSlug, [rehypeAutolinkHeadings, { behavior: 'wrap' }]]}
        components={{
          a: (props: ComponentProps<'a'>) => {
            const href = props.href || ''
            if (href.startsWith('/')) {
              return <Link href={href}>{props.children}</Link>
            }
            return (
              <a {...props} target={href.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer">
                {props.children}
              </a>
            )
          },
          table: (props) => (
            <div className="wiki-table-wrap">
              <table {...props} />
            </div>
          ),
        }}
      >
        {children}
      </ReactMarkdown>
    </article>
  )
}
