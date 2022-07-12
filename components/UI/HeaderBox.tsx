import Image from "next/image";
import boxPic from "../../public/headerbox.svg";
import styles from "./HeaderBox.module.scss";

export default function headerBox() {
  return (
    <div className={styles.headerBox}>
      <Image
        alt="Box icon for header"
        src={boxPic}
        layout="responsive"
      />
    </div>
  );
}
