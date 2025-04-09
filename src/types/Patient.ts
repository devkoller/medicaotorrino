import { UserType } from "./User"
import { MedicationsType } from "./Medications"

export interface PatientType {
	id: number
	name: string
	lastname1: string
	lastname2: string
	email?: string
	phone: string
	birthdate?: string
	workIn?: string
	curp?: string
	rfc?: string
	gender?: number
	bloodType?: string
	active?: boolean
	patient_address: PatientAddressType | null
	pathological_history: PatientPathologicalHistoryType | null
	family_history: PatientFamilyHistoryType | null
	history: PatientHistoryType | null
	clinic_histories?: PatientClinicType[]
	appointments?: AppointmentType[]
}

export interface PatientAddressType {
	id: number
	idPatient: number
	street?: string
	neighborhood?: string
	city?: string
	state?: string
	country?: string
	zip_code?: string
	active?: boolean
}

export interface PatientClinicType {
	id: number
	idPatient: number
	oral?: boolean
	oral_description?: string
	nose?: boolean
	nose_description?: string
	earing_left?: boolean
	earing_left_description?: string
	earing_right?: boolean
	earing_right_description?: string
	face?: boolean
	face_description?: string
	evolution?: string
	idx?: string
	updatedAt?: string
	mc?: string
	user?: UserType
	medical_recipe?: MedicalRecipeType
}

export interface PatientFamilyHistoryType {
	id: number
	idPatient: number
	family_history?: string
	other_medications?: string
}

export interface PatientHistoryType {
	id: number
	idPatient: number
	tabaquism?: boolean
	tabaquism_description?: string
	alcoholism?: boolean
	alcoholism_description?: string
	drug_addiction?: boolean
	use_glasses?: boolean
	use_glasses_description?: string
	use_earing_aid?: boolean
	sleep_habits?: boolean
	sleep_habits_description?: string
	animals?: boolean
	animals_description?: string
	other_diseases?: boolean
	other_diseases_description?: string
}

export interface PatientPathologicalHistoryType {
	id: number
	idPatient: number
	surgery?: boolean
	surgery_description?: string
	surgery_date?: string
	allergies?: boolean
	allergies_description?: string
	asthma?: boolean
	asthma_description?: string
	dm?: boolean
	dm_description?: string
	has?: boolean
	has_description?: string
	other_diseases?: boolean
	other_diseases_description?: string
}

export interface MedicalRecipeDetailsType {
	id: number
	dosage?: string
	duration: string
	frequency: string
	id_medical_recipe: number
	id_medication?: number
	medication: MedicationsType
	special_instructions?: string
	medicine_description: string
}

export interface MedicalRecipeType {
	id: number
	idPatient: number
	idUser: number
	idClinicHistory: number
	createdAt: string
	updatedAt: string
	active: boolean
	medical_recipe_details: MedicalRecipeDetailsType[]
}

export interface AppointmentType {
	id: number
	idPatient: number
	idUser: number
	dateAppointment: string
	duration: number
	start: number
	startTime: string
	end: number
	endTime: string
	status: number
	reason?: string
	notes?: string
	patientName?: string
	patientPhone?: string
	doctorName?: string
	doctorSpecialty?: string
	statusLabel?: string
	date?: string
}
