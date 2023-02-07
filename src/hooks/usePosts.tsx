import {
	collection,
	deleteDoc,
	doc,
	getDoc,
	getDocs,
	query,
	where,
	writeBatch,
} from 'firebase/firestore'
import { deleteObject, ref } from 'firebase/storage'
import { useRouter } from 'next/router'
import React, { useEffect } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil'
import { authModalState } from '../atoms/authModalAtoms'
import { communityState } from '../atoms/communitiesAtom'
import { Post, postState, PostVote } from '../atoms/postsAtom'
import Login from '../components/modal/auth/Login'
import { auth, firestore, storage } from '../firebase/clientApp'

const usePosts = () => {
	const [postStateValue, setPostStateValue] = useRecoilState(postState)
	const [user] = useAuthState(auth)
	const currentCommunity = useRecoilValue(communityState).currentCommunity
	const setAuthModalState = useSetRecoilState(authModalState)
	const router = useRouter()

	const onDeletePost = async (post: Post): Promise<boolean> => {
		try {
			if (post.imageURL) {
				const imageRef = ref(storage, `posts/${post.id}/image`)
				await deleteObject(imageRef)
			}

			const postDocRef = doc(firestore, 'posts', post.id)
			await deleteDoc(postDocRef)

			setPostStateValue(prev => ({
				...prev,
				posts: prev.posts.filter(item => item.id !== post.id),
			}))

			return true
		} catch (error) {
			return false
		}
	}

	const onVote = async (
		event: React.MouseEvent<SVGElement, MouseEvent>,
		post: Post,
		vote: number,
		communityId: string
	) => {
		event.stopPropagation()
		if (!user?.uid) {
			setAuthModalState({ open: true, view: 'login' })
			return
		}

		try {
			const { voteStatus } = post
			const existingVote = postStateValue.postVotes.find(
				vote => vote.postId === post.id
			)

			const batch = writeBatch(firestore)
			const updatedPost = { ...post }
			const updatedPosts = [...postStateValue.posts]
			let updatedPostVotes = [...postStateValue.postVotes]
			let voteChange = vote

			if (!existingVote) {
				const postVoteRef = doc(
					collection(firestore, 'users', `${user?.uid}/postVotes`)
				)

				const newVote: PostVote = {
					id: postVoteRef.id,
					postId: post.id!,
					communityId,
					voteValue: vote,
				}

				batch.set(postVoteRef, newVote)

				updatedPost.voteStatus = voteStatus + vote
				updatedPostVotes = [...updatedPostVotes, newVote]
			} else {
				const postVoteRef = doc(
					firestore,
					'users',
					`${user?.uid}/postVotes/${existingVote.id}`
				)

				if (existingVote.voteValue === vote) {
					updatedPost.voteStatus = voteStatus - vote
					updatedPostVotes = updatedPostVotes.filter(
						vote => vote.id !== existingVote.id
					)

					batch.delete(postVoteRef)

					voteChange == -1
				} else {
					updatedPost.voteStatus = voteStatus + 2 * vote
					const voteIdx = postStateValue.postVotes.findIndex(
						vote => vote.id === existingVote.id
					)
					updatedPostVotes[voteIdx] = {
						...existingVote,
						voteValue: vote,
					}

					batch.update(postVoteRef, {
						voteValue: vote,
					})

					voteChange = 2 * vote
				}
			}
			const postIdx = postStateValue.posts.findIndex(
				item => item.id === post.id
			)
			updatedPosts[postIdx] = updatedPost
			setPostStateValue(prev => ({
				...prev,
				posts: updatedPosts,
				postVotes: updatedPostVotes,
			}))

			if (postStateValue.selectedPost) {
				setPostStateValue(prev => ({
					...prev,
					selectedPost: updatedPost,
				}))
			}

			const postRef = doc(firestore, 'posts', post.id!)
			batch.update(postRef, { voteStatus: voteStatus + voteChange })

			await batch.commit()
		} catch (error) {
			console.log('onVote error', error)
		}
	}

	const getCommunityPostVotes = async (communityId: string) => {
		const postVotesQuery = query(
			collection(firestore, 'users', `${user?.uid}/postVotes`),
			where('communityId', '==', communityId)
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
	}

	useEffect(() => {
		if (!user || !currentCommunity?.id) return
		getCommunityPostVotes(currentCommunity?.id)
	}, [user, currentCommunity])

	useEffect(() => {
		if (!user) {
			setPostStateValue(prev => ({
				...prev,
				postVotes: [],
			}))
		}
	}, [user])

	const onSelectPost = (post: Post) => {
		setPostStateValue(prev => ({
			...prev,
			selectedPost: post,
		}))
		router.push(`/r/${post.communityId}/comments/${post.id}`)
	}

	return {
		postStateValue,
		setPostStateValue,
		onVote,
		onSelectPost,
		onDeletePost,
	}
}
export default usePosts
