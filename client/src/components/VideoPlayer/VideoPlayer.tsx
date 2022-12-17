import { Player } from "@livepeer/react"
import { FC, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import ContractAbi from "../../utils/contractABI.json"
import { ImCopy } from "react-icons/im"
import { FaDonate } from "react-icons/fa"
import { BsCurrencyDollar } from "react-icons/bs"
import { FiRefreshCcw } from "react-icons/fi"
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

  return (
    <>
      <div className='w-full mt-4 mb-4 flex flex-col justify-center border-2  border-violet-500 rounded-b-2xl '>
        <Player
          title='Title Video'
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
                {allDonations ? (
                  allDonations.map((item: any, index: any) => {
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
                  <div>No donations</div>
                )}
              </p>
            </div>
          </div>

          {/* Show Donations End */}
        </div>
      </div>
    </>
  )
}
export default VideoPlayer
