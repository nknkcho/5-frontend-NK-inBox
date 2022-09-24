import Header from '../../components/UI/Header'
import SettingList from '../../components/setting/SettingList'
import metadata from '../../components/metadata'
import { NextSeo } from 'next-seo'

export default function Settings() {
  return (
    <>
      <NextSeo
        title="Setting"
        description="당신만의 특별한 개발 포트폴리오를 업로드하고, 보고 싶은 포트폴리오 범위를 설정하여 확인해보세요!"
        canonical={`${metadata.meta.url}/setting`}
        openGraph={{ url: `${metadata.meta.url}/setting` }}
      />
      <Header />
      <SettingList />
    </>
  )
}
