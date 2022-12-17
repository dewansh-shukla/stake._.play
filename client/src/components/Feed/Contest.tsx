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
          "0x5fbdb2315678afecb367f032d93f642f64180aa3",
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
