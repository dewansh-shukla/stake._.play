import { useCreateStream } from "@livepeer/react"
import { FC } from "react"
import { useState, useEffect } from "react"
import { ethers } from "ethers"
import contractABI from "../../../utils/contractABI.json"

const StreamVideo = () => {
  const [streamName, setStreamName] = useState<string | undefined>(undefined)
  const uploadStream = async () => {
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
        const videos = await contract.addVideo(stream?.playbackId, "stream")
      }
    } catch (err) {
      console.log(err)
    }
  }

  const {
    mutate: createStream,
    data: stream,
    status,
  } = useCreateStream({
    name: streamName || `Random Name ${Date.now()}`,
    record: true,
  })
  useEffect(() => {
    uploadStream()
  }, [stream])
  return (
    <>
      <input type='checkbox' id='streamVideo' className='modal-toggle' />
      <div className='modal'>
        <div className='modal-box relative'>
          <label
            htmlFor='streamVideo'
            className='btn btn-sm btn-circle absolute right-2 top-2'
          >
            ✕
          </label>
          <h3 className='text-lg font-bold'>Create Your Stream</h3>
          <div className='flex flex-col items-center'>
            <input
              type='text'
              placeholder='Stream Name'
              className='input input-bordered  w-3/4 mt-4 mb-2'
              onChange={(e) => {
                setStreamName(e.target.value)
              }}
            />

            <button
              disabled={status === "loading" || !createStream}
              onClick={() => createStream?.()}
              className='btn btn-primary mt-4 mb-4 w-1/2 '
            >
              Create Stream
            </button>

            {stream && (
              <>
                <div className='flex flex-col text-white'>
                  <div>Stream Key: {stream.streamKey}</div>
                  <div>Stream url :{stream.rtmpIngestUrl}</div>
                  <div>Playback :{stream.playbackId}</div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default StreamVideo
