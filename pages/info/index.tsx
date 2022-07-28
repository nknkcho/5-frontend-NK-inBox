import dynamic from "next/dynamic";
import Header from "../../components/UI/Header";
import styles from "../../styles/info.module.scss";
import metadata from "../../components/metadata";
import { NextSeo } from "next-seo";

const Category = dynamic(
  (): Promise<any> =>
    import("../../components/setting/SettingList").then(
      (module) => module.Category
    ),
  { ssr: false }
);
const GoBackButton = dynamic(
  (): Promise<any> =>
    import("../../components/setting/SettingList").then(
      (module) => module.GoBackButton
    ),
  { ssr: false }
);

export default function Intro() {
  return (
    <>
      <NextSeo
        title="Info"
        canonical={`${metadata.meta.url}/info`}
        openGraph={{ url: `${metadata.meta.url}/info` }}
      />

      <Header />
      <div className={styles.infoContainer}>
        <p className={styles.infoText}>
          Hi, I&apos;m Amy. <br />
          Nice to meet you. <br />
          I made this homepage <br />
          because I wanted to cherish all of our moments. <br />
          I hope every moment of your happiness will be with you. <br />
          <br />
          If you have any questions, <br />
          please contact me through to menu.
        </p>
        <div className={styles.optionRow}>
          <Category />
          <GoBackButton />
        </div>
      </div>
    </>
  );
}
