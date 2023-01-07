import React, { useEffect, useState, FC } from "react"
import { useAccount } from "wagmi"
import { ethers } from "ethers"
import contractABI from "../../utils/contractABI.json"
import { Player } from "@livepeer/react"
import axios from "axios"

const Profile = () => {
  const { address } = useAccount()
  const [userVideos, setUserVideos] = useState<any[]>([])
  const getAllUserVideos = async () => {
    // fetch all videos from the user
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
        const allVideos = await contract.getAllVideosOfCreator(address)
        console.log(allVideos)
        setUserVideos(allVideos)
      }
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    getAllUserVideos()
  }, [])

  return (
    <div className='w-full min-h-screen flex justify-center mt-2'>
      <div className='w-4/5 flex flex-col items-center'>
        <p className='mt-2 mb-2'>Your Videos</p>
        <div className='w-2/3 flex flex-col justify-center items-center'>
          {userVideos.map((video, index) => {
            return <MiniPlayer video={video} />
          })}
        </div>
      </div>
    </div>
  )
}

interface MiniPlayerProps {
  video: any
}
const MiniPlayer: FC<MiniPlayerProps> = ({ video }) => {
  const { address } = useAccount()

  const handleMint = async (videoKey: string) => {
    const file = new File([JSON.stringify({ videoKey })], "file.json", {
      type: "application/json",
    })
    const form = new FormData()
    form.append("file", file)

    const options = {
      method: "POST",
      body: form,

      headers: {
        "content-type": "multipart/form-data",
        Authorization: "d853316c-0fdb-42e2-b091-b5d786b7d05a",
      },
    }

    fetch(
      "https://api.nftport.xyz/v0/mints/easy/files?" +
        new URLSearchParams({
          chain: "polygon",
          name: "NFT_Name",
          description: "NFT_Description",

          mint_to_address: address as string,
        }),

      options as any
    )
      .then(function (response) {
        return response.json()
      })
      .then(function (responseJson) {
        // Handle the response
        console.log(responseJson)
      })
  }

  return (
    <>
      <div className='w-4/5 flex items-center flex-col mt-2 mb-4'>
        <Player
          title='Demo'
          playbackId={(video as any)?.videoKey}
          showPipButton
        />
        <button
          className='btn w-1/2 outline-purple-800 b-2 mt-2'
          onClick={() => handleMint((video as any)?.videoKey)}
        >
          Mint
        </button>
      </div>
    </>
  )
}

export default Profile
