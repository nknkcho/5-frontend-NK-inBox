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
  // 영상의 경로를 return하는 함수
  const videoPath = (fileName: string, extension: string) => {
    const path = `https://inbox-portfolio.s3.ap-northeast-2.amazonaws.com/${fileName}.${extension}`;
    return path;
  };
  // 페이지 첫 로딩 시, 받아오는 데이터를 받아오는 변수
  const portfolioData = props.content;
  // 포트폴리오 비디오 source의 상태
  const [videoSrc, setVideoSrc] = useState(
    videoPath(portfolioData.fileName, portfolioData.extension)
  );
  // 포트폴리오 비디오 확장자의 상태
  const [videoType, setVideoType] = useState(
    `video/${portfolioData.extension}`
  );
  // 포트폴리오 제목의 상태
  const [title, setTitle] = useState(portfolioData.title);
  // 포트폴리오 업로드일의 상태
  const [date, setDate] = useState(portfolioData.portfolioDate);
  // 포트폴리오 설명의 상태
  const [about, setAbout] = useState(portfolioData.about);
  // setting 설정에 따라 filter 이미지를 보여줄 것인지를 결정하는 상태
  const [showImg, setShowImg] = useState(true);
  // 포트폴리오 전환 버튼 클릭 시 발생하는 이벤트
  const onclickHandler = async () => {
    await getRequest(`cookies`);
    setAnimation((current) => !current);
    const res = await getRequest("portfolios/file");
    const newData = await res.json();
    const newPath = videoPath(newData.fileName, newData.extension);
    setVideoSrc(newPath);
    setVideoType(`video/${newData.extension}`);
    setTitle(newData.title);
    setDate(newData.portfolioDate);
    setAbout(newData.about);
  };

  // 필터 이미지 불러오기
  const portfolioFilter = filter[Math.floor(Math.random() * filter.length)];
  // 이미지 애니메이션 변경을 위한 상태값
  const [animation, setAnimation] = useState(false);

  // 페이지 로딩 시, filter 세팅값에 따라 이미지를 보여줄 것인지에 따라 상태값 업데이트
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
        {showImg && animation && (
          <>
            <div className={styles.imgWrapper}>
              <div
                className={
                  animation
                    ? `${styles.frontImg} ${styles.fadeInClass}`
                    : `${styles.frontImg}`
                }
              >
                <Image
                  alt="Inbox filter for portfolios"
                  src={portfolioFilter}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </>
        )}
        {showImg && !animation && (
          <>
            <div className={styles.imgWrapper}>
              <div
                className={
                  animation
                    ? `${styles.frontImg}`
                    : `${styles.frontImg} ${styles.fadeInClass}`
                }
              >
                <Image
                  alt="Inbox filter for portfolios"
                  src={portfolioFilter}
                  layout="fill"
                  objectFit="cover"
                />
              </div>
            </div>
          </>
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
