import { User } from 'firebase/auth'
import React from 'react'
import { Flex, Textarea, Button, Text } from '@chakra-ui/react'
import AuthButtons from '../../navbar/rightContent/AuthButtons'

type CommentInputProps = {
	commentText: string
	setCommentText: (value: string) => void
	user: User
	createLoading: boolean
	onCreateComment: (commentText: string) => void
}

const CommentInput: React.FC<CommentInputProps> = ({
	commentText,
	setCommentText,
	user,
	createLoading,
	onCreateComment,
}) => {
	return (
		<Flex direction='column' position='relative' mt={4}>
			{user ? (
				<>
					<Text mb={1}>
						Comment as{' '}
						<span style={{ color: '#3182CE' }}>
							{user?.email?.split('@')[0]}
						</span>
					</Text>
					<Textarea
						value={commentText}
						onChange={event => setCommentText(event.target.value)}
						placeholder='What are your thoughts?'
						fontSize='10pt'
						borderRadius={4}
						minHeight='100px'
						pb={10}
						_placeholder={{ color: 'gray.500' }}
						_focus={{
							outline: 'none',
							bg: 'white',
							border: '1px solid black',
						}}
					/>
					<Flex mt={0.5} justify='flex-end' p='8px'>
						<Button
							height='28px'
							disabled={!commentText.length}
							isLoading={createLoading}
							onClick={() => onCreateComment(commentText)}
						>
							Comment
						</Button>
					</Flex>
				</>
			) : (
				<Flex
					align='center'
					justify='space-between'
					borderRadius={2}
					border='1px solid'
					borderColor='gray.100'
					p={4}
				>
					<Text fontWeight={600}>Log in or sign up to leave a comment</Text>
					<AuthButtons />
				</Flex>
			)}
		</Flex>
	)
}
export default CommentInput
