import { Community } from '@/src/atoms/communitiesAtom'
import CreatePostLink from '@/src/components/community/CreatePostLink'
import Header from '@/src/components/community/Header'
import NotFound from '@/src/components/community/NotFound'
import PageContent from '@/src/components/layout/PageContent'
import Posts from '@/src/components/posts/Posts'
import { auth, firestore } from '@/src/firebase/clientApp'
import { doc, getDoc } from 'firebase/firestore'
import { GetServerSidePropsContext } from 'next'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import safeJsonStringify from 'safe-json-stringify'

type CommunityPageProps = {
	communityData: Community
}

const CommunityPage: React.FC<CommunityPageProps> = ({ communityData }) => {
	if (!communityData) {
		return <NotFound />
	}

	return (
		<>
			<Header communityData={communityData} />
			<PageContent>
				<>
					<CreatePostLink />
					<Posts communityData={communityData} />
				</>
				<>
					<div>RHS</div>
				</>
			</PageContent>
		</>
	)
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
	try {
		const communityDocRef = doc(
			firestore,
			'communities',
			context.query.communityId as string
		)
		const communityDoc = await getDoc(communityDocRef)
		return {
			props: {
				communityData: communityDoc.exists()
					? JSON.parse(
							safeJsonStringify({ id: communityDoc.id, ...communityDoc.data() })
					  )
					: '',
			},
		}
	} catch (error) {
		console.log('getServerSideProps error', error)
	}
}

export default CommunityPage
