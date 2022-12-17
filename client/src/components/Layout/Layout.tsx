import Navbar from "../Navbar/Navbar"
import { ReactNode, FC } from "react"
type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  return (
    <>
      <div className='w-full h-full flex justify-center'>{children}</div>
    </>
  )
}
export default Layout
