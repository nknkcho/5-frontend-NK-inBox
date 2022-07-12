import Link from "next/link";
import Image from "next/image";
import boxPic from "../../public/box.svg";
import styles from "./FormBox.module.scss";

export default function FormBox() {
  //const id = Math.floor(Math.random() * 100) + 1;
  return (
    <>
    <div className={styles.homeBox}>
      <Link href={`/portfolios`}>
        <Image
          alt="Box icon for homepage"
          src={boxPic}
          layout="responsive"
          //width={286}
          //height={220}
        />
      </Link>
      </div>
    </>
  );
}
