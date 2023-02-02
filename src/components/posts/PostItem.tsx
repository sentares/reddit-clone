import React from 'react'
import { Post } from '@/src/atoms/postsAtom'
import {
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

type PostItemProps = {
	post: Post
	userIsCreator: boolean
	userVoteValue?: number
	onVote: () => {}
	onDeletePost: () => {}
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
	return (
		<Flex
			border='1px solid'
			bg='white'
			// borderColor={singlePostView ? "white" : "gray.300"}
			// borderRadius={singlePostView ? "4px 4px 0px 0px" : 4}
			// cursor={singlePostView ? "unset" : "pointer"}
			// _hover={{ borderColor: singlePostView ? "none" : "gray.500" }}
			// onClick={() => onSelectPost && post && onSelectPost(post, postIdx!)}
		>
			<Flex
				direction='column'
				align='center'
				// bg={singlePostView ? "none" : "gray.100"}
				p={2}
				width='40px'
				// borderRadius={singlePostView ? "0" : "3px 0px 0px 3px"}
			>
				<Icon
					as={
						userVoteValue === 1 ? IoArrowUpCircleSharp : IoArrowUpCircleOutline
					}
					color={userVoteValue === 1 ? 'brand.100' : 'gray.400'}
					fontSize={22}
					cursor='pointer'
					// onClick={(event) => onVote(event, post, 1, post.communityId)}
				/>
				<Text fontSize='9pt' fontWeight={600}>
					{/* {post.voteStatus} */}
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
					// onClick={(event) => onVote(event, post, -1, post.communityId)}
				/>
			</Flex>
			<Flex direction='column' width='100%'>
				<Stack spacing={1} p='10px 10px'>
					<Text fontSize='12pt' fontWeight={600}>
						{post.title}
					</Text>
					<Text fontSize='10pt'>{post.body}</Text>
					{/* {post.imageURL && (
            <Flex justify="center" align="center" p={2}>
              {loadingImage && (
                <Skeleton height="200px" width="100%" borderRadius={4} />
              )}
              <Image
                // width="80%"
                // maxWidth="500px"
                maxHeight="460px"
                // src={post.imageURL}
                // display={loadingImage ? "none" : "unset"}
                // onLoad={() => setLoadingImage(false)}
                alt="Post Image"
              />
            </Flex>
          )} */}
				</Stack>
				<Flex ml={1} mb={0.5} color='gray.500' fontWeight={600}>
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
							// onClick={handleDelete}
						>
							{/* {loadingDelete ? (
                <Spinner size="sm" />
              ) : (
                <>
                  <Icon as={AiOutlineDelete} mr={2} />
                  <Text fontSize="9pt">Delete</Text>
                </>
              )} */}
						</Flex>
					)}
				</Flex>
			</Flex>
		</Flex>
	)
}
export default PostItem
