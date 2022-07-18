import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { getRequest } from "../../utils/fetchData";
import styles from "./SettingList.module.scss";
import ModalForm from "../../components/upload/ModalForm";

// TODO: String과 string의 차이 : String == new String(), string = ""
export const Button: React.FC<{
  cb: Function;
  btnClick: Boolean;
  option: String;
  value: string;
}> = (props) => {
  return (
    <button
      className={styles.rangeBtn}
      onClick={(e) => props.cb(e)}
      value={props.value}
      style={{
        backgroundColor: props.btnClick ? "#FFB800" : "#FFFFFF66",
        color: props.btnClick ? "#FFFFFFCC" : "#FFFFFF",
      }}
    >
      {props.option}
    </button>
  );
};

// export 이유 : Info 페이지에 동일한 컴포넌트를 사용하기 때문
export const GoBackButton = () => {
  return (
    <button className={styles.backBtn} onClick={useRouter().back}>
      &lt; GO BACK
    </button>
  );
};

interface CategoryProps {
  category: string;
}

// export 이유 : Info 페이지에 동일한 컴포넌트를 사용하기 때문
export const Category: React.FC<CategoryProps> = (props: CategoryProps) => {
  return <p className={styles.text}>{props.category || "Info"}</p>;
};

export default function SettingList() {
  const [openModal, setOpenModal] = useState(false);
  const [onBtnClick, setOnBtnClick] = useState(false);
  // range 버튼은 왜 state를 분리했는가? range 두 버튼 모두 선택하는 경우도 있기 때문
  const [rangeLeftClick, setRangeLeftClick] = useState(false);
  const [rangeRightClick, setRangeRightClick] = useState(false);

  // 페이지 첫 로딩(혹은 새로고침) 시, 기존 Setting 값을 유지하기 위해 useEffect 사용
  useEffect(() => {
    const selectedFilter = localStorage.getItem("filter");
    if (selectedFilter === "off") {
      setOnBtnClick(true);
    }
    const selectedRange = localStorage.getItem("range") || "febe";
    if (selectedRange === "fe") {
      setRangeRightClick(true);
    } else if (selectedRange === "be") {
      setRangeLeftClick(true);
    }
  }, [onBtnClick, rangeLeftClick, rangeRightClick]);

  const handleFilterClick = async (e: { target: HTMLInputElement }) => {
    try {
      // 유저가 선택된 버튼을 또 한 번 누를 경우, 클릭한 버튼과 설정값이 달라지기 때문에 해당 경우를 포함하여 조건문 작성
      if (e.target.value == "on" && onBtnClick == false) {
        localStorage.setItem("filter", "off");
      } else if (e.target.value == "off" && onBtnClick == true) {
        localStorage.setItem("filter", "on");
      } else {
        localStorage.setItem("filter", e.target.value);
      }
      setOnBtnClick((current) => !current);
      const result = await getRequest(`filters/${e.target.value}`);
      console.log(result);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRangeLeftClick = () => {
    if (rangeRightClick === true) {
      localStorage.setItem("range", "fe");
      return rangeLeftClick === false;
    } else if (rangeLeftClick === false && rangeRightClick === false) {
      localStorage.setItem("range", "be");
    } else {
      localStorage.setItem("range", "febe");
    }
    setRangeLeftClick((current) => !current);
  };

  const handleRangeRightClick = () => {
    if (rangeLeftClick === true) {
      localStorage.setItem("range", "be");
      return rangeRightClick === false;
    } else if (rangeLeftClick === false && rangeRightClick === false) {
      localStorage.setItem("range", "fe");
    } else {
      localStorage.setItem("range", "febe");
    }
    setRangeRightClick((current) => !current);
  };

  return (
    <>
      {openModal && <ModalForm closeModal={setOpenModal} />}
      <div className={styles.settingContainer}>
        <div className={styles.optionRow}>
          <Category category={"Filter"} />
          <div>
            <Button
              value="on"
              cb={handleFilterClick}
              btnClick={onBtnClick}
              option={"ON"}
            />
            <Button
              value="off"
              cb={handleFilterClick}
              btnClick={!onBtnClick}
              option={"OFF"}
            />
          </div>
        </div>
        <div>
          <button
            className={styles.text}
            onClick={() => {
              setOpenModal(true);
            }}
          >
            Upload
          </button>
        </div>
        <div className={styles.optionRow}>
          <Category category={"Range"} />
          <div>
            <Button
              value="fe"
              cb={handleRangeLeftClick}
              btnClick={rangeLeftClick}
              option={"FE"}
            />
            <Button
              value="be"
              cb={handleRangeRightClick}
              btnClick={rangeRightClick}
              option={"BE"}
            />
          </div>
        </div>
        <div className={styles.optionRow}>
          <Link href="/info">
            <a className={styles.text}>Info</a>
          </Link>
          <div>
            <GoBackButton />
          </div>
        </div>
      </div>
    </>
  );
}
