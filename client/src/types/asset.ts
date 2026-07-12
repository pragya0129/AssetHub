export interface Asset {
  id: number;

  asset_tag: string;

  name: string;

  category_name: string;

  serial_number: string;

  acquisition_date: string;

  acquisition_cost: number;

  asset_condition: string;

  status: string;

  location: string;

  is_bookable: boolean;
}