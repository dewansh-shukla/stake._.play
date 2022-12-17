import { useState,useEffect } from "react";
import ContestD from "../../../utils/contestABI.json";
import {ethers} from 'ethers';

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
          process.env.REACT_APP_STREAM_ADDRESS || "",
          ContestD.abi,
          signer
        )
  }
    }catch(error){
      console.log(error);
    }
  const createContest = async() => {
    try{
      const {ethereum} = window;
      
      if(ethereum){
        const provider = new ethers.providers.Web3Provider(ethereum as any);
        const signer = provider.getSigner();
        const contract = new ethers.Contract(
          process.env.REACT_APP_STREAM_ADDRESS || "",
          ContestD.abi,
          signer
        );
        
        const contest = await contract.createContest("startTime","Duration","ContestName");
        console.log("Contest created");  
      }
    } catch(error){
      console.log(error);
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
          <div className='w-full flex flex-col'>
            <div className='w-full flex justify-center'></div>
            <button className='btn'>Create Contest</button>
          </div>
        </div>
      </div>
    </>
  )
}
}
    
export default ContestCreator
