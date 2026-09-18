// app/add-packs/types.ts
export interface Pack {
  id: number;
  mrp: string;
  rate?: { mrp: string }[];
  description: string;
  boxtype_lbl: string;
}

export interface BouquetChannel {
  name: string;
  id: string;
  type: string;
  logo_url: string;
}

export interface BouquetGenre {
  genre_id: string;
  genre_name: string;
  channels_count: number;
  channel_list: BouquetChannel[];
}

export interface BouquetDetails {
  id: number;
  name: string;
  channels: BouquetGenre[];
}
