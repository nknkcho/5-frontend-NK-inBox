// 왜 a 태그가 아니고 Link를 썼나요? a 태그를 쓰게 되면 페이지가 새롭게 랜더링 되어 next의 특징이자 장점인 SSG가 사라집니다.
import Link from "next/link"
import styles from "./HeaderMenu.module.scss"

export default function MenuList() {
  return (
    <>
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
    </>
  );
}
