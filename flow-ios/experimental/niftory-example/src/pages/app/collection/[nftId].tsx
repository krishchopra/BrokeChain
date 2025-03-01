import { Box } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import { useQuery } from "urql"

import { Nft, NftDocument, NftQuery } from "../../../../generated/graphql"
import AppLayout from "../../../components/AppLayout"
import { NFTDetail } from "../../../components/collection/NFTDetail"
import { Subset } from "../../../lib/types"
import { LoginSkeleton } from "../../../ui/Skeleton"
import tileBackground from "../../../images/ui/button_background_tileable.png"

export const NFTDetailPage = () => {
  const router = useRouter()
  const nftId: string = router.query["nftId"]?.toString()

  const [nftResponse] = useQuery<NftQuery>({ query: NftDocument, variables: { id: nftId } })
  const nft: Subset<Nft> = nftResponse.data?.nft

  if (!nftId || nftResponse.fetching) {
    return <LoginSkeleton />
  }

  return (
    <AppLayout>
      <Box
        position="absolute"
        bottom="0"
        bgImage={tileBackground.src}
        bgPosition="bottom"
        bgRepeat="repeat-x"
        bgSize="contain"
        width="100vw"
        minH={{ base: "240px" }}
      ></Box>
      <Box maxW="7xl" mx="auto" mt="12" position="relative">
        {nft && <NFTDetail nft={nft} />}
      </Box>
    </AppLayout>
  )
}

export default NFTDetailPage
