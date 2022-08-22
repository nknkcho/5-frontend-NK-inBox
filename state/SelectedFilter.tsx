import { atom } from 'recoil'
import { v1 } from "uuid"

export default atom<boolean>({
  key: `ImageFilter/${v1()}`,
  default: false
})