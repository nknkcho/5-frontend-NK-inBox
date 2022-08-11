import styles from './ModalFormList.module.scss'
interface RangeBtnProps {
  value: string
  onBtnClick: boolean
  setOnBtnClick: Function
  setEnteredRange: Function
}

const RangeBtn = ({ value, onBtnClick, setOnBtnClick, setEnteredRange }: RangeBtnProps) => {
  // Range 클릭 이벤트 발생 시
  const handleRangeClick = (e: React.MouseEvent<HTMLInputElement>) => {
    // 버튼의 스타일 변경
    setOnBtnClick((current: string) => !current)
    // 클릭한 버튼의 값을 state에 업데이트
    const btnValue: HTMLInputElement = e.currentTarget
    setEnteredRange(btnValue.value.toLowerCase())
  }
  return (
    <input
      className={styles.rangeBtn}
      name="range"
      type={'button'}
      value={value}
      onClick={handleRangeClick}
      style={{
        backgroundColor: onBtnClick ? '#FFB800' : '#FFCC0011',
        color: onBtnClick ? '#FFFFFFCC' : '#FFB800',
      }}
    />
  )
}

export default RangeBtn