import fetchApi from "../api/fetchApi"

export const loginService = async (user: any) => {
	return await fetchApi.post({
		url: "/user/login",
		body: user,
	})
}

export const updatePermissions = async (token: string) => {
	return await fetchApi.get({ url: "/user/check-session", token })
}
