type TableProps = React.ComponentProps<'table'>
type UlProps = React.ComponentProps<'ul'>
type OlProps = React.ComponentProps<'ol'>
type AProps = React.ComponentProps<'a'>

function ArticleTable({ children, ...props }: TableProps) {
  return (
    <div className="table-scroll-wrapper">
      <table {...props}>{children}</table>
    </div>
  )
}

function ArticleUl({ children, ...props }: UlProps) {
  const hasCheck = JSON.stringify(children).includes('✅')
  if (hasCheck) {
    return (
      <div className="checklist-card">
        <ul {...props}>{children}</ul>
      </div>
    )
  }
  return <ul {...props}>{children}</ul>
}

function ArticleOl({ children, ...props }: OlProps) {
  return (
    <ol className="numbered-list" {...props}>
      {children}
    </ol>
  )
}

function ArticleLink({ href, children, ...props }: AProps) {
  const isExternal = href?.startsWith('http')
  return (
    <a
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      {...props}
    >
      {children}
    </a>
  )
}

export const articleComponents = {
  table: ArticleTable,
  ul: ArticleUl,
  ol: ArticleOl,
  a: ArticleLink,
}
