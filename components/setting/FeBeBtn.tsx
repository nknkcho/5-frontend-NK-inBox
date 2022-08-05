import { useEffect, useState } from "react";
import styles from "../setting/SettingList.module.scss"
import { getRequest } from "../../utils/fetchData";

export default function FeBeBtn() {
  // range 버튼은 왜 state를 분리했는가? 유저가 range 두 버튼 모두 선택하는 경우도 있기 때문
  const [rangeLeftClick, setRangeLeftClick] = useState(false);
  const [rangeRightClick, setRangeRightClick] = useState(false);

  // 페이지 첫 로딩(혹은 새로고침) 시, 기존 Setting 값을 유지하기 위해 useEffect 사용
  useEffect(() => {
    const selectedRange = localStorage.getItem("range") || "febe";
    if (selectedRange === "fe") {
      setRangeRightClick(true);
    } else if (selectedRange === "be") {
      setRangeLeftClick(true);
    }
  }, [rangeLeftClick, rangeRightClick]);

  const handleRangeLeftClick = async () => {
    if (rangeRightClick === true) {
      localStorage.setItem("range", "fe");
      return rangeLeftClick === false;
    } else if (rangeLeftClick === false && rangeRightClick === false) {
      localStorage.setItem("range", "be");
    } else {
      localStorage.setItem("range", "febe");
    }
    setRangeLeftClick((current) => !current);
    await getRequest(`portfolios/range/fe`);
    await getRequest(`cookies`);
  };

  const handleRangeRightClick = async () => {
    if (rangeLeftClick === true) {
      localStorage.setItem("range", "be");
      return rangeRightClick === false;
    } else if (rangeLeftClick === false && rangeRightClick === false) {
      localStorage.setItem("range", "fe");
    } else {
      localStorage.setItem("range", "febe");
    }
    setRangeRightClick((current) => !current);
    await getRequest(`portfolios/range/be`);
    await getRequest(`cookies`);
  };
  return (
    <div>
    <button
      className={styles.rangeBtn}
      onClick={handleRangeLeftClick}
      value="fe"
      style={{
        backgroundColor: rangeLeftClick ? "#FFB800" : "#FFFFFF66",
        color: rangeLeftClick ? "#FFFFFFCC" : "#FFFFFF",
      }}
    >
      FE
    </button>
    <button
      className={styles.rangeBtn}
      onClick={handleRangeRightClick}
      value="be"
      style={{
        backgroundColor: rangeRightClick ? "#FFB800" : "#FFFFFF66",
        color: rangeRightClick ? "#FFFFFFCC" : "#FFFFFF",
      }}
    >
      BE
    </button>
    </div>
  )
}