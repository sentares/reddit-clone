import React, { useState } from 'react'
import { Post } from '@/src/atoms/postsAtom'
import {
	Alert,
	AlertIcon,
	Flex,
	Icon,
	Image,
	Skeleton,
	Spinner,
	Stack,
	Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import { BsChat, BsDot } from 'react-icons/bs'
import { FaReddit } from 'react-icons/fa'
import {
	IoArrowDownCircleOutline,
	IoArrowDownCircleSharp,
	IoArrowRedoOutline,
	IoArrowUpCircleOutline,
	IoArrowUpCircleSharp,
	IoBookmarkOutline,
} from 'react-icons/io5'
import moment from 'moment'
import { async } from '@firebase/util'
import { log } from 'console'
import { AiOutlineDelete } from 'react-icons/ai'

type PostItemProps = {
	post: Post
	userIsCreator: boolean
	userVoteValue?: number
	onVote: (post: Post, vote: number, communityId: string) => void
	onDeletePost: (post: Post) => Promise<boolean>
	onSelectPost: () => void
}

const PostItem: React.FC<PostItemProps> = ({
	post,
	userIsCreator,
	userVoteValue,
	onVote,
	onDeletePost,
	onSelectPost,
}) => {
	const [loadingImage, setLoadingImage] = useState(true)
	const [loadingDelete, setLoadingDelete] = useState(false)

	const [error, setError] = useState(false)

	const handleDelete = async () => {
		setLoadingDelete(true)
		try {
			const success = await onDeletePost(post)
			if (!success) {
				throw new Error('Failed to delete post')
			}
			console.log('Post was succesfuly delited')
		} catch (error: any) {
			setError(error.message)
			console.log('deleteError', error)
		}
		setLoadingDelete(false)
	}

	return (
		<Flex
			border='1px solid'
			bg='white'
			borderColor='gray.300'
			borderRadius={4}
			cursor='pointer'
			_hover={{ borderColor: 'gray:500' }}
			onClick={onSelectPost}
		>
			<Flex
				direction='column'
				align='center'
				bg='gray.100'
				p={2}
				width='40px'
				borderRadius={4}
			>
				<Icon
					as={
						userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
					}
					color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
					fontSize={22}
					cursor='pointer'
					onClick={() => onVote(post, 1, post.communityId)}
				/>
				<Text fontSize='9pt' fontWeight={600}>
					{post.voteStatus}
				</Text>
				<Icon
					as={
						userVoteValue === -1
							? IoArrowDownCircleSharp
							: IoArrowDownCircleOutline
					}
					color={userVoteValue === -1 ? '#4379FF' : 'gray.400'}
					fontSize={22}
					cursor='pointer'
					onClick={() => onVote(post, -1, post.communityId)}
				/>
			</Flex>
			<Flex direction='column' width='100%'>
				{error && (
					<Alert status='error'>
						<AlertIcon />
						<Text mr={2}>Error deleting post</Text>
					</Alert>
				)}
				<Stack spacing={1} p='10px 10px'>
					<Stack direction='row' spacing={0.6} align='center' fontSize='9pt'>
						<Text>
							Posted by u/{post.creatorDisplayName}{' '}
							{moment(new Date(post.createdAt?.seconds * 1000)).fromNow()}
						</Text>
					</Stack>
					<Text fontSize='12pt' fontWeight={600}>
						{post.title}
					</Text>
					<Text fontSize='10pt'>{post.body}</Text>
					{post.imageURL && (
						<Flex justify='center' align='center' p={2}>
							{loadingImage && (
								<Skeleton height='200px' width='100%' borderRadius={4} />
							)}
							<Image
								width='80%'
								maxWidth='500px'
								maxHeight='460px'
								src={post.imageURL}
								display={loadingImage ? 'none' : 'unset'}
								onLoad={() => setLoadingImage(false)}
								alt='Post Image'
							/>
						</Flex>
					)}
				</Stack>
				<Flex ml={1} mb={1} color='gray.500' fontWeight={600}>
					<Flex
						align='center'
						p='8px 10px'
						borderRadius={4}
						_hover={{ bg: 'gray.200' }}
						cursor='pointer'
					>
						<Icon as={BsChat} mr={2} />
						<Text fontSize='9pt'>{post.numberOfComments}</Text>
					</Flex>
					<Flex
						align='center'
						p='8px 10px'
						borderRadius={4}
						_hover={{ bg: 'gray.200' }}
						cursor='pointer'
					>
						<Icon as={IoArrowRedoOutline} mr={2} />
						<Text fontSize='9pt'>Share</Text>
					</Flex>
					<Flex
						align='center'
						p='8px 10px'
						borderRadius={4}
						_hover={{ bg: 'gray.200' }}
						cursor='pointer'
					>
						<Icon as={IoBookmarkOutline} mr={2} />
						<Text fontSize='9pt'>Save</Text>
					</Flex>
					{userIsCreator && (
						<Flex
							align='center'
							p='8px 10px'
							borderRadius={4}
							_hover={{ bg: 'gray.200' }}
							cursor='pointer'
							onClick={handleDelete}
						>
							{loadingDelete ? (
								<Spinner size='sm' />
							) : (
								<>
									<Icon as={AiOutlineDelete} mr={2} />
									<Text fontSize='9pt'>Delete</Text>
								</>
							)}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	)
}
export default PostItem
