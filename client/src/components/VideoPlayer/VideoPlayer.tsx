import { Player } from "@livepeer/react"
import { FC, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import ContractAbi from "../../utils/contractABI.json"
import { ImCopy } from "react-icons/im"
import { BsCurrencyDollar } from "react-icons/bs"
import { FiRefreshCcw } from "react-icons/fi"
import ContestD from "../../utils/contestABI.json"
import PrayingFrog from "../../assets/images/PrayingFrog.png"
import { Link } from "react-router-dom"
interface PlaybackInfo {
  0: string
  1: string
  creator: string
  key: string
}
type Props = {
  playbackInfo: Array<PlaybackInfo>
}
const VideoPlayer: FC<Props> = ({ playbackInfo }) => {
  const [donationAmount, setDonationAmount] = useState<Number>(0)
  const [comment, setComment] = useState<string>("")
  const [allDonations, setAllDonations] = useState<any>()
  const [allContest, setAllContest] = useState<any>()

  const [refresh, setRefresh] = useState<boolean>(false)
  const getDonations = async () => {
    try {
      const { ethereum } = window

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum as any)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          process.env.REACT_APP_STREAM_ADDRESS || "",
          ContractAbi.abi,
          signer
        )

        const donations = await contract.getDonations(
          (playbackInfo as any)?.key
        )

        setAllDonations(donations)
      }
    } catch (error) {
      console.log(error)
    }
  }

  const handleDonation = async () => {
    try {
      const { ethereum } = window
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum as any)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(
          process.env.REACT_APP_STREAM_ADDRESS || "",
          ContractAbi.abi,
          signer
        )
        const tx = await contract.addDonations(
          (playbackInfo as any)?.key,
          comment,
          {
            value: ethers.utils.parseEther(donationAmount.toString()),
          }
        )
        await tx.wait()
      }
    } catch (error) {
      console.log(error)
    }
  }
  const handleOnChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setComment(e.target.value)
    },
    []
  )
  const handleDonationAmmount = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setDonationAmount(Number(e.target.value))
    },
    []
  )

  useEffect(() => {
    getDonations()
  }, [refresh])

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
        console.log("allContest", allContest)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getAllContest()
  }, [])

  const handleJoinContest = async (name: string) => {
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
        console.log((playbackInfo as any)?.key, name)
        const tx = await contract.addVideosInContest(
          (playbackInfo as any)?.key,
          name
        )
        await tx.wait()
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <>
      <div className='w-full mt-4 mb-4 flex flex-col justify-center border-2 items-center border-violet-500 rounded-b-2xl '>
        <Player
          title='Demo'
          playbackId={(playbackInfo as any)?.key}
          showPipButton
        />
        <div className='flex w-full justify-between items-center mr-2 mt-2 px-8'>
          <p
            className='btn flex full justify-end mt-2 mb-2 tooltip '
            data-tip={(playbackInfo as any)?.creator.slice(0, 20)}
          >
            Creator:
            {(playbackInfo as any)?.creator.slice(0, 12) + `...`}
            <ImCopy
              className='font-white'
              onClick={() =>
                navigator.clipboard.writeText((playbackInfo as any)?.creator)
              }
            />
          </p>
          {/* dropdown starts */}
          <div className='dropdown dropdown-hover w-1/3'>
            <label tabIndex={0} className='btn m-1 w-full'>
              Contests
            </label>
            <ul
              tabIndex={0}
              className='dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52'
            >
              {allContest?.map((contest: any, index: any) => {
                return (
                  <li key={index}>
                    <a onClick={() => handleJoinContest(contest?.name)}>
                      {contest?.name}
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
          {/* dropdown ends */}
        </div>
        <div className='flex flex-col w-full justify-center items-center p-2'>
          {/* Accordion  */}
          <div className='collapse w-3/4 '>
            <input type='checkbox' className='peer ' />
            <div className='collapse-title btn w-full text-primary-content border-violet-500 mb-4'>
              Make Donation
            </div>
            <div className='collapse-content  text-primary-content  '>
              <div className='w-full flex justify-center p-2'>
                <input
                  type='text'
                  placeholder='Comment !!'
                  className='input w-full border-2  rounded-md text-lg text-white'
                  onChange={handleOnChange}
                />
              </div>
              <div className='w-full flex justify-around mt-2'>
                <input
                  defaultValue={0.01}
                  type='number'
                  className='p-2 rounded-md text-lg text-white w-1/3 h-full'
                  onChange={handleDonationAmmount}
                />

                <button
                  className='btn btn-outline btn-primary w-1/3 mb-4'
                  onClick={handleDonation}
                >
                  Donate
                </button>
              </div>
            </div>
          </div>
          {/* Accordion End */}

          {/* Show Donations  */}
          <div className='collapse'>
            <input type='checkbox' className='peer' />
            <div className='collapse-title  btn text-primary-content text-center'>
              Show Donations
            </div>

            <div className='collapse-content  text-primary-content '>
              <div
                className='flex w-full justify-center mt-2 items-center'
                onClick={() => setRefresh(!refresh)}
              >
                Refresh
                <FiRefreshCcw className='ml-2 mt-1' />
              </div>
              <p className='py-4'>
                {allDonations?.length !== 0 ? (
                  allDonations?.map((item: any, index: any) => {
                    return (
                      <>
                        <div className='flex justify-center items-center'>
                          <div className='flex justify-center'>
                            <p
                              className='btn flex full justify-end mt-2 mb-2 tooltip '
                              data-tip={(item as any)?.client.slice(0, 20)}
                            >
                              Donor:
                              {(item as any)?.client.slice(0, 12) + `...`}
                              <ImCopy
                                className='font-white'
                                onClick={() =>
                                  navigator.clipboard.writeText(
                                    (item as any)?.client
                                  )
                                }
                              />
                            </p>
                          </div>
                          <p className='m-2 flex items-center'>
                            <BsCurrencyDollar />
                            <span>
                              {(
                                (item as any)?.amount / Math.pow(10, 18)
                              )?.toString()}
                            </span>
                          </p>
                          <p className='m-2'>{(item as any)?.message}</p>
                        </div>
                      </>
                    )
                  })
                ) : (
                  <div className='flex w-full flex-col items-center justify-center'>
                    <p className='text-center'>No Donations Yet!!</p>
                    <img src={PrayingFrog} width={150} height={150} />
                  </div>
                )}
              </p>
            </div>
          </div>
        </div>

        {/* Redirection to specific post page */}
        {/* <Link className='btn' to={`post/:${(playbackInfo as any)?.key}`}>
          Open Video
        </Link> */}
      </div>
    </>
  )
}
export default VideoPlayer
