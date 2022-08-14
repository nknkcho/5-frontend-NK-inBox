import dynamic from "next/dynamic";
import Header from "../../components/UI/Header";
import styles from "../../styles/info.module.scss";
import metadata from "../../components/metadata";
import { NextSeo } from "next-seo";
import { Category, GoBackButton } from "../../components/setting/SettingList";

export default function Intro() {
  return (
    <>
      <NextSeo
        title="Info"
        description="IN-BOX를 만든 사람들과 IN-BOX의 제작 이유를 소개합니다."
        canonical={`${metadata.meta.url}/info`}
        openGraph={{ url: `${metadata.meta.url}/info` }}
      />

      <Header />
      <div className={styles.infoContainer}>
        <p className={styles.infoText}>
          Hi, we&apos;re team IN-BOX. <br />
          Nice to meet you. <br />
          We made this homepage <br />
          to create an online space where developers can freely show their wonderful portfolios. <br />
          We hope every moment of your career will be with you. <br />
          <br />
          If you have any questions, <br />
          please contact us through to contact menu.
        </p>
        <div className={styles.optionRow}>
          <Category />
          <GoBackButton />
        </div>
      </div>
    </>
  );
}
