import { Button, Flex } from '@chakra-ui/react'
import React from 'react'
import AuthModal from '../../modal/auth/AuthModal'
import AuthButtons from './AuthButtons'
import { auth } from '@/src/firebase/clientApp'
import { signOut, User } from 'firebase/auth'
import Icons from './Icons'
import UserMenu from './UserMenu'

type RightContentProps = {
	user?: User | null
}

const RightContent: React.FC<RightContentProps> = ({ user }) => {
	return (
		<>
			<AuthModal />
			<Flex justifyContent='space-between' alignItems='center'>
				{user ? <Icons /> : <AuthButtons />}
				<UserMenu user={user} />
			</Flex>
		</>
	)
}
export default RightContent
