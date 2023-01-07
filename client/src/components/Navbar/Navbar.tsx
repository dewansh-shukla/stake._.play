import { FC, useState, useEffect } from "react"
import "./Navbar.css"
import ProfileImage from "../../assets/images/profile.webp"
interface Props {
  setCurrentFeed: (feed: string) => void
}
const Navbar: FC<Props> = ({ setCurrentFeed }) => {
  const [scrollPos, setScrollPos] = useState(0)
  const [visible, setVisible] = useState(true)
  const handleScroll = () => {
    const currentScrollPos = window.scrollY
    if (currentScrollPos > scrollPos) {
      setVisible(false)
    } else {
      setVisible(true)
    }
    setScrollPos(currentScrollPos)
  }

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)

    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollPos, visible, handleScroll])

  return (
    <>
      <div
        className={` h-20  p-2   flex sticky justify-center items-center  ${
          visible ? "top-0" : " "
        } `}
        style={{ zIndex: 10 }}
      >
        <div
          className='w-4/5 h-full flex flex-row justify-center md:justify-around items-center rounded-2xl
           p-4 xyz
          '
          style={{ backgroundColor: "#171616" }}
        >
          <p className='text-2xl  font-extrabold md:ml-10'>Stake._.play</p>
          <div className='hidden w-2/4 md:flex flex-row justify-evenly items-center'>
            <label htmlFor='uploadVideo' className='btn m-2 bg-black'>
              Upload Video
            </label>
            <label htmlFor='streamVideo' className='btn m-2 bg-black'>
              Stream Video
            </label>
            <label htmlFor='createContest' className='btn m-2 bg-black'>
              Create Contest
            </label>
            {/* NFt minting */}
            <div
              className='avatar hover:cursor-pointer hover:scale-105'
              onClick={() => setCurrentFeed("Profile")}
            >
              <div className='w-8 h-8 rounded-full '>
                <img src={ProfileImage} />
              </div>
            </div>
            {/* end here */}
          </div>
        </div>
      </div>
    </>
  )
}
export default Navbar
