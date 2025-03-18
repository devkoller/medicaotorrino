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
	alcoholism?: boolean
	drug_addiction?: boolean
	use_glasses?: boolean
	use_earing_aid?: boolean
	sleep_habits?: boolean
	sleep_habits_description?: string
	animals?: boolean
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
	dm?: boolean
	has?: boolean
	other_diseases?: boolean
	other_diseases_description?: string
}

export interface MedicalRecipeDetailsType {
	id: number
	dosage?: string
	duration: string
	frequency: string
	id_medical_recipe: number
	id_medication: number
	medication: MedicationsType
	special_instructions?: string
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
