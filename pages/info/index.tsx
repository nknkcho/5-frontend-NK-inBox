import dynamic from "next/dynamic";
import Header from "../../components/UI/Header";
import styles from "./info.module.scss";

const Category = dynamic((): Promise<any> => import("../../components/setting/SettingList").then((module) => module.Category), {ssr: false})
const GoBackButton = dynamic((): Promise<any> => import("../../components/setting/SettingList").then((module) => module.GoBackButton), {ssr: false})

export default function Intro() {
  return (
    <div>
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
    </div>
  );
}
