import React, { useState } from 'react'
import Router from 'next/router'
import styles from './ModalFormList.module.scss'
import { postRequest } from '../../utils/fetchData'
import RangeBtn from './RangeBtn'
import List from './List'

export default function FormList(props: { path: string }) {
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

    setInputs({
      ...inputs,
      [name]: value,
      titleValid: titleValid,
      dateValid: dateValid,
      aboutValid: aboutValid,
      emailValid: emailValid,
      codeValid: codeValid,
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
  console.log(validationData)
  // email 유효성 검사 통과 후, 버튼 클릭 시 버튼 스타일 변경 및 이메일 코드 fetch 요청 event
  const handleSendCode = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      setSendCodeBtnText('RESEND')
      const result: { confirmIdx: number } = await postRequest('portfolios/email', { email })
      setGetConfirmIdx(result.confirmIdx)
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
  console.log(formListData)

  // validationCheck가 있음에도 fetch 요청을 보내는 이유?
  // 백엔드 서버에서 보낸 코드 인덱스와 인증 번호가 일치하는 지를 확인해야 하기 때문
  const submitFormDataHandler = async (e: { preventDefault: () => void }) => {
    e.preventDefault()
    try {
      const result = await postRequest('portfolios', formListData)
      if (result === 400) {
        alert('Please check your input')
        return
      }
      if (result === 201) {
        alert('Form submitted!')
        Router.reload()
        return
      }
      return
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <div className={styles.inputLayout}>
        <div className={styles.inputComponent}>
          <div className={styles.inputLabel}>Range.</div>
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
          placeholder={''}
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
