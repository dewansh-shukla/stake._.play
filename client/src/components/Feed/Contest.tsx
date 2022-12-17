import { ethers } from "ethers"
import { useEffect, useState } from "react"
import ContestD from "../../utils/contestABI.json"
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
        console.log("allContest", allContest)
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
      <div className='min-h-screen flex w-full justify-center'></div>
    </>
  )
}
export default Contests
