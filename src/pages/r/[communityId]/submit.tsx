import { communityState } from '@/src/atoms/communitiesAtom'
import About from '@/src/components/community/About'
import PageContent from '@/src/components/layout/PageContent'
import NewPostForm from '@/src/components/posts/NewPostForm'
import { auth } from '@/src/firebase/clientApp'
import useCommunityData from '@/src/hooks/useCommunityData'
import { Box, Text } from '@chakra-ui/react'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useRecoilValue } from 'recoil'

const SubmitPostPage: React.FC = () => {
	const [user] = useAuthState(auth)
	// const communityStateValue = useRecoilValue(communityState)
	const { communityStateValue } = useCommunityData()
	console.log('Community', communityStateValue)

	return (
		<PageContent>
			<>
				<Box p='14px' borderRadius='4px' bg='white' color='blue.400'>
					<Text fontSize='13pt' fontWeight={700}>
						Create a post
					</Text>
				</Box>
				{user && <NewPostForm user={user} />}
			</>
			<>
				{communityStateValue.currentCommunity && (
					<About communityData={communityStateValue.currentCommunity} />
				)}
			</>
		</PageContent>
	)
}
export default SubmitPostPage
