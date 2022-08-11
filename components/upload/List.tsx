import styles from './ModalFormList.module.scss'
//List 컴포넌트의 타입
interface ListProps {
  text?: string
  maxLength?: number
  placeholder: string
  name: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  validate?: boolean
  children?: JSX.Element | JSX.Element[]
}

// List 컴포넌트
const List = ({
  text,
  maxLength,
  name,
  placeholder,
  value,
  onChange,
  validate,
  children,
}: ListProps) => {
  const inputComponent = (
    <>
      <input
        className={name === 'email' ? styles.emailBox : styles.inputBox}
        maxLength={maxLength}
        name={name}
        type={name === 'email' ? 'email' : 'text'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        style={{ borderColor: name === 'email' ? '' : validate ? '' : 'red' }}
      />
      {children}
    </>
  )
  const inputEmailComponent = <div className={styles.emailInputContainer}>{inputComponent}</div>

  return (
    <div className={styles.inputComponent}>
      <div className={styles.inputLabel}>{text}</div>
      {name === 'email' ? inputEmailComponent : inputComponent}
    </div>
  )
}

export default List