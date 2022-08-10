import { useState } from 'react'
import Image from 'next/image'
import styles from './ModalForm.module.scss'
import closePic from '../../public/close.svg'
import FormList from './ModalFormList'
import Dropzone from "./Dropzone"

export default function ModalForm(props: { closeModal: Function }) {
  // 업로드된 파일의 key
  const [fileKey, setFileKey] = useState('')
  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <button className={styles.closeBtn} onClick={() => props.closeModal(false)}>
          <Image alt="Close" src={closePic} width={40} height={40} />
        </button>
        <h2 className={styles.modalTitle}>Upload your Box</h2>
        <form className={styles.formContainer}>
          <Dropzone setFileKey={setFileKey}/>
          <FormList path={fileKey} />
        </form>
      </div>
    </div>
  )
}
