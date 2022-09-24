import React, { useState } from 'react'
import Router from 'next/router'
import styles from './ModalFormList.module.scss'
import { postRequest } from '../../utils/fetchData'
import RangeBtn from './RangeBtn'
import List from './List'
import AlertModal from './AlertModal'

export default function FormList(props: { path: string }) {
  const [openAlert, setOpenAlert] = useState(false)
  const [alertSetting, setAlertSetting] = useState({
    message: '',
    status: '',
  })
  // Range 버튼 관련 상태
  const [enteredRange, setEnteredRange] = useState('fe')
  const [onBtnClick, setOnBtnClick] = useState(false)
  // input의 스타일 관련 상태
  const [checkTitle, setCheckTitle] = useState(true)
  const [checkDate, setCheckDate] = useState(true)
  const [checkAbout, setCheckAbout] = useState(true)
  const [checkEmail, setCheckEmail] = useState(false)
  const [checkCode, setCheckCode] = useState(true)
  const [sendCodeBtnText, setSendCodeBtnText] = useState('SEND CODE')
  // 이메일 fetch 응답값 관련 상태
  const [getConfirmIdx, setGetConfirmIdx] = useState(0)
  // input 입력 관련 상태
  const [inputs, setInputs] = useState({
    title: '',
    date: '',
    about: '',
    email: '',
    code: '',
    titleValid: false,
    dateValid: false,
    aboutValid: false,
    emailValid: false,
    codeValid: false,
  })
  const { title, date, about, email, code } = inputs

  // date 유효성 체크를 위한 함수
  function validDateString(s: string) {
    const match = s.match(/^(\d{4})(\d\d)(\d\d)$/)
    if (match) {
      const [year, month, day] = match.slice(1)
      const iso = `${year}-${month}-${day}T00:00:00.000Z`
      const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)))
      return date.toISOString() === iso
    }
    return false
  }

  // email 유효성 체크를 위한 함수
  const validEmailRegex = RegExp(
    /^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
  )

  // 전체 유저 입력값의 유효성 검사 함수
  const inputHandler = (e: {
    preventDefault: Function
    target: { value: string; name: string }
  }) => {
    e.preventDefault()
    const { value, name } = e.target
    let titleValid = inputs.titleValid
    let dateValid = inputs.dateValid
    let aboutValid = inputs.aboutValid
    let emailValid = inputs.emailValid
    let codeValid = inputs.codeValid
    switch (name) {
      case 'title':
        titleValid = value.length > 2
        titleValid ? setCheckTitle(true) : setCheckTitle(false)
        break
      case 'date':
        dateValid = validDateString(value)
        dateValid ? setCheckDate(true) : setCheckDate(false)
        break
      case 'about':
        aboutValid = value.length > 2
        aboutValid ? setCheckAbout(true) : setCheckAbout(false)
        break
      case 'email':
        value ? '' : setSendCodeBtnText('SEND CODE'), (emailValid = validEmailRegex.test(value))
        emailValid ? setCheckEmail(true) : setCheckEmail(false)
      case 'code':
        codeValid = value.length == 6
        codeValid ? setCheckCode(true) : setCheckCode(false)
      default:
        break
    }

    // 리액트는 상태 업데이트 스케쥴을 갖고 있어, 바로 실행하지 않는다.
    // 수많은 상태 업데이트를 계획한다면, 오래되거나 잘못된 상태 스냅샷에 의존할 수 있다.
    // 따라서 가장 최신의 스냅샷임을 보장해야 한다.
    setInputs(prevState => {
      return {
        ...prevState,
        [name]: value,
        titleValid: titleValid,
        dateValid: dateValid,
        aboutValid: aboutValid,
        emailValid: emailValid,
        codeValid: codeValid,
      }
    })
  }

  // 부모 컴포넌트로부터 파일 key 값을 받아왔는 지 확인하는 함수
  const checkFilePath = () => {
    if (!props.path) return false
    return true
  }

  // 유효성 검사 통과 여부를 확인하는 변수
  const validationData = [
    inputs.titleValid,
    inputs.dateValid,
    inputs.aboutValid,
    inputs.emailValid,
    inputs.codeValid,
    checkFilePath(),
  ]

  // email 유효성 검사 통과 후, 버튼 클릭 시 버튼 스타일 변경 및 이메일 코드 fetch 요청 event
  const handleSendCode = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      if (confirm('해당 이메일 주소로 인증 번호를 전송하시겠습니까?')) {
        setSendCodeBtnText('RESEND')
        const result: { confirmIdx: number } = await postRequest('portfolios/email', { email })
        setGetConfirmIdx(result.confirmIdx)
      }
      return
    } catch (error) {
      console.log(error)
    }
  }

  // 유저가 파일, title, date, about, email, code 데이터를 모두 다 입력했는지 확인하는 함수
  // **confirmIdx는 fetch 요청 이후 일치 여부 확인할 수 있습니다.
  const validationCheck = () => {
    if (validationData.find(v => v === false) === false) {
      return false
    }
    return true
  }

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
  }

  // validationCheck가 있음에도 fetch 요청을 보내는 이유?
  // 백엔드 서버에서 보낸 코드 인덱스와 인증 번호가 일치하는 지를 확인해야 하기 때문
  const submitFormDataHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      if (confirm('제출하시겠습니까?')) {
        const result = await postRequest('portfolios', formListData)
        if (result === 400) {
          setOpenAlert(true)
          setAlertSetting({ message: 'Please check your input', status: 'error' })
          return
        }
        if (result === 401) {
          setOpenAlert(true)
          setAlertSetting({ message: 'Please check your email code', status: 'error' })
          return
        }
        if (result === 201) {
          setOpenAlert(true)
          setAlertSetting({ message: 'Form submitted!', status: 'ok' })
          setInputs({
            title: '',
            date: '',
            about: '',
            email: '',
            code: '',
            titleValid: false,
            dateValid: false,
            aboutValid: false,
            emailValid: false,
            codeValid: false,
          })
          //if (openAlert === false) return Router.reload()
        }
      }
      return
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      {openAlert && <AlertModal closeButton={setOpenAlert} setting={alertSetting} />}
      <div className={styles.inputLayout}>
        <div className={styles.inputComponent}>
          <label className={styles.inputLabel}>Range.</label>
          <div className={styles.rangeInputContainer}>
            <RangeBtn
              value={'FE'}
              onBtnClick={!onBtnClick}
              setOnBtnClick={setOnBtnClick}
              setEnteredRange={setEnteredRange}
            />
            <RangeBtn
              value={'BE'}
              onBtnClick={onBtnClick}
              setOnBtnClick={setOnBtnClick}
              setEnteredRange={setEnteredRange}
            />
          </div>
        </div>
        <List
          text={'Title.'}
          maxLength={20}
          placeholder={'Please enter at least 3 characters'}
          name={'title'}
          value={title}
          onChange={inputHandler}
          validate={checkTitle}
        />
        <List
          text={'Date.'}
          maxLength={8}
          placeholder={'20220000'}
          name={'date'}
          value={date}
          onChange={inputHandler}
          validate={checkDate}
        />
        <List
          text={'About.'}
          maxLength={20}
          placeholder={'Write a brief introduction'}
          name={'about'}
          value={about}
          onChange={inputHandler}
          validate={checkAbout}
        />
        <List
          text={'Email.'}
          placeholder={'example@email.com'}
          name={'email'}
          value={email}
          onChange={inputHandler}
        >
          <input
            type="submit"
            value={sendCodeBtnText}
            className={styles.confirmBtn}
            style={{ opacity: checkEmail ? 1 : 0.3 }}
            disabled={checkEmail ? false : true}
            onClick={handleSendCode}
          />
        </List>
        <List
          maxLength={6}
          placeholder={'Input Verification code'}
          name={'code'}
          value={code}
          onChange={inputHandler}
          validate={checkCode}
        />
      </div>
      <input
        type="submit"
        value="Please enter the contents"
        className={styles.submitBtn}
        style={{ opacity: validationCheck() ? 1 : 0.3 }}
        disabled={validationCheck() ? false : true}
        onClick={submitFormDataHandler}
      />
    </>
  )
}
