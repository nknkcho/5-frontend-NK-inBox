import { useEffect, useState, MouseEventHandler } from "react";
import Image from "next/image";
import styles from "../portfolio/PortfolioContent.module.scss";
import filter from "../../utils/filters";
import { dummy } from "../../utils/portfolioDummy";

export default function PortfolioFooter() {
  const data = dummy.filter((element) => {
    if (element.id === 1) {
      return true;
    }
  });
  const [showImg, setShowImg] = useState(true);
  const [changeImg, setChangeImg] = useState(false);
  const onclickHandler = () => {
    setChangeImg((current) => !current);
  };
  const portfolioFilter = filter[Math.floor(Math.random() * filter.length)];
  useEffect(() => {
    const selectedFilter = localStorage.getItem("filter");
    if (selectedFilter === "ON") {
      setShowImg(true);
    } else {
      setShowImg(false);
    }
  }, [showImg]);

  return (
    <>
      <div className={styles.portfolioFilter}>
        {showImg && (
          <div>
            <Image
              alt="Inbox filter for portfolios"
              src={portfolioFilter}
              layout="responsive"
            />
          </div>
        )}
      </div>
      <div className={styles.footer}>
        <div className={styles.footerItem}>
          <span className={styles.description}>{data[0].title}</span>
        </div>
        <div className={styles.footerItem}>
          <button className={styles.nextBtn} onClick={onclickHandler}>
            Go to other Project
          </button>
        </div>
        <div className={styles.footerItem}>
          <span className={styles.description}>
            {data[0].date} | {data[0].about}
          </span>
        </div>
      </div>
    </>
  );
}
