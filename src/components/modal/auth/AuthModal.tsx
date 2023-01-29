import { authModalState, AuthModalState } from '@/src/atoms/authModalAtoms'
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useDisclosure,
	Flex,
} from '@chakra-ui/react'
import React from 'react'
import { useRecoilState } from 'recoil'
import AuthInputs from './AuthInputs'

const AuthModal: React.FC = () => {
	const [modalState, setModalState] = useRecoilState(authModalState)
	const handleClose = () => {
		setModalState(prev => ({
			...prev,
			open: false,
		}))
	}
	return (
		<>
			<Modal isOpen={modalState.open} onClose={handleClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader textAlign='center'>
						{modalState.view === 'login' && 'Login'}
						{modalState.view === 'signup' && 'Sign Up'}
						{modalState.view === 'resetPassword' && 'Reset Password'}
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody
						display='flex'
						flexDirection='column'
						alignItems='center'
						justifyContent='center'
						pb={6}
					>
						<Flex
							direction='column'
							alignItems='center'
							justifyContent='center'
							width='70%'
						>
							<AuthInputs />
						</Flex>
					</ModalBody>
				</ModalContent>
			</Modal>
		</>
	)
}
export default AuthModal
