import { writeFileSync } from 'fs';
import { globby } from 'globby'
import prettier from 'prettier'

// FIXME: 여기엔 어떤 타입을 넣어야 할까?
export const generateSitemap = async () => {
  const prettierConfig = await prettier.resolveConfig('./.prettierrc.js')
  const pages = await globby([
    'pages/**/*.tsx',
    'pages/*.tsx',
    '!pages/_*.tsx',
    '!pages/404.tsx',
    '!pages/sitemap.xml.tsx',
  ])

  // path 코드에 대한 예시를 적어두어야 친절한 코드
  const sitemap = `
  <?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${pages
          .map(page => {
            const path = page.replace('pages', '').replace('.tsx', '').replace('/index', '')
            return `
              <url>
                  <loc>${`https://in-box.co.kr${path}`}</loc>
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

  // eslint-disable-next-line no-sync
  writeFileSync('public/sitemap.xml', formatted);
}
generateSitemap();
