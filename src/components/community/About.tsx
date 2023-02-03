import { Community } from '@/src/atoms/communitiesAtom'
import {
	Box,
	Button,
	Divider,
	Flex,
	Icon,
	Skeleton,
	SkeletonCircle,
	Stack,
	Text,
	Image,
	Spinner,
} from '@chakra-ui/react'
import React from 'react'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'

type AboutProps = {
	communityData: Community
}

const About: React.FC<AboutProps> = ({ communityData }) => {
	return (
		<Box position='sticky' top='14px'>
			<Flex
				justify='space-between'
				align='center'
				p={3}
				color='white'
				bg='blue.400'
				borderRadius='4px 4px 0px 0px'
			>
				<Text fontSize='10pt' fontWeight={700}>
					About Community
				</Text>
				<Icon as={HiOutlineDotsHorizontal} cursor='pointer' />
			</Flex>
		</Box>
	)
}
export default About
