import VideoPlayer from "../VideoPlayer/VideoPlayer"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import contractABI from "../../utils/contractABI.json"
import { FiRefreshCw } from "react-icons/fi"
import OopsFrog from "../../assets/images/oopsfrog.png"
const Feed = () => {
  const [allVideos, setAllVideos] = useState<any[]>([])
  const [refresh, setRefresh] = useState<boolean>(false)
  const handlerefresh = () => {
    setRefresh(!refresh)
  }
  const getAllVideos = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum as any)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          process.env.REACT_APP_STREAM_ADDRESS || "",
          contractABI.abi,
          signer
        )
        const videos = await contract.getRegularVideos()
        setAllVideos(videos)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getAllVideos()
  }, [refresh])
  return (
    <>
      <div className=' w-full h-full min-h-screen flex flex-col items-center'>
        <div className=' w-1/2 flex justify-center items-center'>
          <h3 className='text-xl flex flex-row items-center mt-2'>
            Feed
            <button onClick={handlerefresh}>
              <FiRefreshCw className='ml-2 mt-[3px] text-sm' />
            </button>
          </h3>
        </div>
        <div className='w-1/2'>
          {allVideos.length !== 0 ? (
            allVideos.map((item, index) => {
              return (
                <div>
                  <VideoPlayer key={index} playbackInfo={item} />
                </div>
              )
            })
          ) : (
            <>
              <div className='flex flex-col items-center mt-10'>
                <p>No videosssss!!!!</p>
                <img src={OopsFrog} width={200} height={200} />
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
export default Feed
