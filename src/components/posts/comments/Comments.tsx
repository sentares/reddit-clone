import { Post, postState } from '@/src/atoms/postsAtom'
import { firestore } from '@/src/firebase/clientApp'
import {
	Box,
	Text,
	Flex,
	SkeletonCircle,
	SkeletonText,
	Stack,
} from '@chakra-ui/react'
import { User } from 'firebase/auth'
import {
	collection,
	doc,
	getDocs,
	increment,
	orderBy,
	query,
	serverTimestamp,
	Timestamp,
	where,
	writeBatch,
} from 'firebase/firestore'
import React, { useEffect, useState } from 'react'
import { useSetRecoilState } from 'recoil'
import CommentInput from './CommentInput'
import CommentItem, { Comment } from './CommentItem'

type CommentsProps = {
	user: User
	selectedPost: Post | null
	communityId: string
}

const Comments: React.FC<CommentsProps> = ({
	user,
	selectedPost,
	communityId,
}) => {
	const [commentText, setCommentText] = useState('')
	const [comments, setComments] = useState<Comment[]>([])
	const [createLoading, setCreateLoading] = useState(false)
	const [fetchLoading, setFetchLoading] = useState(true)
	const [loadingDeleteId, setloadinDeleteId] = useState('')
	const setPostState = useSetRecoilState(postState)

	const onCreateComment = async (commentText: string) => {
		setCreateLoading(true)
		try {
			const batch = writeBatch(firestore)
			const commentDocRef = doc(collection(firestore, 'comments'))

			const newComment: Comment = {
				id: commentDocRef.id,
				creatorId: user.uid,
				creatorDisplayText: user.email!.split('@')[0],
				communityId,
				postId: selectedPost?.id!,
				postTitle: selectedPost?.title!,
				text: commentText,
				createdAt: serverTimestamp() as Timestamp,
			}
			batch.set(commentDocRef, newComment)

			newComment.createdAt = { seconds: Date.now() / 1000 } as Timestamp

			const postDocRef = doc(firestore, 'posts', selectedPost?.id!)
			batch.update(postDocRef, {
				numberOfComments: increment(1),
			})

			await batch.commit()

			setCommentText('')
			setComments(prev => [newComment, ...prev])
			setPostState(prev => ({
				...prev,
				selectedPost: {
					...prev.selectedPost,
					numberOfComments: prev.selectedPost?.numberOfComments! + 1,
				} as Post,
			}))
		} catch (error) {
			console.log('onCreateComment Error', error)
		}
		setCreateLoading(false)
	}

	const onDeleteComment = async (comment: Comment) => {
		setloadinDeleteId(comment.id)
		try {
			const batch = writeBatch(firestore)
			const commentDocRef = doc(firestore, 'comments', comment.id)
			batch.delete(commentDocRef)

			const postDocRef = doc(firestore, 'posts', selectedPost?.id!)
			batch.update(postDocRef, {
				numberOfComments: increment(-1),
			})

			await batch.commit()

			setPostState(prev => ({
				...prev,
				selectedPost: {
					...prev.selectedPost,
					numberOfComments: prev.selectedPost?.numberOfComments! - 1,
				} as Post,
			}))
			setComments(prev => prev.filter(item => item.id !== comment.id))
		} catch (error) {
			console.log('onDelete Comment errror', error)
		}
		setloadinDeleteId('')
	}

	const getPostComments = async () => {
		try {
			const commentsQuery = query(
				collection(firestore, 'comments'),
				where('postId', '==', selectedPost?.id),
				orderBy('createdAt', 'desc')
			)
			const commentDocs = await getDocs(commentsQuery)
			const comments = commentDocs.docs.map(doc => ({
				id: doc.id,
				...doc.data(),
			}))
			setComments(comments as Comment[])
		} catch (error) {
			console.log('getPostComments error', error)
		}
		setFetchLoading(false)
	}

	useEffect(() => {
		if (!selectedPost) return
		getPostComments()
	}, [selectedPost])

	return (
		<Box bg='white' borderRadius='0px 0px 4px 4px' p={2}>
			<Flex direction='column' pl={10} pr={10} fontSize='10pt' width='100%'>
				{!fetchLoading && (
					<CommentInput
						commentText={commentText}
						setCommentText={setCommentText}
						user={user}
						createLoading={createLoading}
						onCreateComment={onCreateComment}
					/>
				)}
			</Flex>
			<Stack spacing={6} p={2}>
				{fetchLoading ? (
					<>
						{[0, 1, 2].map(item => (
							<Box key={item} padding='6' bg='white'>
								<SkeletonCircle size='10' />
								<SkeletonText mt='4' noOfLines={2} spacing='4' />
							</Box>
						))}
					</>
				) : (
					<>
						{comments.length === 0 ? (
							<Flex
								direction='column'
								justify='center'
								align='center'
								borderTop='1px solid'
								borderColor='gray.100'
								p={20}
							>
								<Text fontWeight={700} opacity={0.3}>
									No Comments Yet
								</Text>
							</Flex>
						) : (
							<>
								{comments.map((comment: Comment) => (
									<CommentItem
										key={comment.id}
										comment={comment}
										onDeleteComment={onDeleteComment}
										loadingDelete={loadingDeleteId === comment.id}
										userId={user?.uid}
									/>
								))}
							</>
						)}
					</>
				)}
			</Stack>
		</Box>
	)
}
export default Comments
