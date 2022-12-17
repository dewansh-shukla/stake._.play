import { FC, useState, useEffect } from "react"
import { FiRefreshCw } from "react-icons/fi"
import VideoPlayer from "../VideoPlayer/VideoPlayer"
import { ethers } from "ethers"
import contractABI from "../../utils/contractABI.json"
import OopsFrog from "../../assets/images/oopsfrog.png"
const StreamVideo = () => {
  // states
  const [allStream, setAllStreams] = useState<any[]>([])
  const [refresh, setRefresh] = useState<boolean>(false)
  const getAllStreams = async () => {
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
        const streams = await contract.getStreamVideos()
        setAllStreams(streams)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getAllStreams()
  }, [refresh])

  return (
    <>
      <div className=' w-full h-full min-h-screen flex flex-col items-center'>
        <div className=' w-1/2 flex justify-center items-center'>
          <h3 className='text-xl flex flex-row items-center mt-2'>
            Feed
            <button
              onClick={() => {
                setRefresh(!refresh)
              }}
            >
              <FiRefreshCw className='ml-2 mt-[3px] text-sm' />
            </button>
          </h3>
        </div>
        <div className='w-1/2'>
          {allStream?.length !== 0 ? (
            allStream.map((item, index) => {
              return (
                <div>
                  <VideoPlayer key={index} playbackInfo={item} />
                </div>
              )
            })
          ) : (
            <div className='flex flex-col items-center mt-10'>
              <p>Bruhhh No streamssss!!!!</p>
              <img src={OopsFrog} width={200} height={200} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
export default StreamVideo
