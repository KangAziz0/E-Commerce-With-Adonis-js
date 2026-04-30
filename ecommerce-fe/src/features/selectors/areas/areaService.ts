import api from "@/api";
import { GetAreasParams } from "./area.type";
const areaService = {
  getAreas: async (params: GetAreasParams) => {
    const res = await api.get("/maps/areas", {
      params,
    });

    return res.data;
  },
};

export default areaService;
