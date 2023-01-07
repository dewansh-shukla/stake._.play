//wallet connection imports
import "@rainbow-me/rainbowkit/styles.css"
import { getDefaultWallets, RainbowKitProvider } from "@rainbow-me/rainbowkit"
import { chain, configureChains, createClient, WagmiConfig } from "wagmi"
import { alchemyProvider } from "wagmi/providers/alchemy"
import { publicProvider } from "wagmi/providers/public"

//react router imports
import { createBrowserRouter, RouterProvider } from "react-router-dom"

//lens imports
import { LensConfig, LensProvider, staging } from "@lens-protocol/react"
import { localStorage } from "@lens-protocol/react/web"
import { bindings as wagmiBindings } from "@lens-protocol/wagmi"

//livepeer imports
import {
  createReactClient,
  LivepeerConfig,
  studioProvider,
} from "@livepeer/react"

//screens imports
import Landing from "./screens/Landing/Landing"
import Home from "./screens/Home/Home"
import Post from "./components/Post/Post"

const router = createBrowserRouter([
  {
    path: "/",
    element: <Landing />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [
      {
        path: "post/:id",
        element: <Post />,
      },
    ],
  },
])
const App = () => {
  const { chains, provider } = configureChains(
    [
      chain.polygonMumbai,
      chain.mainnet,
      chain.polygon,
      chain.optimism,
      chain.arbitrum,
    ],
    [
      alchemyProvider({
        apiKey: process.env.REACT_APP_ALCHEMY_KEY || "",
      }),
      publicProvider(),
    ]
  )
  const { connectors } = getDefaultWallets({
    appName: "stake_stream",
    chains,
  })
  const wagmiClient = createClient({
    autoConnect: true,
    connectors,
    provider,
  })
  const client = createReactClient({
    provider: studioProvider({
      apiKey: process.env.REACT_APP_LIVEPEER_KEY || "",
    }),
  })

  return (
    <WagmiConfig client={wagmiClient}>
      <RainbowKitProvider chains={chains}>
        <LivepeerConfig client={client}>
          <RouterProvider router={router} />
        </LivepeerConfig>
      </RainbowKitProvider>
    </WagmiConfig>
  )
}

export default App
