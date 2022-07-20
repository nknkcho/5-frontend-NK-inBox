import Link from "next/link"
import styles from "./HeaderMenu.module.scss"

export default function MenuList() {
  return (
    <div className={styles.homeContainer}>
      <div className={styles.menuContainer}>
        <Link href={"/"}>
          <a>
            <h2 className={styles.logo}>IN-BOX</h2>
          </a>
        </Link>
        <ul className={styles.listContainer}>
          <li className={styles.li}>
            <Link href={"/setting"}>Setting</Link>
          </li>
          <li className={[styles.li, styles.secondLi].join(" ")}>
            <a href="mailto:srirachacho@gmail.com">
              Contact
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
