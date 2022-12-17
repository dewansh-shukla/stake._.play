import React, { useState, useEffect, FC } from "react"
import { useCreateAsset } from "@livepeer/react"
import { ethers } from "ethers"
import contractABI from "../../../utils/contractABI.json"

const UploadVideoTest = () => {
  const [video, setVideo] = useState<File | undefined>(undefined)
  const [videoPlaybackUrl, setVideoPlaybackUrl] = useState<string | undefined>(
    undefined
  )
  const [loading, setLoading] = useState<string>("start")
  const [videoTitle, setVideoTitle] = useState<string | undefined>(undefined)
  const {
    mutate: createAsset,
    data: assets,
    status,
    progress,
    error,
  } = useCreateAsset(
    video
      ? {
          sources: [{ name: videoTitle || "Void", file: video }] as const,
        }
      : null
  )
  useEffect(() => {
    if (assets?.[0]?.playbackId == undefined) setLoading("loading")
    else {
      setLoading("loaded")
      setVideoPlaybackUrl(assets?.[0]?.playbackId)
    }
  }, [assets])
  const uploadVideo = async () => {
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
        const videos = await contract.addVideo(videoPlaybackUrl, "regular")
      }
    } catch (err) {
      console.log(err)
    }
  }

  useEffect(() => {
    uploadVideo()
  }, [videoPlaybackUrl])

  return (
    <>
      <input type='checkbox' id='uploadVideo' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='uploadVideo'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>
          <h3 className='text-lg font-bold text-center'>
            Upload your video here !!!
          </h3>
          <div className='flex flex-col items-center'>
            <input
              type='file'
              placeholder='Upload Video'
              multiple={false}
              accept='video/*'
              onChange={(e) => {
                if (e.target.files) {
                  setVideo(e.target.files[0])
                }
              }}
              className='file-input file-input-bordered file-input-primary w-full max-w-xs mt-4'
            />
            <input
              type='text'
              placeholder='Type Video Title'
              className='input w-full max-w-xs mt-4 border-primary'
              onChange={(e) => {
                setVideoTitle(e.target.value)
              }}
            />
            <button
              disabled={status === "loading" || !createAsset}
              onClick={() => {
                createAsset?.()
              }}
              className='pl-4 pr-4 p-2 mt-4 rounded-2xl font-bold  hover:cursor-pointer bg-primary text-white'
            >
              Create Asset
            </button>

            {assets?.map((asset) => (
              <div key={asset.id}>
                <div>
                  <div>Asset Name: {asset?.name}</div>
                  <div>id {asset?.playbackId}</div>
                  <div>Playback URL: {asset?.playbackUrl}</div>
                  <div>IPFS CID: {asset?.storage?.ipfs?.cid ?? "None"}</div>
                </div>
              </div>
            ))}

            {error && <div>{error.message}</div>}
          </div>
        </div>
      </div>
    </>
  )
}
export default UploadVideoTest
