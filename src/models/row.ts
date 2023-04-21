export interface RowModify {
  row_id: string;
  row: object;
}

export enum RowInsertPosition {
  Above = 'insert_above',
  Below = 'insert_below',
}
