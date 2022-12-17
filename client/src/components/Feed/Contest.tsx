import { Player } from "@livepeer/react"
import { ethers } from "ethers"
import { useEffect, useState, FC } from "react"
import ContestD from "../../utils/contestABI.json"
import { BsHandIndexThumb } from "react-icons/bs"
const Contests = () => {
  const [allContest, setAllContest] = useState<any>()
  const getAllContest = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum as any)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          process.env.REACT_APP_CONTEST_CONTRACT_ADDRESS || "",
          ContestD.abi,
          signer
        )

        const contests = await contract.fetchAllContests()
        setAllContest(contests)
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    getAllContest()
  }, [])

  return (
    <>
      <div className='min-h-screen flex  w-full justify-center'>
        <div className='w-1/2 flex flex-col items-center'>
          {allContest ? (
            allContest?.map((item: any, index: any) => {
              return (
                <div className='w-full' key={index}>
                  <IndividualContest item={item} />
                </div>
              )
            })
          ) : (
            <>
              <div>No Contests</div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
export default Contests

interface State {
  item: any
}

const IndividualContest: FC<State> = ({ item }) => {
  const [joinedVideos, setJoinedVideos] = useState<any>([])
  const [stakeAmount, setStakeAmount] = useState<Number>(0)
  const getJoinedVideos = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum as any)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          process.env.REACT_APP_CONTEST_CONTRACT_ADDRESS || "",
          ContestD.abi,
          signer
        )

        const contests = await contract.getVideosInContest((item as any)?.name)
        console.log("contests", contests)
        setJoinedVideos(contests)
      }
    } catch (err) {
      console.log(err)
    }
  }
  console.log("joinedVideos", joinedVideos)
  useEffect(() => {
    getJoinedVideos()
  }, [])

  const stakeHandler = async (playbackId: string) => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum as any)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          process.env.REACT_APP_CONTEST_CONTRACT_ADDRESS || "",
          ContestD.abi,
          signer
        )
        const contests = await contract.stakeInContest(
          playbackId,
          (item as any)?.name,
          { value: ethers.utils.parseEther(stakeAmount.toString()) }
        )
      }
    } catch (err) {
      console.log(err)
    }
  }

  const releaseFunds = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum as any)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          process.env.REACT_APP_CONTEST_CONTRACT_ADDRESS || "",
          ContestD.abi,
          signer
        )
        const contests = await contract.releaseFunds((item as any)?.name)
      }
    } catch (err) {
      console.log(err)
    }
  }
  return (
    <>
      <div className='flex w-full m-2 border-2 border-primary rounded-2xl'>
        <div className='card w-full bg-base-100 shadow-xl'>
          <div className='card-body '>
            <div className=' flex justify-evenly'>
              <h2 className='card-title'>{(item as any)?.name}</h2>
            </div>
            <div className='flex w-full flex-col '>
              <p className=''>Contest Created :-{(item as any)?.creator}</p>
              <p>Contest Description:-{(item as any)?.desc}</p>
            </div>

            {/* Joined Video Accordion starts  */}
            <div className='collapse'>
              <input type='checkbox' className='peer' />
              <div className='collapse-title btn text-primary-content flex justify-center border-primary'>
                show Videos{" "}
                <BsHandIndexThumb className='ml-2 text-violet-300' />
              </div>
              <div className='collapse-content  text-primary-content '>
                <div className='flex w-full flex-col items-center'>
                  {joinedVideos?.length !== 0 ? (
                    joinedVideos.map((item: any, index: any) => {
                      return (
                        <>
                          <div className='flex flex-col items-center w-full m-2'>
                            <Player
                              title='Title Video'
                              playbackId={item}
                              showPipButton
                            />
                            <div className='flex justify-around m-2'>
                              <input
                                type='number'
                                className='input w-1/3 border-primary border-2'
                                onChange={(e) =>
                                  setStakeAmount(Number(e.target.value))
                                }
                              />
                              <button
                                className='btn btn-primary w-1/2'
                                onClick={() => stakeHandler(item)}
                              >
                                Stake
                              </button>
                            </div>
                          </div>
                        </>
                      )
                    })
                  ) : (
                    <>
                      <div>No one has Joined the contest </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Joined Video Accordion ends here */}
            <div className='w-full flex justify-center'>
              <button
                className='btn border-primary w-1/2 hover:bg-primary hover:text-white'
                onClick={releaseFunds}
              >
                Release Funds
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
