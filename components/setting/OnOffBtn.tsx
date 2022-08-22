import { useEffect, useState } from 'react'
import { useRecoilValue, useSetRecoilState, useRecoilState } from 'recoil'
import  SelectedFilter from '../../state/SelectedFilter'
import styles from '../setting/SettingList.module.scss'
import { getRequest } from '../../utils/fetchData'

export default function OnOffBtn() {
  const [onBtnClick, setOnBtnClick] = useRecoilState(SelectedFilter)

  // 페이지 첫 로딩(혹은 새로고침) 시, 기존 Setting 값을 유지하기 위해 useEffect 사용
  useEffect(() => {
    const selectedFilter = localStorage.getItem('filter')
    if (selectedFilter === 'off') {
      setOnBtnClick(true)
    }
    if (selectedFilter === 'on') {
      setOnBtnClick(false)
    }
  }, [onBtnClick])

  const handleFilterClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const target = e.target as HTMLTextAreaElement
      localStorage.setItem('filter', target.value)
      setOnBtnClick(current => !current)
      await getRequest(`filters/${target.value}`)
      await getRequest(`cookies`)
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
      <button
        className={styles.rangeBtn}
        onClick={e => handleFilterClick(e)}
        value="on"
        style={{
          backgroundColor: onBtnClick ? '#FFB800' : '#FFFFFF66',
          color: onBtnClick ? '#FFFFFFCC' : '#FFFFFF',
        }}
      >
        ON
      </button>
      <button
        className={styles.rangeBtn}
        onClick={e => handleFilterClick(e)}
        value="off"
        style={{
          backgroundColor: !onBtnClick ? '#FFB800' : '#FFFFFF66',
          color: !onBtnClick ? '#FFFFFFCC' : '#FFFFFF',
        }}
      >
        OFF
      </button>
    </div>
  )
}
