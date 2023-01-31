import { Flex, Icon, MenuItem } from '@chakra-ui/react'
import React, { useState } from 'react'
import CreateCommunityModal from '../../modal/createCommunity/CreateCommunityModal'
import { GrAdd } from 'react-icons/gr'

type CommunitesProps = {}

const Communites: React.FC<CommunitesProps> = () => {
	const [open, setOpen] = useState(false)
	return (
		<>
			<CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
			<MenuItem
				width='100%'
				fontSize='10pt'
				_hover={{ bg: 'gray.100' }}
				onClick={() => {}}
			>
				<Flex align='center' onClick={() => setOpen(true)}>
					<Icon fontSize={20} mr={2} as={GrAdd} />
					Create Community
				</Flex>
			</MenuItem>
		</>
	)
}
export default Communites
