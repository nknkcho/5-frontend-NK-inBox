import metadata from './components/metadata'

const SEO = {
  titleTemplate: '%s | IN-BOX',
  defaultTitle: metadata.meta.title,
  description: metadata.meta.description,
  canonical: metadata.meta.url,
  openGraph: {
    type: "website",
    locale: "ko_KR",
    url: metadata.meta.url,
    site_name: metadata.meta.title,
    images: [
      {
        url: `${metadata.meta.url}/home.jpg`,
        width: 1280,
        height: 720,
        alt: `IN-BOX`
      }
    ]
  }
}

export default SEO