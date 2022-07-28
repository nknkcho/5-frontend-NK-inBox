import Link from "next/link";
import Image from "next/image";
import boxPic from "../../public/box.svg";
import styles from "./FormBox.module.scss";

export default function FormBox() {
  return (
    <>
    <div className={styles.homeBox}>
      <Link href={`/portfolios`}>
        <Image
          alt="Box icon for homepage"
          src={boxPic}
          layout="responsive"
        />
      </Link>
      </div>
    </>
  );
}
