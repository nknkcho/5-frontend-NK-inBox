import { writeFileSync } from 'fs'
import { globby } from 'globby'
import prettier from 'prettier'

const Sitemap = () => {
  return null;
}

// FIXME: 여기엔 어떤 타입을 넣어야 할까?
export const getServerSideProps = async ({res} : any) => {
  const getDate = new Date().toISOString()
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js')
  const pages = await globby([
    'pages/**/*.tsx',
    'pages/*.tsx',
    '!pages/_*.tsx',
    '!pages/404.tsx',
    '!pages/sitemap.xml.tsx',
  ])

  const sitemap = `
  <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map(page => {
            const path = page.replace('pages', '').replace('.tsx', '').replace('/index', '')
            return `
              <url>
                  <loc>${`https://in-box.co.kr${path}`}</loc>
                  <lastmod>${getDate}</lastmod>
              </url>
            `
          })
          .join('')}
    </urlset>
  `

  const formatted = prettier.format(sitemap, {
    ...prettierConfig,
    parser: 'html',
  })

  res.setHeader("Content-Type", "text/xml")
  res.write(formatted)
  res.end()
  //writeFileSync('public/sitemap.xml', formatted)

  return {
    props: {}
  }
}

export default Sitemap;
