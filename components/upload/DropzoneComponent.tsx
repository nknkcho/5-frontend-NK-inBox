import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import styles from "./DropzoneComponent.module.scss";

export default function DropzoneComponent() {
  const onDrop = useCallback((acceptedFiles: any) => {
    console.log(acceptedFiles);
  }, []);
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

  const files = acceptedFiles.map((file: any) => (
    <li key={file.path}>
      {file.path} - {file.size} bytes
    </li>
  ));

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
        {isDragActive ? isDragAccept ? (
          <>
            <div className={styles.dropzoneHeadTitle}>You can upload!</div>
            <div className={styles.dropzoneSubTitle}>Drop files here.</div>
          </>
        ) : (
          <>
            <div className={styles.dropzoneHeadTitle}>File type is not allowed</div>
            <div className={styles.dropzoneSubTitle}>Please upload another file.</div>
          </>
        ) : (
          <>
            <div className={styles.dropzoneHeadTitle}>File Upload</div>
            <div className={styles.dropzoneSubTitle}>
            Drop files here.
            </div>
          </>
        )}
      </div>
      <aside>
        <ul>{files}</ul>
      </aside>
    </section>
  );
}
