import api from '../../../lib/api';

import { User } from '../../../types';

export interface Team {
    id: string;
    name: string;
    description?: string;
    members: User[];
}

export const teamsService = {
    getTeams: async (): Promise<Team[]> => {
        const { data } = await api.get<Team[]>('/teams');
        return data;
    },
};
