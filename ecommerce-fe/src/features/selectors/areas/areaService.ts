import httpClient from "@/lib/httpClient";
import type { GetAreasParams } from "./area.types";

const areaService = {
  getAreas: async (params: GetAreasParams) => {
    const response = await httpClient.get("/maps/areas", { params });
    return response.data;
  },
};

export default areaService;
