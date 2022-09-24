import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import styles from './SettingList.module.scss'
import ModalForm from '../../components/upload/ModalForm'
import OnOffBtn from '../setting/OnOffBtn'
import FeBeBtn from '../setting/FeBeBtn'

// export 이유 : Info 페이지에 동일한 컴포넌트를 사용하기 때문
export const GoBackButton = () => {
  return (
    <div>
      <button className={styles.backBtn} onClick={useRouter().back}>
        &lt; GO BACK
      </button>
    </div>
  )
}

interface CategoryProps {
  category?: string
}

// export 이유 : Info 페이지에 동일한 컴포넌트를 사용하기 때문
export const Category: React.FC<CategoryProps> = (props: CategoryProps) => {
  return <p className={styles.text}>{props.category || 'Info'}</p>
}

export default function SettingList() {
  const [openModal, setOpenModal] = useState(false)
  return (
    <>
      {openModal && <ModalForm closeModal={setOpenModal} />}
      <div className={styles.settingContainer}>
        <div className={styles.optionRow}>
          <Category category={'Thumbnail'} />
          <OnOffBtn />
        </div>
        <div>
          <button
            className={styles.text}
            onClick={() => {
              setOpenModal(true)
            }}
          >
            Upload
          </button>
        </div>
        <div className={styles.optionRow}>
          <Category category={'Range'} />
          <FeBeBtn />
        </div>
        <div className={styles.optionRow}>
          <Link href="/info">
            <a className={styles.text}>Info</a>
          </Link>
          <GoBackButton />
        </div>
      </div>
    </>
  )
}
