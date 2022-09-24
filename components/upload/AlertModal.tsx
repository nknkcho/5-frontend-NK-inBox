import Image from 'next/image'
import closePic from '../../public/close.svg'
import styles from './AlertModal.module.scss'

interface AlertProps {
  setting: {
    message: string
    status: string
  }
  closeButton: Function
}

const Alert = ({ setting, closeButton }: AlertProps) => {
  return (
    <section className={styles.alertBackground}>
      <div className={setting.status === 'error' ? styles.errorContainer : styles.okContainer}>
        <button className={styles.closeBtn} onClick={() => closeButton(false)}>
          <Image
            alt="Close button of In-box portfolio uploading modal"
            src={closePic}
            width={30}
            height={30}
          />
        </button>
        <p className={styles.alertText}>{setting.message}</p>
      </div>
    </section>
  )
}

export default Alert
