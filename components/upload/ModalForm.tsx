import { useState } from 'react'
import Image from 'next/image'
import { useDropzone } from 'react-dropzone'
import AWS from 'aws-sdk'
import sha256 from 'crypto-js/sha256'
import styles from './ModalForm.module.scss'
import closePic from '../../public/close.svg'
import FormList from './ModalFormList'

const DropdownZone = ({ setFileKey }: { setFileKey : Function }) => {
  // 파일 업로드 진행 상황을 확인할 수 있는 progress bar를 위한 State
  const [progress, setProgress] = useState(0)

  // S3 접근을 위한 AWS 계정 설정
  AWS.config.update({
    accessKeyId: process.env.NEXT_PUBLIC_ACCESS_KEY,
    secretAccessKey: process.env.NEXT_PUBLIC_SECRET_KEY,
  })

  // S3의 버켓 접근
  const s3 = new AWS.S3({
    params: { Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME },
    region: process.env.NEXT_PUBLIC_REGION,
  })

  interface DroppedFile {
    type: string
    name: string | CryptoJS.lib.WordArray
  }

  // dropzone에 들어온 파일을 받는 함수
  const onDrop = (files: Array<DroppedFile>) => {
    const acceptedFiles = files[0]
    setFileKey(`${sha256(acceptedFiles.name).toString()}.${acceptedFiles.type.substring(6)}`)
    setProgress(0)
    uploadToBucket(acceptedFiles)
  }

  // S3 버켓에 파일을 올리는 함수
  const uploadToBucket = async (selectedFile: DroppedFile | null) => {
    if (!selectedFile) {
      return
    }

    interface FileParams {
      ACL: string
      Body: DroppedFile
      Bucket: string
      Key: string
    }

    // 파일 확장자 정보 담기
    const params: FileParams = {
      ACL: 'public-read',
      Body: selectedFile,
      // ! means 'this value will not be undefined'
      Bucket: process.env.NEXT_PUBLIC_BUCKET_NAME!,
      Key: `${sha256(selectedFile.name).toString()}.${selectedFile.type.substring(6)}`,
    }

    // FIXME: params : No overload matches this call. 이라는 에러의 의미?
    s3.putObject(params)
      .on('httpUploadProgress', event => {
        setProgress(Math.round((event.loaded / event.total) * 100))
      })
      .send(error => {
        if (error) console.log(error)
      })
  }

  const { getRootProps, getInputProps, isDragActive, isDragAccept, isDragReject } = useDropzone({
    onDrop,
    accept: {
      'video/mp4': [],
      'video/avi': [],
      'video/webm': [],
      'video/wmv': [],
      'video/mov': [],
    },
  })

  const isDragAcceptHandler = (isDragAccept: boolean) => {
    if (isDragAccept) {
      return (
        <>
          <div className={styles.dropzoneHeadTitle}>You can upload!</div>
          <div className={styles.dropzoneSubTitle}>Drop files here.</div>
        </>
      )
    }
    return (
      <>
        <div className={styles.dropzoneHeadTitle}>File type is not allowed</div>
        <div className={styles.dropzoneSubTitle}>Please upload another file.</div>
      </>
    )
  }

  const isDragActiveHandler = (isDragActive: boolean) => {
    if (isDragActive) {
      return isDragAcceptHandler(isDragAccept)
    }
    return (
      <>
        <div className={styles.dropzoneHeadTitle}>File Upload</div>
        <div className={styles.dropzoneSubTitle}>Drop files here.</div>
      </>
    )
  }

  return (
    <section>
      <div
        {...getRootProps({
          className: `${styles.dropzoneContainer}
          ${isDragAccept && styles.dropzoneAccept}
          ${isDragReject && styles.dropzoneReject}`,
        })}
      >
        <input {...getInputProps()} />
        {isDragActiveHandler(isDragActive)}
        <div className={styles.dropzoneProgress}>{progress}%</div>
      </div>
    </section>
  )
}

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
          <DropdownZone setFileKey={setFileKey}/>
          <FormList path={fileKey} />
        </form>
      </div>
    </div>
  )
}
