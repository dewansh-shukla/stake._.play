import { Player } from "@livepeer/react"
import { FC, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import ContractAbi from "../../utils/contractABI.json"
import { ImCopy } from "react-icons/im"
import { FaDonate } from "react-icons/fa"
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
  return (
    <>
      <div className='w-full mt-4 mb-4 flex flex-col justify-center border-2  border-violet-500 rounded-b-2xl '>
        <Player
          title='Title Video'
          playbackId={(playbackInfo as any)?.key}
          showPipButton
        />
        <div className='flex w-full justify-between items-center mr-2 mt-2 px-8'>
          <label htmlFor='showDonations' className='flex items-center btn'>
            Show Donations <FaDonate className='ml-3' />
          </label>
          <ShowDonations playbackId={(playbackInfo as any)?.key} />
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
        </div>
      </div>
    </>
  )
}
export default VideoPlayer

interface DonationProps {
  playbackId: string
}

const ShowDonations: FC<DonationProps> = ({ playbackId }) => {
  const [allDonations, setAllDonations] = useState<any>()
  console.log("all donations", allDonations)
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
        const donations = await contract.getDonations(playbackId)
        setAllDonations(donations)
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getDonations()
  }, [])
  return (
    <>
      <input type='checkbox' id='showDonations' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='showDonations'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>
          <h3 className='text-lg font-bold'>Donations</h3>
          <p className='py-4'>
            {allDonations ? (
              allDonations.map((item: any, index: any) => {
                return (
                  <>
                    <div>
                      {((item as any)?.amount / Math.pow(10, 18))?.toString()}
                    </div>
                  </>
                )
              })
            ) : (
              <>"No Donations"</>
            )}
          </p>
        </div>
      </div>
    </>
  )
}
