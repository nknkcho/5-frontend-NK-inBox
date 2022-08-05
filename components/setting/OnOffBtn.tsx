import { useEffect, useState } from 'react'
import styles from '../setting/SettingList.module.scss'
import { getRequest } from '../../utils/fetchData'

export default function OnOffBtn() {
  const [onBtnClick, setOnBtnClick] = useState(false)

  // 페이지 첫 로딩(혹은 새로고침) 시, 기존 Setting 값을 유지하기 위해 useEffect 사용
  useEffect(() => {
    const selectedFilter = localStorage.getItem('filter')
    if (selectedFilter === 'off') {
      setOnBtnClick(true)
    }
  }, [onBtnClick])

  const handleFilterClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    try {
      const target = e.target as HTMLTextAreaElement
      // 유저가 선택된 버튼을 또 한 번 누를 경우, 클릭한 버튼과 설정값이 달라지기 때문에 해당 경우를 포함하여 조건문 작성
      if (target.value == 'on' && onBtnClick == false) {
        localStorage.setItem('filter', 'off')
      } else if (target.value == 'off' && onBtnClick == true) {
        localStorage.setItem('filter', 'on')
      } else {
        localStorage.setItem('filter', target.value)
      }
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
