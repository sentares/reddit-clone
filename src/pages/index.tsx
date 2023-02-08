import { NextPage } from 'next'
import PageContent from '../components/layout/PageContent'
import { useEffect, useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, firestore } from '../firebase/clientApp'
import { useRecoilValue } from 'recoil'
import { communityState } from '../atoms/communitiesAtom'
import {
	collection,
	doc,
	getDocs,
	limit,
	orderBy,
	query,
	where,
} from 'firebase/firestore'
import usePosts from '../hooks/usePosts'
import { Post, PostVote } from '../atoms/postsAtom'
import PostLoader from '../components/posts/PostLoader'
import { Stack } from '@chakra-ui/react'
import PostItem from '../components/posts/PostItem'
import CreatePostLink from '../components/community/CreatePostLink'
import useCommunityData from '../hooks/useCommunityData'
import Posts from '../components/posts/Posts'
import Recommendations from '../components/community/Recommendations'
import Premium from '../components/community/Premium'
import PersonalHome from '../components/community/PorsonalHome'

const Home: NextPage = () => {
	const [user, loadingUser] = useAuthState(auth)
	const [loading, setLoading] = useState(false)
	const {
		postStateValue,
		setPostStateValue,
		onDeletePost,
		onSelectPost,
		onVote,
	} = usePosts()
	const { communityStateValue } = useCommunityData()

	const buildUserHomeFeed = async () => {
		setLoading(true)
		try {
			if (communityStateValue.mySnippets.length) {
				const myCommunityIds = communityStateValue.mySnippets.map(
					snippet => snippet.communityId
				)
				const postQuery = query(
					collection(firestore, 'posts'),
					where('communityId', 'in', myCommunityIds),
					limit(10)
				)
				const postDocs = await getDocs(postQuery)
				const posts = postDocs.docs.map(doc => ({
					id: doc.id,
					...doc.data(),
				}))
				setPostStateValue(prev => ({
					...prev,
					posts: posts as Post[],
				}))
			} else {
				buildNoUserHomeFeed()
			}
		} catch (error) {
			console.log('buildUserHoFeed Error', error)
		}
		setLoading(false)
	}

	const buildNoUserHomeFeed = async () => {
		setLoading(true)
		try {
			const postQuery = query(
				collection(firestore, 'posts'),
				orderBy('voteStatus', 'desc'),
				limit(10)
			)
			const postDocs = await getDocs(postQuery)
			const posts = postDocs.docs.map(doc => ({ id: doc.id, ...doc.data() }))
			setPostStateValue(prev => ({
				...prev,
				posts: posts as Post[],
			}))
		} catch (error) {
			console.log('buildNoUserHomeFeed Error', error)
		}

		setLoading(false)
	}

	const getUserPostVotes = async () => {
		try {
			const postIds = postStateValue.posts.map(post => post.id)
			const postVotesQuery = query(
				collection(firestore, `users/${user?.uid}/postVotes`),
				where('postId', 'in', postIds)
			)
			const postVoteDocs = await getDocs(postVotesQuery)
			const postVotes = postVoteDocs.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}))

			setPostStateValue(prev => ({
				...prev,
				postVotes: postVotes as PostVote[],
			}))
		} catch (error) {
			console.log('getUserpostVotes Error', error)
		}
	}

	useEffect(() => {
		if (communityStateValue.snippetsFetched) buildUserHomeFeed()
	}, [user, communityStateValue.snippetsFetched])

	useEffect(() => {
		if (!user && !loadingUser) buildNoUserHomeFeed()
	}, [user, loadingUser])

	useEffect(() => {
		if (user && postStateValue.posts.length) getUserPostVotes()
		return () => {
			setPostStateValue(prev => ({
				...prev,
				postVotes: [],
			}))
		}
	}, [user, postStateValue.posts])

	return (
		<PageContent>
			<>
				<CreatePostLink />
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
								homePage
							/>
						))}
					</Stack>
				)}
			</>
			<Stack spacing={5}>
				<Recommendations />
				<Premium />
				<PersonalHome />
			</Stack>
		</PageContent>
	)
}
export default Home
