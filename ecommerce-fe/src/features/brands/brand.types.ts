export interface Brand {
  id: number;
  name: string;
}

export type SaveBrandPayload = {
  id?: number;
  name: string;
};
