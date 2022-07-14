import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import AWS from "aws-sdk";
import sha256 from "crypto-js/sha256";
import styles from "./DropzoneComponent.module.scss";

export default function DropzoneComponent() {
  const [progress, setProgress] = useState(0);
  const [selectedFile, setSelectedFile] = useState(null);

  AWS.config.update({
    accessKeyId: process.env.ACCESS_KEY,
    secretAccessKey: process.env.SECRET_KEY,
  });

  const myBucket = new AWS.S3({
    params: { Bucket: process.env.BUCKET_NAME },
    region: process.env.REGION,
  });

  const onDrop = ((acceptedFiles: any) => {
    setProgress(0);
    setSelectedFile(acceptedFiles[0]);
  });


  const uploadToBucket = (selectedFile) => {
    if(selectedFile === null || undefined){
      return
    }
    const params = {
      ACL: "public-read",
      Body: selectedFile,
      Bucket: process.env.BUCKET_NAME,
      Key: "upload/" + sha256(selectedFile.name).toString(),
    };

    myBucket.putObject(params)
    .on("httpUploadProgress", (event) => {
      setProgress(Math.round((event.loaded / event.total) * 100))
    }).send((error) => {
      if(error) console.log(error);
    });
  };

  if(selectedFile !== null || undefined){
    uploadToBucket(selectedFile);
  }
  console.log(selectedFile);

  const {
    acceptedFiles,
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    onDrop,
    accept: {
      "video/*": [],
    },
  });

  // FIXME: type 설정 문제
  // const files = acceptedFiles.map((file: any) => (
  //   <li key={file.path}>
  //     {file.path} - {file.size} bytes
  //   </li>
  // ));

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
        <div>{progress}</div>
        {isDragActive ? (
          isDragAccept ? (
            <>
              <div className={styles.dropzoneHeadTitle}>You can upload!</div>
              <div className={styles.dropzoneSubTitle}>Drop files here.</div>
            </>
          ) : (
            <>
              <div className={styles.dropzoneHeadTitle}>
                File type is not allowed
              </div>
              <div className={styles.dropzoneSubTitle}>
                Please upload another file.
              </div>
            </>
          )
        ) : (
          <>
            <div className={styles.dropzoneHeadTitle}>File Upload</div>
            <div className={styles.dropzoneSubTitle}>Drop files here.</div>
          </>
        )}
      </div>
    </section>
  );
}
