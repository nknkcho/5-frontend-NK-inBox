import MenuList from "./HeaderMenu";
import HeaderBox from "./HeaderBox";
import styles from "./Header.module.scss";

export default function Header() {
  return (
    <>
      <div className={styles.header}>
        <MenuList />
        <HeaderBox />
      </div>
    </>
  );
}
