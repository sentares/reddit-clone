import { ChevronDownIcon } from '@chakra-ui/icons'
import {
	Box,
	Flex,
	Icon,
	Image,
	Menu,
	MenuButton,
	MenuDivider,
	MenuItem,
	MenuList,
	Text,
} from '@chakra-ui/react'
import { useSetRecoilState } from 'recoil'
import { FaRedditSquare } from 'react-icons/fa'
import { VscAccount } from 'react-icons/vsc'
import { IoSparkles } from 'react-icons/io5'
import { CgProfile } from 'react-icons/cg'
import { MdOutlineLogin } from 'react-icons/md'
import { signOut, User } from 'firebase/auth'
import { auth } from '@/src/firebase/clientApp'
import { authModalState } from '@/src/atoms/authModalAtoms'
import { TiHome } from 'react-icons/ti'
import Communites from './Communites'
import useDirectory from '@/src/hooks/useDirectory'

const Directory: React.FC = ({}) => {
	const { directoryState, toggleMenuOpen } = useDirectory()

	return (
		<Menu isOpen={directoryState.isOpen}>
			<MenuButton
				cursor='pointer'
				padding='0px 6px'
				borderRadius='4px'
				_hover={{ outline: '1px solid', outlineColor: 'gray.200' }}
				mr={2}
				ml={{ base: 0, md: 2 }}
				onClick={toggleMenuOpen}
			>
				<Flex
					alignItems='center'
					justify='space-between'
					width={{ base: 'auto', lg: '200px' }}
				>
					<Flex alignItems='center'>
						{directoryState.selectedMenuItem.imageURL ? (
							<Image
								src={directoryState.selectedMenuItem.imageURL}
								borderRadius='full'
								boxSize='24px'
								mr={2}
							/>
						) : (
							<Icon
								fontSize={24}
								mr={{ base: 1, md: 2 }}
								as={directoryState.selectedMenuItem.icon}
								color={directoryState.selectedMenuItem.iconColor}
							/>
						)}
						<Box
							display={{ base: 'none', lg: 'flex' }}
							flexDirection='column'
							fontSize='10pt'
						>
							<Text fontWeight={600} fontSize='10pt'>
								{directoryState.selectedMenuItem.displayText}
							</Text>
						</Box>
					</Flex>
					<ChevronDownIcon color='gray.500' />
				</Flex>
			</MenuButton>
			<MenuList>
				<Communites />
			</MenuList>
		</Menu>
	)
}
export default Directory
