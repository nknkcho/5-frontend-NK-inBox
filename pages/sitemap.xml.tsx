import { writeFileSync } from 'fs'
import { globby } from 'globby'
import prettier from 'prettier'

async function generateSitemap() {
  const getDate = new Date().toISOString();
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js')
  const pages = await globby(['pages/**/*.tsx', 'pages/*.tsx', '!pages/_*.tsx', '!pages/404.tsx'])

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

  writeFileSync('public/sitemap.xml', formatted)
}
generateSitemap()
