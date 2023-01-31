import { auth, firestore } from '@/src/firebase/clientApp'
import {
	Box,
	Button,
	Checkbox,
	Divider,
	Flex,
	Input,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Stack,
	Text,
	Icon,
} from '@chakra-ui/react'
import { async } from '@firebase/util'
import {
	doc,
	getDoc,
	runTransaction,
	serverTimestamp,
	setDoc,
} from 'firebase/firestore'
import React, { useState } from 'react'
import { useAuthState } from 'react-firebase-hooks/auth'
import { BsFillEyeFill, BsFillPersonFill } from 'react-icons/bs'
import { HiLockClosed } from 'react-icons/hi'

type CreateCommunityModalProps = {
	open: boolean
	handleClose: () => void
}

const CreateCommunityModal: React.FC<CreateCommunityModalProps> = ({
	open,
	handleClose,
}) => {
	const [user] = useAuthState(auth)
	const [communityName, setCommunityName] = useState('')
	const [charsRemaining, setCharsRemaining] = useState(21)
	const [communityType, setCommunityType] = useState('public')
	const [error, setError] = useState('')
	const [loading, setLoading] = useState(false)

	const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.value.length > 21) return
		setCommunityName(event.target.value)
		setCharsRemaining(21 - event.target.value.length)
	}

	const onCommunityTypeChange = (
		event: React.ChangeEvent<HTMLInputElement>
	) => {
		setCommunityType(event.target.name)
	}

	const handleCreateCommunity = async () => {
		if (error) setError('')
		const format = /[ `!@#$%^&*()+\-=\[\]{};':"\\|,.<>\/?~]/
		if (format.test(communityName) || communityName.length < 3) {
			setError(
				'Community names must be between 3–21 characters, and can only contain letters, numbers, or underscores.'
			)
			return
		}
		setLoading(true)
		try {
			const communityDocRef = doc(firestore, 'communities', communityName)

			await runTransaction(firestore, async transaction => {
				const communityDoc = await transaction.get(communityDocRef)
				if (communityDoc.exists()) {
					throw new Error(`Sorry, r/${communityName} is taken. Try another`)
				}
				transaction.set(communityDocRef, {
					creatorId: user?.uid,
					createdAt: serverTimestamp(),
					numberOfMembers: 1,
					privacyType: communityType,
				})

				transaction.set(
					doc(firestore, `users/${user?.uid}/communitySnipets`, communityName),
					{
						communityId: communityName,
						isModerator: true,
					}
				)
			})
		} catch (error: any) {
			console.log('handleCommunityError', error)
			setError(error.message)
		}
		setLoading(false)
	}
	return (
		<>
			<Modal isOpen={open} onClose={handleClose} size='xl'>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader
						display='flex'
						flexDirection='column'
						fontSize={15}
						padding={3}
					>
						Create a Community
					</ModalHeader>
					<Box pl={3} pr={3}>
						<Divider />
						<ModalCloseButton />
						<ModalBody display='flex' flexDirection='column' padding='10px 0px'>
							<Text fontWeight={600} fontSize={15}>
								Name
							</Text>
							<Text fontSize={11} color='gray.500'>
								Community names including capitalization cannot be changed
							</Text>
							<Text
								color='gray.400'
								position='relative'
								top='28px'
								left='10px'
								width='20px'
							>
								r/
							</Text>
							<Input
								position='relative'
								name='name'
								value={communityName}
								onChange={handleChange}
								pl='22px'
								type={''}
								size='sm'
							/>
							<Text
								fontSize='9pt'
								color={charsRemaining === 0 ? 'red' : 'gray.500'}
								pt={2}
							>
								{charsRemaining}
								Characters remaining
							</Text>
							<Text color='red'>{error}</Text>
							<Box mt={4} mb={4}>
								<Text fontWeight={600} fontSize={15}>
									Community Type
								</Text>
								<Stack spacing={4} pt={3}>
									<Checkbox
										colorScheme='blue'
										name='public'
										isChecked={communityType === 'public'}
										onChange={onCommunityTypeChange}
									>
										<Box alignItems='center'>
											<Flex align='center'>
												<Icon as={BsFillPersonFill} mr={2} color='gray.500' />
												<Text fontSize='10pt' mr={1}>
													Public
												</Text>
											</Flex>
											<Text fontSize='8pt' color='gray.500' pt={0.2}>
												Anyone can view, post, and comment to this community
											</Text>
										</Box>
									</Checkbox>
									<Checkbox
										colorScheme='blue'
										name='restricted'
										isChecked={communityType === 'restricted'}
										onChange={onCommunityTypeChange}
									>
										<Box alignItems='center'>
											<Flex align='center'>
												<Icon as={BsFillEyeFill} color='gray.500' mr={2} />
												<Text fontSize='10pt' mr={1}>
													Restricted
												</Text>
											</Flex>
											<Text fontSize='8pt' color='gray.500' pt={0.2}>
												Anyone can view this community, but only approved users
												can post
											</Text>
										</Box>
									</Checkbox>
									<Checkbox
										colorScheme='blue'
										name='private'
										isChecked={communityType === 'private'}
										onChange={onCommunityTypeChange}
									>
										<Box alignItems='center'>
											<Flex align='center'>
												<Icon as={HiLockClosed} color='gray.500' mr={2} />
												<Text fontSize='10pt' mr={1}>
													Private
												</Text>
											</Flex>
											<Text fontSize='8pt' color='gray.500' pt={0.2}>
												Only approved users can view and submit to this
												community
											</Text>
										</Box>
									</Checkbox>
								</Stack>
							</Box>
						</ModalBody>
					</Box>
					<ModalFooter bg='gray.100' borderRadius='0px 0px 10px 10px'>
						<Button
							variant='outline'
							height='30px'
							mr={2}
							onClick={handleClose}
						>
							Cancel
						</Button>
						<Button
							variant='solid'
							height='30px'
							onClick={handleCreateCommunity}
							isLoading={loading}
						>
							Create Community
						</Button>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	)
}
export default CreateCommunityModal
