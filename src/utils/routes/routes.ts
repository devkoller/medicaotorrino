// Views
import { Login } from "@/views/Login"
import { RecoveryPassword } from "@/views/RecoveryPassword"

import { Home } from "@/views/Home"
import { Users } from "@/views/Users"
import { AdminServices } from "@/views/AdminServices"
import { AdminMedicalOffice } from "@/views/AdminMedicalOffice"
import { AdminPatients } from "@/views/AdminPatients"
import { PatientById } from "@/views/PatientById"
import { AdminMedications } from "@/views/AdminMedications"

import { UserProfile } from "@/views/UserProfile"
import { Servicios } from "@/views/Servicios"
import { Instalaciones } from "@/views/Instalaciones"
import { Conocenos } from "@/views/Conocenos"

//ICONS
// import { CiViewTable } from "react-icons/ci"
import {
	FaHome,
	FaUsers,
	FaHandHoldingMedical,
	// FaWarehouse
	FaUserInjured,
	FaPills,
} from "react-icons/fa"
import { LuHospital } from "react-icons/lu"

// import { IoNewspaperOutline, IoMedical } from "react-icons/io5"
// import { GiPelvisBone } from "react-icons/gi"
// import { BsHospitalFill } from "react-icons/bs"

export const routes = [
	{
		route: "/login",
		component: Login,
		state: "Not Authenticated",
		menu: false,
	},
	{
		route: "/recovery-password",
		component: RecoveryPassword,
		state: "Not Authenticated",
		menu: false,
	},
	{
		route: "/servicios",
		component: Servicios,
		state: "Not Granted",
		menu: false,
	},
	{
		route: "/instalaciones",
		component: Instalaciones,
		state: "Not Granted",
		menu: false,
	},
	{
		route: "/conocenos",
		component: Conocenos,
		state: "Not Granted",
		menu: false,
	},
	{
		route: "/home",
		component: Home,
		title: "Inicio",
		state: "Authenticated",
		breadcrumb: "Inicio",
		grants: null,
		menu: true,
		icon: FaHome,
	},
	{
		route: "/admin-pacientes",
		component: AdminPatients,
		title: "Pacientes",
		state: "Authenticated",
		breadcrumb: "Inicio",
		grants: null,
		menu: true,
		icon: FaUserInjured,
	},
	{
		route: "/admin-pacientes/:id",
		component: PatientById,
		title: "Pacientes",
		state: "Authenticated",
		breadcrumb: "Inicio",
		grants: null,
		menu: false,
		icon: FaUserInjured,
	},
	{
		route: "/admin-medicamentos",
		component: AdminMedications,
		title: "Medicamentos",
		state: "Authenticated",
		breadcrumb: "Inicio",
		grants: null,
		menu: true,
		icon: FaPills,
	},
	{
		route: "/admin-services",
		component: AdminServices,
		title: "Servicios",
		state: "Authenticated",
		breadcrumb: "Inicio",
		grants: null,
		menu: true,
		icon: FaHandHoldingMedical,
	},
	{
		route: "/admin-consultorios",
		component: AdminMedicalOffice,
		title: "Consultorios",
		state: "Authenticated",
		breadcrumb: "Inicio",
		grants: null,
		menu: true,
		icon: LuHospital,
	},
	{
		route: "/usuarios",
		component: Users,
		title: "Usuarios",
		state: "Authenticated",
		breadcrumb: "Usuarios",
		grants: null,
		menu: true,
		icon: FaUsers,
	},
	{
		route: "/cuenta",
		component: UserProfile,
		title: "Usuarios",
		state: "Authenticated",
		breadcrumb: "Usuarios",
		grants: null,
		menu: false,
		icon: FaUsers,
	},
]
