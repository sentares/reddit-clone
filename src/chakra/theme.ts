import '@fontsource/open-sans'
import { extendTheme } from '@chakra-ui/react'
import { Button } from './button'

const customColors = {
	brand: {
		100: '#FF3c00',
	},
}

const customFonts = {
	body: 'Open Sans, sans-serif',
}
const customStyles = {
	global: () => ({
		body: {
			bg: 'gray.200',
		},
	}),
}
const customComponents = {
	Button,
}

export const theme = extendTheme({
	colors: customColors,
	fonts: customFonts,
	styles: customStyles,
	components: customComponents,
})
