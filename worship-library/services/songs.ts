import {axiosInstance} from "@/services/instance";
import {Song} from "@/prisma/generated/client";
import {ApiRoutes} from "@/services/constants";

export const search = async (query: string) : Promise<Song[]> => {
    return (await axiosInstance.get<Song[]>(ApiRoutes.SEARCH, {params: {query}})).data;
}

export const getAll = async () : Promise<Song[]> => {
    return (await axiosInstance.get<Song[]>(ApiRoutes.SONGS)).data;
}

export const getById = async (id: number) : Promise<Song> => {
    console.log(ApiRoutes.SONGS, id);
    return (await axiosInstance.get<Song>(`${ApiRoutes.SONGS}/${id}`)).data;
}
export const updateSong = async (id: number, data: { songText: string; songTitle?: string }) => {
    await axiosInstance.put(`${ApiRoutes.SONGS}/${id}`, data);
};

