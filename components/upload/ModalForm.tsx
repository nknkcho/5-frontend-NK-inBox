import { useState } from "react";
import Image from "next/image";
import styles from "./ModalForm.module.scss";
import closePic from "../../public/close.svg";
import FormList from "./ModalFormList";
import DropzoneComponent from './DropzoneComponent';

export default function ModalForm(props:{ closeModal: Function }) {
  const [isLoading, setIsLoading] = useState(false);
  const saveOptionDataHandler = (enteredOptionData : Object) => {
    const optionData = {
      ...enteredOptionData
    };
    console.log(optionData);
    return optionData
  }

  const handleSubmit = (e: { preventDefault: () => void; }) => {
    e.preventDefault();
  }

  return (
    <div className={styles.modalBackground}>
      <div className={styles.modalContainer}>
        <button className={styles.closeBtn} onClick={() => props.closeModal(false)}>
          <Image alt="Close" src={closePic} width={40} height={40} />
        </button>
        <h2 className={styles.modalTitle}>Upload your Box</h2>
        <form onSubmit={handleSubmit} className={styles.formContainer}>
          <DropzoneComponent />
          <FormList saveOptionDataHandler={saveOptionDataHandler}/>
          <div>
            <input
              type="submit"
              value="Please enter the contents"
              disabled={isLoading}
              className={styles.submitBtn}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
