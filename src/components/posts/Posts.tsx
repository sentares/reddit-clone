import React, { useEffect, useState } from 'react'
import { Community } from '@/src/atoms/communitiesAtom'
import {
	collection,
	doc,
	getDoc,
	getDocs,
	orderBy,
	query,
	where,
} from 'firebase/firestore'
import { auth, firestore } from '@/src/firebase/clientApp'
import usePosts from '@/src/hooks/usePosts'
import { Post } from '@/src/atoms/postsAtom'
import PostItem from './PostItem'
import { useAuthState } from 'react-firebase-hooks/auth'
import { Stack } from '@chakra-ui/react'
import PostLoader from './PostLoader'

type PostsProps = {
	communityData: Community
	// userId?: string
}

const Posts: React.FC<PostsProps> = ({ communityData }) => {
	const [user] = useAuthState(auth)
	const [loading, setLoading] = useState(false)
	const {
		postStateValue,
		setPostStateValue,
		onVote,
		onSelectPost,
		onDeletePost,
	} = usePosts()

	const getPosts = async () => {
		try {
			setLoading(true)
			const postQuery = query(
				collection(firestore, 'posts'),
				where('communityId', '==', communityData.id),
				orderBy('createdAt', 'desc')
			)
			const postDoc = await getDocs(postQuery)
			const posts = postDoc.docs.map(doc => ({ id: doc.id, ...doc.data() }))
			setPostStateValue(prev => ({
				...prev,
				posts: posts as Post[],
			}))
		} catch (error: any) {
			console.log('GetPosts error', error.message)
		}
		setLoading(false)
	}

	useEffect(() => {
		getPosts()
	}, [communityData])

	return (
		<>
			{loading ? (
				<PostLoader />
			) : (
				<Stack>
					{postStateValue.posts.map(item => (
						<PostItem
							key={item.id}
							post={item}
							userIsCreator={user?.uid === item.creatorId}
							userVoteValue={
								postStateValue.postVotes.find(vote => vote.postId === item.id)
									?.voteValue
							}
							onVote={onVote}
							onSelectPost={onSelectPost}
							onDeletePost={onDeletePost}
						/>
					))}
				</Stack>
			)}
		</>
	)
}
export default Posts
