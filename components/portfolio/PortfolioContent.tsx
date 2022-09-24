import { useEffect, useState } from 'react'
import Image from 'next/image'
import styles from '../portfolio/PortfolioContent.module.scss'
import filter from '../../utils/filters'
import { getRequest } from '../../utils/fetchData'
import { useRecoilValue } from 'recoil'
import SelectedFilter from '../../state/SelectedFilter'

interface FilterImageProps {
  animation: boolean
  portfolioFilter: string | StaticImport
  imgState: Function
}

export const FilterImage = (props: FilterImageProps) => {
  return (
    <div
      className={
        props.animation ? `${styles.imgWrapper} ${styles.fadeInClass}` : `${styles.imgWrapper}`
      }
      onClick={e => props.imgState(e)}
    >
      <Image
        alt="Inbox filter for portfolios"
        src={props.portfolioFilter}
        layout="fill"
        objectFit="cover"
        priority
      />
    </div>
  )
}

interface Content {
  message: string
  range: string
  title: string
  fileName: string
  extension: string
  portfolioDate: string
  about: string
  email: string
  createdDate: string
}

export default function PortfolioFooter(props: { content: Content }) {
  // 영상의 경로를 return하는 함수
  const videoPath = (fileName: string, extension: string) => {
    const path = `https://inbox-portfolio.s3.ap-northeast-2.amazonaws.com/${fileName}.${extension}`
    return path
  }
  // 페이지 첫 로딩 시, 받아오는 데이터를 받아오는 변수
  const portfolioData = props.content
  // 포트폴리오 비디오 source의 상태
  const [videoSrc, setVideoSrc] = useState(
    videoPath(portfolioData.fileName, portfolioData.extension)
  )
  // 포트폴리오 비디오 확장자의 상태
  const [videoType, setVideoType] = useState(`video/${portfolioData.extension}`)
  // 포트폴리오 제목의 상태
  const [title, setTitle] = useState(portfolioData.title)
  // 포트폴리오 업로드일의 상태
  const [date, setDate] = useState(portfolioData.portfolioDate)
  // 포트폴리오 설명의 상태
  const [about, setAbout] = useState(portfolioData.about)
  // setting 설정에 따라 filter 이미지를 보여줄 것인지를 결정하는 상태
  const [showImg, setShowImg] = useState(true)
  // selected filter 상태 값 읽어오기
  const currentFilter = useRecoilValue(SelectedFilter)
  // 포트폴리오 전환 버튼 클릭 시 발생하는 이벤트
  const onclickHandler = async () => {
    const res = await getRequest('portfolios/file')
    const newData = await res.json()
    if (newData.message === 'not_exist') {
      return alert('Oops! No more data')
    }
    const newPath = videoPath(newData.fileName, newData.extension)
    setVideoSrc(newPath)
    setVideoType(`video/${newData.extension}`)
    setTitle(newData.title)
    setDate(newData.portfolioDate)
    setAbout(newData.about)
    setAnimation(current => !current)
    filterStatus()
  }

  // 필터 이미지 클릭시 필터 이미지가 없어지고 동영상이 나타나는 이벤트
  const filterImgClickHandler = async () => {
    setShowImg(false)
  }

  // 필터 이미지 불러오기
  const portfolioFilter = filter[Math.floor(Math.random() * filter.length)]
  // 이미지 애니메이션 변경을 위한 상태값
  const [animation, setAnimation] = useState(false)
  const filterStatus = () => {
    if (currentFilter === false) {
      setShowImg(true)
    } else {
      setShowImg(false)
    }
  }

  // 페이지 로딩 시, filter 세팅값에 따라 이미지를 보여줄 것인지에 따라 상태값 업데이트
  useEffect(() => {
    if (currentFilter === false) {
      setShowImg(true)
    } else {
      setShowImg(false)
    }
  }, [currentFilter])

  return (
    <>
      <div className={styles.portfolioFilter}>
        {showImg && animation && (
          <FilterImage
            animation={animation}
            portfolioFilter={portfolioFilter}
            imgState={filterImgClickHandler}
          />
        )}
        {showImg && !animation && (
          <FilterImage
            animation={!animation}
            portfolioFilter={portfolioFilter}
            imgState={filterImgClickHandler}
          />
        )}
        {!showImg && (
          <video className={styles.video} key={videoSrc} autoPlay controls>
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
  )
}
