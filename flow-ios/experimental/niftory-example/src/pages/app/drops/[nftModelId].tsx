import { Box, Skeleton } from "@chakra-ui/react"
import { useRouter } from "next/router"
import React from "react"
import { useQuery } from "urql"

import { NftModelDocument, NftModelQuery } from "../../../../generated/graphql"
import AppLayout from "../../../components/AppLayout"
import { NFTModelDetail } from "../../../components/drops/NFTModelDetail"
import tileBackground from "../../../images/ui/button_background_tileable.png"

const NFTModelDetailPage = () => {
  const router = useRouter()
  const nftModelId = router.query["nftModelId"]?.toString()

  const [nftModelResponse] = useQuery<NftModelQuery>({
    query: NftModelDocument,
    variables: { id: nftModelId },
  })

  const nftModel = nftModelResponse?.data?.nftModel
  const metadata = {
    title: nftModel?.title,
    description: nftModel?.description,
    amount: nftModel?.quantity,
    amountMinted: nftModel?.quantityMinted,
    content: [
      {
        contentType: nftModel?.content?.files[0]?.contentType,
        contentUrl: nftModel?.content?.files[0]?.url,
        thumbnailUrl: nftModel?.content?.poster?.url,
        alt: nftModel?.title,
      },
    ],
  }

  console.log(metadata)

  return (
    <AppLayout>
      <Skeleton isLoaded={!nftModelResponse.fetching}>
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
        <Box maxW="7xl" mx="auto" mt="20">
          <NFTModelDetail id={nftModelId} metadata={metadata} />
        </Box>
      </Skeleton>
    </AppLayout>
  )
}

NFTModelDetailPage.requireWallet = true
export default NFTModelDetailPage
