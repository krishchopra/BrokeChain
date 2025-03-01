import { Box, Button, Center, Heading, Link, VStack } from "@chakra-ui/react"
import { useRouter } from "next/router"
import * as React from "react"

interface IBannerCTAProps {
  backgroundUrl?: string
  contentBefore?: string
  contentAfter?: string
  highlight?: string
  buttonContent?: string
  buttonPath?: string
}

export const CallToAction: React.FunctionComponent<IBannerCTAProps> = ({
  contentBefore,
  highlight,
  contentAfter,
  buttonContent,
  buttonPath,
}) => {
  const router = useRouter()
  return (
    <VStack as="section" bgImage="url('/images/ui/gaara.png')" width="100%">
      <Center width="100%" pt="12">
        <Heading textAlign="center" as="h3" color="page.text">
          {contentBefore}
          {` `}
          <Box as="mark" color="page.accent" bg="transparent">
            {highlight}
          </Box>
          {` `}
          {contentAfter}
        </Heading>
      </Center>

      <Center width="100%" pt="8">
        <Link onClick={() => router.push(buttonPath)}>
          <Button
            p="8"
            fontSize="xl"
            borderRadius="0"
            style={{
              background: "#A41B15",
              borderRadius: 0,
              boxShadow: "5px 5px #ffffff",
              textTransform: "uppercase",
            }}
          >
            {buttonContent}
          </Button>
        </Link>
      </Center>
    </VStack>
  )
}
