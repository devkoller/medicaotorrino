function formatCurrency(value: number): string {
	return new Intl.NumberFormat("en-US", {
		style: "currency",
		currency: "USD",
	}).format(value)
}

const getInitials = (name: string): string => {
	return name
		.split(" ")
		.map((part) => part.charAt(0))
		.join("")
		.toUpperCase()
		.substring(0, 2)
}

const calculateAge = (birthdate: Date): number => {
	const today = new Date()
	let age = today.getFullYear() - birthdate.getFullYear()
	const monthDifference = today.getMonth() - birthdate.getMonth()

	if (
		monthDifference < 0 ||
		(monthDifference === 0 && today.getDate() < birthdate.getDate())
	) {
		age--
	}

	return age
}

const formatGender = (gender: number): string => {
	let genders = ["Sin genero registrado", "Masculino", "Femenino"]
	return genders[gender]
}

export default { formatCurrency, getInitials, calculateAge, formatGender }
