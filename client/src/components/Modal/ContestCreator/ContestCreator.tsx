import { useState, useEffect } from "react"
import ContestD from "../../../utils/contestABI.json"
import { ethers } from "ethers"

const ContestCreator = () => {
  const [startTime, setStartTime] = useState<string>("")
  const [duration, setDuration] = useState<Number>(1)
  const [contestName, setContestName] = useState<string>("")

  const createContest = async () => {
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

        const contest = await contract.createContest(
          startTime,
          duration,
          contestName
        )
        console.log("Contest created")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <>
      <input type='checkbox' id='createContest' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='createContest'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>

          <h3 className='text-lg font-bold'>Create Contest</h3>

          <div className='w-full flex flex-col items-center'>
            <input
              type='text'
              placeholder='Contest Name'
              className='input  m-2 w-1/2  border-primary'
              onChange={(e) => setContestName(e.target.value)}
            />
            <input
              type='text'
              placeholder='Start Time'
              className='input w-1/2  m-2 border-primary'
              onChange={(e) => setStartTime(e.target.value)}
            />
            <input
              type='text'
              placeholder='Duration'
              className='input w-1/2  m-2 border-primary'
              onChange={(e) => setDuration(Number(e.target.value))}
            />
            <button className='btn btn-primary' onClick={createContest}>
              Create Contest
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default ContestCreator
