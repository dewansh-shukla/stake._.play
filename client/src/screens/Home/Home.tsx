import { useEffect, useState } from "react"
import { useAccount } from "wagmi"
import { Outlet, useNavigate } from "react-router-dom"
import Layout from "../../components/Layout/Layout"
import VideoFeed from "../../components/Feed/VideoFeed"
import Navbar from "../../components/Navbar/Navbar"
import { useLocation } from "react-router-dom"
import UploadVideo from "../../components/Modal/Uploader/UploadVideo"
import StreamFeed from "../../components/Feed/StreamFeed"
import StreamVideo from "../../components/Modal/Streamer/StreamVideo"
import CreateContest from "../../components/Modal/ContestCreator/ContestCreator"
import Contests from "../../components/Feed/Contest"
import Profile from "../../components/Profile/Profile"
const Home = () => {
  const [currentFeed, setCurrentFeed] = useState<String>("Video")

  const location = useLocation()
  const { isConnected } = useAccount()
  const navigate = useNavigate()
  useEffect(() => {
    if (!isConnected) {
      navigate("/")
    }
  }, [isConnected])
  return (
    <>
      <div>
        <Navbar setCurrentFeed={setCurrentFeed} />
        <Layout>
          <div className='w-full flex  flex-col  mt-2'>
            <div className='w-full flex justify-center'>
              <div className='tabs tabs-boxed  flex justify-center '>
                <a
                  onClick={() => setCurrentFeed("Video")}
                  className={`tab ${
                    currentFeed === "Video" ? "tab-active" : ""
                  }`}
                >
                  Video Feed
                </a>
                <a
                  onClick={() => setCurrentFeed("Stream")}
                  className={`tab ${
                    currentFeed === "Stream" ? "tab-active" : ""
                  }`}
                >
                  Stream Feed
                </a>
                <a
                  onClick={() => setCurrentFeed("Contest")}
                  className={`tab ${
                    currentFeed === "Contest" ? "tab-active" : ""
                  }`}
                >
                  Contests
                </a>
              </div>
            </div>
            {(currentFeed === "Video" && <VideoFeed />) ||
              (currentFeed === "Stream" && <StreamFeed />) ||
              (currentFeed === "Contest" && <Contests />) ||
              (currentFeed === "Profile" && <Profile />)}
          </div>
          <Outlet />
        </Layout>
        {/* Modals here */}
        <UploadVideo />
        <StreamVideo />
        <CreateContest />
      </div>
    </>
  )
}
export default Home
