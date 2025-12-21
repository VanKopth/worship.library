import {User} from "@/prisma/generated/client";
import {axiosInstance} from "@/services/instance";
import {ApiRoutes} from "@/services/constants";

export const getByLogin = async (login: string) : Promise<User> => {
    console.log(ApiRoutes.GETUSER, login);
    return (await axiosInstance.get<User>(`${ApiRoutes.GETUSER}/${login}`)).data;
}