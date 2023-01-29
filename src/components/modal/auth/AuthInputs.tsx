import { authModalState } from '@/src/atoms/authModalAtoms'
import { Flex } from '@chakra-ui/react'
import React from 'react'
import { useRecoilValue } from 'recoil'
import Login from './Login'

type AuthInputsProps = {}

const AuthInputs: React.FC<AuthInputsProps> = () => {
	const modalState = useRecoilValue(authModalState)
	return (
		<Flex direction='column' alignItems='center' width='100%' mt={4}>
			{modalState.view === 'login' && <Login />}
			{/* {modalState.view === 'signup' && <SIgnUp />} */}
		</Flex>
	)
}
export default AuthInputs
