import { IncidentCreateModel } from "@models/serverAllocation";
import apiLinks from "@utils/api-links";
import httpClient from "@utils/http-client";

const createIncident = async (
    token: string,
    data: IncidentCreateModel
): Promise<any> => {
    const response = await httpClient.post({
        token: token,
        url: apiLinks.incident.create,
        data: data,
    });
    return response.data;
};

const incident = {
    createIncident,
};

export default incident;