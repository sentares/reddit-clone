import { defaultMenuItem } from '@/src/atoms/DirectoryMenuAtom'
import { auth } from '@/src/firebase/clientApp'
import useDirectory from '@/src/hooks/useDirectory'
import { Flex, Image } from '@chakra-ui/react'
import React from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import Directory from './derictory/Directory'
import RightContent from './rightContent/RightContent'
import SearchInput from './SearchInput'

const Navbar: React.FC = () => {
	const [user, loading, error] = useAuthState(auth)
	const { onSelectMenuItem } = useDirectory()

	return (
		<Flex
			bg='white'
			height='44px'
			padding='6px 12px'
			justify={{ md: 'space-between' }}
			cursor='pointer'
		>
			<Flex
				align='center'
				width={{ base: '40px', md: 'auto' }}
				mr={{ base: 0, md: 'unset' }}
				onClick={() => onSelectMenuItem(defaultMenuItem)}
			>
				<Image src='/images/redditFace.svg' height='30px' />
				<Image
					src='/images/redditText.svg'
					height='46px'
					display={{ base: 'none', md: 'unset' }}
				/>
			</Flex>
			{user && <Directory />}
			<SearchInput user={user} />
			<RightContent user={user} />
		</Flex>
	)
}
export default Navbar
