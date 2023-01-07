import { ReactNode, FC } from "react"
import { Outlet, useLocation } from "react-router-dom"
type Props = {
  children: ReactNode
}

const Layout: FC<Props> = ({ children }) => {
  const location = useLocation()
  console.log(location.pathname.slice(0, 11) === "/home/post/")
  return (
    <>
      <div className='w-full h-full flex justify-center'>
        {location.pathname.slice(0, 11) === "/home" && children}
        {location.pathname.slice(0, 11) === "/home/post/" && <Outlet />}
      </div>
    </>
  )
}
export default Layout
