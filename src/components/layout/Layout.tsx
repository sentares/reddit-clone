import React from 'react'
import Navbar from '../navbar/Navbar'

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<>
			<Navbar />
			<main>{children}</main>
		</>
	)
}

export default Layout
