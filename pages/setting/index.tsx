import Header from "../../components/UI/Header";
import SettingList from "../../components/setting/SettingList";
import metadata from "../../components/metadata";
import { NextSeo } from "next-seo";

// FIXME: 왜 바디가 전체 화면을 차지하지 않는걸까?
export default function Settings() {
  return (
    <>
      <NextSeo
        title="Setting"
        canonical={`${metadata.meta.url}/setting`}
        openGraph={{ url: `${metadata.meta.url}/setting` }}
      />
      <Header />
      <SettingList />
    </>
  );
}
