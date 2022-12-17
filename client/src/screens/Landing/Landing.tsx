import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Typewriter from "typewriter-effect"

const Home = () => {
  const { address, isConnected } = useAccount()
  const navigate = useNavigate()
  useEffect(() => {
    if (isConnected) {
      console.log(address)
      navigate("/home")
    }
  }, [isConnected])
  return (
    <>
      <div className='flex flex-col w-full h-screen items-center justify-center'>
        <h1 className=''>Platform for</h1>
        <h1 className='text-4xl mb-6 h-10 font-serif font-bold mt-10'>
          <Typewriter
            options={{
              autoStart: true,
              loop: true,
              cursor: "",
            }}
            onInit={(typewriter) => {
              typewriter
                .typeString(
                  `<h1 style='background: -webkit-linear-gradient(#1188f0, #f011d2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;'>Content Creators</h1>`
                )
                .pauseFor(1500)
                .deleteAll()
                .typeString(
                  `<h1 style='background: -webkit-linear-gradient(#1188f0, #f011d2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;'>Artists</h1>`
                )
                .pauseFor(1500)
                .deleteAll()
                .typeString(
                  `<h1 style='background: -webkit-linear-gradient(#1188f0, #f011d2);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;'>Explorers</h1>`
                )
                .pauseFor(2500)
                .deleteAll()
                .start()
            }}
          />
        </h1>
        <ConnectButton
          chainStatus='icon'
          showBalance={false}
          label='Connect Wallet'
        />
      </div>
    </>
  )
}

export default Home
