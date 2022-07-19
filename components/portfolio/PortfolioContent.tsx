import { useEffect, useState } from "react";
import Image from "next/image";
import styles from "../portfolio/PortfolioContent.module.scss";
import filter from "../../utils/filters";
import { getRequest } from "../../utils/fetchData";

type Content = {
  message: string;
  range: string;
  title: string;
  fileName: string;
  extension: string;
  portfolioDate: string;
  about: string;
  email: string;
  createdDate: string;
};

export default function PortfolioFooter(props: { content: Content }) {
  const videoPath = (fileName: string, extension: string) => {
    const path = `https://inbox-portfolio.s3.ap-northeast-2.amazonaws.com/${fileName}.${extension}`;
    return path;
  };
  const portfolioData = props.content;
  const [videoSrc, setVideoSrc] = useState(
    videoPath(portfolioData.fileName, portfolioData.extension)
  );
  const [videoType, setVideoType] = useState(
    `video/${portfolioData.extension}`
  );
  const [title, setTitle] = useState(portfolioData.title);
  const [date, setDate] = useState(portfolioData.portfolioDate);
  const [about, setAbout] = useState(portfolioData.about);
  const [showImg, setShowImg] = useState(true);
  const [changeImg, setChangeImg] = useState(false);
  const onclickHandler = async () => {
    setChangeImg((current) => !current);
    const res = await getRequest("portfolios/file");
    const newData = await res.json();
    console.log(newData);
    const newPath = videoPath(newData.fileName, newData.extension);
    setVideoSrc(newPath);
    setVideoType(`video/${newData.extension}`);
    setTitle(newData.title);
    setDate(newData.portfolioDate);
    setAbout(newData.about);
  };
  const portfolioFilter = filter[Math.floor(Math.random() * filter.length)];

  useEffect(() => {
    const selectedFilter = localStorage.getItem("filter");
    if (selectedFilter === "on") {
      setShowImg(true);
    } else {
      setShowImg(false);
    }
  }, [showImg]);

  return (
    <>
      <div className={styles.portfolioFilter}>
        {showImg && (
          <div className={ changeImg ? styles.fadeInClass : ""}>
            <Image
              alt="Inbox filter for portfolios"
              src={portfolioFilter}
              layout="responsive"
              width={100}
              height={39}
            />
          </div>
        )}
        {!showImg && (
          <video className={styles.video} key={videoSrc} controls>
            <source src={videoSrc} type={videoType} />
          </video>
        )}
      </div>
      <div className={styles.footer}>
        <div className={`${styles.footerItem} ${styles.footerTitle}`}>
          <span className={styles.description}>{title}</span>
        </div>
        <div className={styles.footerItem}>
          <button className={styles.nextBtn} onClick={onclickHandler}>
            Go to other Project
          </button>
        </div>
        <div className={`${styles.footerItem} ${styles.footerDescription}`}>
          <p className={styles.description}>{date}</p>
          <p className={styles.description}>{about}</p>
        </div>
      </div>
    </>
  );
}
