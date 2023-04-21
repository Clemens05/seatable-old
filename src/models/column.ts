import { ColumnType } from './columnType';

export interface Column {
  column_name: string;
  column_type: ColumnType | string;
  column_data?: any;
}

export interface ColumnAppend extends Column {
  data:
    | ColumnDataAutoNumber
    | ColumnDataNumber
    | ColumnDataDate
    | ColumnDataDuration
    | ColumnDataFormula
    | ColumnDataLinkFormula
    | ColumnDataRate
    | ColumnDataGeolocation
    | ColumnDataLink
    | ColumnDataSingleSelet
    | ColumnDataMultipleSelect
    | object;
}

export interface ColumnDataAutoNumber {
  format: string;
  digits: number;
  prefix: string;
  prefix_type: AutoNumberPrefixType | string;
}

export interface ColumnDataNumber {
  format: NumberFormat | string;
  decimal: NumberDecimal | string;
  thousands: string | any;
}

export interface ColumnDataDate {
  format: DateFormat | string;
}

export interface ColumnDataDuration {
  format: string;
  duration_format: DurationFormat | string;
}

export interface ColumnDataFormula {
  formula: string;
}

export interface ColumnDataLinkFormula {
  formula: string;
}

export interface ColumnDataRate {
  rate_max_number: number;
  rate_style_color: string;
}

export interface ColumnDataGeolocation {
  geo_format: string;
}

export interface ColumnDataLink {
  table: string;
  other_table: string;
}

export interface ColumnDataSingleSelet {
  options: {
    id: string;
    name: string;
    color: string;
  }[];
}

export interface ColumnDataMultipleSelect {
  options: {
    id: string;
    name: string;
    color: string;
  }[];
}

export enum DurationFormat {
  WithoutSeconds = 'h:mm',
  WithSeconds = 'h:mm:ss',
}

export enum DateFormat {
  ISO = 'YYYY-MM-DD',
  US = 'M/D/YYYY',
  European = 'DD/MM/YYYY',
}

export enum NumberDecimal {
  Dot = 'dot',
}

export enum NumberFormat {
  Number = 'number',
}

export enum AutoNumberPrefixType {
  String = 'string',
}
