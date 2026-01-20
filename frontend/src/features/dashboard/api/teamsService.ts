import api from '../../../lib/api';

export interface Team {
    id: string;
    name: string;
    description?: string;
}

export const teamsService = {
    getTeams: async (): Promise<Team[]> => {
        const { data } = await api.get<Team[]>('/teams');
        return data;
    },
};
