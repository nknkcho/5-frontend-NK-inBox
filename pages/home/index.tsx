import Image from "next/image";
import MenuList from "../../components/UI/HeaderMenu";
import BoxIcon from "../../components/UI/FormBox";
import homePic from "../../public/home.jpg";
import styles from "../../styles/home.module.scss";

export default function Home() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.bgWarp}>
        <Image
          className={styles.image}
          alt="Home image"
          src={homePic}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className={styles.container}>
        <MenuList />
        <section className={styles.items}>
          <div className={styles.catchphrase}>
            DO YOU
            <br />
            WANT TO
            <br />
            KNOW
            <br />
            ABOUT ME
            <br />?
          </div>
          <div className={styles.boxContainer}>
            <p className={styles.boxMsg}>
              Click to <br />
              see my <br />
              <strong>Box</strong>
            </p>
            <BoxIcon />
          </div>
        </section>
      </div>
    </div>
  );
}
