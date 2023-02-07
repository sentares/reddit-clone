import { Box, Flex, Icon, Stack, Text } from '@chakra-ui/react'
import { Timestamp } from 'firebase/firestore'
import moment from 'moment'
import React from 'react'
import { FaReddit } from 'react-icons/fa'

export type Comment = {
	id: string
	creatorId: string
	creatorDisplayText: string
	communityId: string
	postId: string
	postTitle: string
	text: string
	createdAt: Timestamp
}

type CommentItemProps = {
	comment: Comment
	onDeleteComment: (comment: Comment) => void
	loadingDelete: boolean
	userId: string
}

const CommentItem: React.FC<CommentItemProps> = ({
	comment,
	onDeleteComment,
	loadingDelete,
	userId,
}) => {
	return (
		<Flex>
			<Box mr={2}>
				<Icon as={FaReddit} fontSize={30} color='gray.300' />
			</Box>
			<Stack spacing={1}>
				<Stack direction='row' align='center' spacing={2} fontSize='8pt'>
					<Text
						fontWeight={700}
						_hover={{ textDecoration: 'underline', cursor: 'pointer' }}
					>
						{comment.creatorDisplayText}
					</Text>
					<Text color='gray.600'>
						{moment(new Date(comment.createdAt.seconds * 1000)).fromNow()}
					</Text>
				</Stack>
				<Text fontSize='10pt'>{comment.text}</Text>
			</Stack>
		</Flex>
	)
}
export default CommentItem
