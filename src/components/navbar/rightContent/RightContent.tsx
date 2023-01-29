import { Flex } from '@chakra-ui/react'
import React from 'react'
import AuthModal from '../../modal/auth/AuthModal'
import AuthButtons from './AuthButtons'

type RightContentProps = {}

const RightContent: React.FC<RightContentProps> = () => {
	return (
		<Flex justifyContent='space-between' alignItems='center'>
			<AuthModal />
			<AuthButtons />
		</Flex>
	)
}
export default RightContent
