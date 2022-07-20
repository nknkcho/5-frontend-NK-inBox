import React, { useState } from "react";
import styles from "./ModalFormList.module.scss";
import { postRequest } from "../../utils/fetchData";

// List 컴포넌트의 타입
type ListProps = {
  text: string;
  maxLength: number;
  placeholder: string;
  name: string;
  option: string;
  inputHandler: (e: React.ChangeEvent<HTMLInputElement>) => void;
  validate: boolean;
  children?: JSX.Element | JSX.Element[];
};

// List 컴포넌트
// FIXME: 유사한 모양이지만 구조가 달라 만들지 못하는 경우는 어떻게 할까?
const List = ({
  text,
  maxLength,
  name,
  placeholder,
  option,
  inputHandler,
  validate,
}: ListProps) => {
  return (
    <div className={styles.inputComponent}>
      <div className={styles.inputLabel}>{text}</div>
      <input
        className={styles.inputBox}
        maxLength={maxLength}
        name={name}
        type="text"
        placeholder={placeholder}
        value={option}
        onChange={inputHandler}
        required
        style={{ borderColor: validate ? "" : "red" }}
      />
    </div>
  );
};

export default function FormList(props: { path: string }) {
  // Range 버튼 관련 상태
  const [enteredRange, setEnteredRange] = useState("fe");
  const [onBtnClick, setOnBtnClick] = useState(false);
  // input의 스타일 관련 상태
  const [checkTitle, setCheckTitle] = useState(true);
  const [checkDate, setCheckDate] = useState(true);
  const [checkAbout, setCheckAbout] = useState(true);
  const [checkEmail, setCheckEmail] = useState(false);
  const [checkCode, setCheckCode] = useState(true);
  const [sendCodeBtnText, setSendCodeBtnText] = useState("SEND CODE");
  // 이메일 fetch 응답값 관련 상태
  const [getConfirmIdx, setGetConfirmIdx] = useState(0);
  // input 입력 관련 상태
  const [inputs, setInputs] = useState({
    title: "",
    date: "",
    about: "",
    email: "",
    code: "",
    formErrors: { title: "", date: "", about: "", email: "", code: "" },
    titleValid: false,
    dateValid: false,
    aboutValid: false,
    emailValid: false,
    codeValid: false,
  });
  const { title, date, about, email, code } = inputs;
  // date 유효성 체크를 위한 함수
  function validDateString(s: string) {
    const match = s.match(/^(\d{4})(\d\d)(\d\d)$/);
    if (match) {
      const [year, month, day] = match.slice(1);
      const iso = `${year}-${month}-${day}T00:00:00.000Z`;
      const date = new Date(
        Date.UTC(Number(year), Number(month) - 1, Number(day))
      );
      return date.toISOString() === iso;
    }
    return false;
  }

  // email 유효성 체크를 위한 함수
  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  );
  // email 유효성 검사 통과 후, 버튼 클릭 시 버튼 스타일 변경 및 이메일 코드 fetch 요청 event
  const handleSendCode = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      setSendCodeBtnText("RESEND");
      const result: any = await postRequest("portfolios/email", { email });
      setGetConfirmIdx(result.confirmIdx);
    } catch (error) {
      console.log(error);
    }
  };

  // 전체 유저 입력값의 유효성 검사 함수
  const inputHandler = (e: {
    preventDefault: Function;
    target: { value: string; name: string };
  }) => {
    e.preventDefault();
    const { value, name } = e.target;
    // FIXME: any 말고 어떤거?
    let formErrors: any = inputs.formErrors;
    let titleValid = inputs.titleValid;
    let dateValid = inputs.dateValid;
    let aboutValid = inputs.aboutValid;
    let emailValid = inputs.emailValid;
    let codeValid = inputs.codeValid;
    switch (name) {
      case "title":
        titleValid = value.length > 2;
        formErrors.title = titleValid
          ? setCheckTitle(true)
          : setCheckTitle(false);
        break;
      case "date":
        dateValid = validDateString(value);
        formErrors.date = dateValid ? setCheckDate(true) : setCheckDate(false);
        break;
      case "about":
        aboutValid = value.length > 2;
        formErrors.about = aboutValid
          ? setCheckAbout(true)
          : setCheckAbout(false);
        break;
      case "email":
        value ? "" : setSendCodeBtnText("SEND CODE"),
          (emailValid = validEmailRegex.test(value));
        formErrors.email = emailValid
          ? setCheckEmail(true)
          : setCheckEmail(false);
      case "code":
        codeValid = value.length == 6;
        formErrors.code = codeValid ? setCheckCode(true) : setCheckCode(false);
      default:
        break;
    }

    setInputs({
      ...inputs,
      [name]: value,
      titleValid: titleValid,
      dateValid: dateValid,
      aboutValid: aboutValid,
      emailValid: emailValid,
      codeValid: codeValid,
    });
  };

  // Range 클릭 이벤트 발생 시
  const handleRangeClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // 버튼의 스타일 변경
    setOnBtnClick((current) => !current);
    // 클릭한 버튼의 값을 state에 업데이트
    const btnValue: HTMLInputElement = e.currentTarget;
    setEnteredRange(btnValue.value.toLowerCase());
  };

  // 부모 컴포넌트로부터 파일 key 값을 받아왔는 지 확인하는 함수
  const checkFilePath = () => {
    if (!props.path) return false;
    true;
  };

  // 유효성 검사 통과 여부를 확인하는 변수
  const validationData = [
    inputs.titleValid,
    inputs.dateValid,
    inputs.aboutValid,
    inputs.emailValid,
    inputs.codeValid,
    checkFilePath(),
  ];

  // 유저가 파일, title, date, about, email, code 데이터를 모두 다 입력했는지 확인하는 함수
  // formValid 변수를 별도로 만든 이유? 입력값이 모두 충족되는지에 따라 form submit button의 스타일이 변경 되어야 하기 때문
  let formValid = true;
  const validationCheck = () => {
    if (validationData.find((v) => v === false) === false) {
      formValid = false;
      return false;
    }
    formValid = true;
    return true;
  };
  validationCheck();

  // form 전체 데이터를 formListData에 객체화
  const formListData = {
    range: enteredRange,
    title: title,
    date: date,
    about: about,
    email: email,
    confirmCode: code,
    confirmIdx: getConfirmIdx,
    filePath: props.path,
  };

  // validationData 중 하나라도 false가 있을 경우 최종 유효성 검사 변수인 formValid가 false
  const submitFormDataHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    try {
      if (validationCheck() == false) {
        alert("Please check your input");
        return;
      }
      const result = await postRequest("portfolios", formListData);
      return;
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <div className={styles.inputLayout}>
        <div className={styles.inputComponent}>
          <div className={styles.inputLabel}>Range.</div>
          <div className={styles.rangeInputContainer}>
            <input
              className={styles.inputBtn}
              name="range"
              type={"button"}
              value={"FE"}
              onClick={handleRangeClick}
              style={{
                backgroundColor: !onBtnClick ? "#FFB800" : "#FFCC0011",
                color: !onBtnClick ? "#FFFFFFCC" : "#FFB800",
              }}
            />
            <input
              className={styles.inputBtn}
              name="range"
              type={"button"}
              value={"BE"}
              onClick={handleRangeClick}
              style={{
                backgroundColor: onBtnClick ? "#FFB800" : "#FFCC0011",
                color: onBtnClick ? "#FFFFFFCC" : "#FFB800",
              }}
            />
          </div>
        </div>
        <List
          text={"Title."}
          maxLength={20}
          placeholder={""}
          name={"title"}
          option={title}
          inputHandler={inputHandler}
          validate={checkTitle}
        />
        <List
          text={"Date."}
          maxLength={8}
          placeholder={"20220000"}
          name={"date"}
          option={date}
          inputHandler={inputHandler}
          validate={checkDate}
        />
        <List
          text={"About."}
          maxLength={20}
          placeholder={"Write a brief introduction"}
          name={"about"}
          option={about}
          inputHandler={inputHandler}
          validate={checkAbout}
        />
        <div className={styles.inputComponent}>
          <div className={styles.inputLabel}>Email.</div>
          <div className={styles.emailInputContainer}>
            <input
              className={styles.emailBox}
              name="email"
              type="email"
              placeholder="example@email.com"
              value={email}
              onChange={inputHandler}
            />
            <button
              type="submit"
              className={styles.confirmBtn}
              style={{ opacity: checkEmail ? 1 : 0.3 }}
              disabled={checkEmail ? false : true}
              onClick={handleSendCode}
            >
              {sendCodeBtnText}
            </button>
          </div>
        </div>
        <div className={styles.inputComponent}>
          <div className={styles.inputLabel}></div>
          <input
            className={styles.inputBox}
            maxLength={6}
            required
            name="code"
            type="text"
            value={code}
            placeholder="Input Verification code"
            onChange={inputHandler}
            style={{ borderColor: checkCode ? "" : "red" }}
          />
        </div>
      </div>
      <div>
        <input
          type="submit"
          value="Please enter the contents"
          className={styles.submitBtn}
          style={{ opacity: formValid ? 1 : 0.3 }}
          disabled={formValid ? false : true}
          onClick={submitFormDataHandler}
        />
      </div>
    </>
  );
}
