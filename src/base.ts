import axios from 'axios';
import { Column, ColumnAppend } from './models/column';
import { DTable } from './models/dtable';
import { RowInsertPosition, RowModify } from './models/row';
import { Query, QuerySchema } from './models_zod/query';
import { BaseInfo, BaseInfoSchema } from './models_zod/base-info';

/**
 * Base of a SeaTable server
 * @see https://api.seatable.io
 */
export class Base {
  public token: string;
  public serverUrl: string;
  public uuid?: string;
  public dtable?: DTable;

  private _lastRefresh?: number;

  /**
   * General headers to access general resources
   * @returns The headers needed to access general resources on a SeaTable server
   */
  get generalHeaders() {
    return {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + this.token,
    };
  }

  /**
   * General headers to access base resources
   * @returns The headers needed to access base resources on a SeaTable server
   */
  get baseHeaders() {
    // Date comparison made with ChatGPT :)
    const date = new Date();
    date.setDate(date.getDate() - 2);
    if (new Date(this._lastRefresh ?? 0) < date) {
      (async () => {
        await this.auth();
      })();
    }

    return {
      'Content-Type': 'application/json',
      Authorization: 'Token ' + this.dtable?.access_token,
    };
  }

  /**
   * No auth headers to access public resources
   * @returns The headers needed to access public resources on a SeaTable server
   */
  get noAuthHeaders() {
    return {
      'Content-Type': 'application/json',
    };
  }

  /**
   * Creates a new base
   * @param token The API Token
   * @param serverUrl The SeaTable URL
   */
  constructor(token: string, serverUrl: string) {
    this.token = token;
    if (serverUrl.endsWith('/')) serverUrl.slice(0, -1);
    this.serverUrl = serverUrl;
  }

  /**
   * Authenticates the base.
   * @param callback The callback function with the result and possible error
   */
  public async auth(callback?: (result: any, error: any) => void): Promise<void> {
    this._lastRefresh = Date.now();

    try {
      const result = await axios({
        method: 'get',
        url: this.serverUrl + '/api/v2.1/dtable/app-access-token/',
        headers: this.generalHeaders,
      });

      this.dtable = result.data as DTable;
      if (this.dtable.dtable_server.endsWith('/')) this.dtable.dtable_server = this.dtable.dtable_server.slice(0, -1);
      if (this.dtable.dtable_db.endsWith('/')) this.dtable.dtable_db = this.dtable.dtable_db.slice(0, -1);
      this.uuid = this.dtable.dtable_uuid;

      if (
        this.serverUrl.startsWith('https://') &&
        this.dtable.dtable_db.startsWith('http://') &&
        !this.dtable.dtable_db.startsWith('https://')
      ) {
        this.dtable.dtable_db = this.dtable.dtable_db.replace('http://', 'https://');
      }

      if (
        this.serverUrl.startsWith('https://') &&
        this.dtable.dtable_server.startsWith('http://') &&
        !this.dtable.dtable_server.startsWith('https://')
      ) {
        this.dtable.dtable_server = this.dtable.dtable_server.replace('http://', 'https://');
      }

      if (callback) callback({ success: true }, undefined);
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Executes a SQL string
   * @param sql The SQL string
   * @param callback The callback function with the result and possible error
   * @deprecated
   */
  public async query(sql: string, callback?: (result: any, error: any) => void): Promise<void> {
    try {
      const result = await axios({
        method: 'post',
        url: this.dtable?.dtable_db + '/api/v1/query/' + this.uuid + '/',
        data: {
          sql: sql,
          convert_keys: true,
        },
        headers: this.baseHeaders,
      });
      if (result.data.results) {
        if (callback) callback(result.data.results, undefined);
      } else if (result.data) {
        if (callback) callback(result.data, undefined);
      } else {
        if (callback) callback({ success: true }, undefined);
      }
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  public async queryAsync(args: { sql: string; convertKeys?: boolean }): Promise<Query> {
    const { sql, convertKeys } = args;
    const convert = convertKeys === undefined ? true : false;
    return new Promise(async (resolve, reject) => {
      try {
        const result = await axios({
          method: 'post',
          url: `${this.dtable?.dtable_db}/api/v1/query/${this.uuid}`,
          data: {
            sql: sql,
            convert_keys: convert,
          },
          headers: this.baseHeaders,
        });

        const parsed = QuerySchema.safeParse(result.data);
        if (parsed.success) resolve(parsed.data);
        else reject(parsed.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  public async getBaseInfo(): Promise<BaseInfo> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await axios({
          method: 'get',
          url: `${this.dtable?.dtable_server}/dtables/${this.uuid}`,
          headers: this.baseHeaders,
        });

        const parsed = BaseInfoSchema.safeParse(result.data);
        if (parsed.success) resolve(parsed.data);
        else reject(parsed.error);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Lists all rows of a table
   * @param tableName The name of the table
   * @param viewName The name of the view (undefined/null = no view)
   * @param callback The callback function with the result and possible error
   */
  public async getRows(
    tableName: string,
    viewName?: string,
    callback?: (result: any, error: any) => void,
  ): Promise<void> {
    try {
      const result = await axios({
        method: 'get',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/rows/',
        params: {
          table_name: tableName,
          view_name: viewName ? viewName : undefined,
        },
        headers: this.baseHeaders,
      });
      if (result.data.rows) {
        if (callback) callback(result.data.rows, undefined);
      } else if (result.data) {
        if (callback) callback(result.data, undefined);
      } else {
        if (callback) callback(undefined, 'result.data is undefined.');
      }
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Gets the content of a single row
   * @param tableId The id of the table
   * @param rowId The id of the row
   * @param callback The callback function with the result and possible error
   */
  public async getRowContent(
    tableId: string,
    rowId: string,
    callback?: (result: any, error: any) => void,
  ): Promise<any> {
    try {
      const result = await axios({
        method: 'get',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/rows/' + rowId + '/',
        params: {
          table_id: tableId,
          convert: 'true',
        },
        headers: this.baseHeaders,
      });
      if (result.data) {
        if (callback) callback(result.data, undefined);
      } else {
        if (callback) callback(undefined, 'result.data is undefined.');
      }
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Appends new rows to a table
   * @param tableName The name of the table
   * @param rows The rows to append to the table
   * @param callback The callback function with the result and possible error
   */
  public async appendRows(
    tableName: string,
    rows: object[],
    callback?: (result: any, error: any) => void,
  ): Promise<void> {
    try {
      await axios({
        method: 'post',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/batch-append-rows/',
        data: {
          table_name: tableName,
          rows: rows,
        },
        headers: this.baseHeaders,
      });
      if (callback) callback({ success: true }, undefined);
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Inserts a new row into the table
   * @param tableName The name of the table
   * @param anchorRowId The id of of the anchor row
   * @param row The row to insert
   * @param insertPosition The position to insert (Above or Below)
   * @param callback The callback function with the result and possible error
   * @deprecated Often returns a 500 Internal Server Error
   */
  public async insertRow(
    tableName: string,
    anchorRowId: string,
    row: object,
    insertPosition: RowInsertPosition,
    callback?: (result: any, error: any) => void,
  ): Promise<void> {
    try {
      await axios({
        method: 'post',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/batch-append-rows/',
        data: {
          row: row,
          table_name: tableName,
          anchor_row_id: anchorRowId,
          row_insert_position: insertPosition,
        },
        headers: this.baseHeaders,
      });
      if (callback) callback({ success: true }, undefined);
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Modifies rows of a table
   * @param tableName The name of the table
   * @param rows The rows to modify
   * @param callback The callback function with the result and possible error
   */
  public async modifyRows(
    tableName: string,
    rows: RowModify[],
    callback?: (result: any, error: any) => void,
  ): Promise<void> {
    try {
      await axios({
        method: 'put',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/batch-update-rows',
        data: {
          table_name: tableName,
          updates: rows,
        },
        headers: this.baseHeaders,
      });
      if (callback) callback({ success: true }, undefined);
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Deletes rows from a table
   * @param tableName The name of the table
   * @param rowIds The IDs of the rows to delete
   * @param callback The callback function with the result and possible error
   */
  public async deleteRows(
    tableName: string,
    rowIds: string[],
    callback?: (result: any, error: any) => void,
  ): Promise<void> {
    try {
      await axios({
        method: 'delete',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/batch-delete-rows/',
        data: {
          table_name: tableName,
          row_ids: rowIds,
        },
        headers: this.baseHeaders,
      });
      if (callback) callback({ success: true }, undefined);
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Gets all columns of a table
   * @param tableName The name of the table
   * @param viewName The name of the view (undefined/null = no view)
   * @param callback The callback function with the result and possible error
   */
  public async getColumns(
    tableName: string,
    viewName?: string,
    callback?: (result: any, error: any) => void,
  ): Promise<void> {
    try {
      const result = await axios({
        method: 'get',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/columns/',
        params: {
          table_name: tableName,
          view_name: viewName ? viewName : undefined,
        },
        headers: this.baseHeaders,
      });
      if (result.data.columns) {
        if (callback) callback(result.data.columns, undefined);
      } else if (result.data) {
        if (callback) callback(result.data, undefined);
      } else {
        if (callback) callback(undefined, 'result.data is undefined.');
      }
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  // @important needs test
  public async appendColumns(
    tableName: string,
    columns: ColumnAppend[],
    callback?: (result: any, error: any) => void,
  ): Promise<void> {
    try {
      await axios({
        method: 'post',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/batch-append-columns/',
        data: {
          table_name: tableName,
          columns: columns,
        },
        headers: this.baseHeaders,
      });
      if (callback) callback({ success: true }, undefined);
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  // TODO
  // public async appendColumns(
  //   tableName: string,
  //   columns: ColumnAppend[] | any[],

  // )

  /**
   * Creates a new table with columns
   * @param tableName The name of the table
   * @param columns The columns to create
   * @param callback The callback function with the result and possible error
   */
  public async createTable(
    tableName: string,
    columns: Column[],
    callback?: (result: any, error: any) => void,
  ): Promise<void> {
    try {
      await axios({
        method: 'post',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/tables/',
        data: {
          table_name: tableName,
          columns: columns,
        },
        headers: this.baseHeaders,
      });
      if (callback) callback({ success: true }, undefined);
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Duplicates a table from "MyTable" to "MyTable(copy)"/"MyTable(copy1)"/"MyTable(copy2)" etc.
   * @param tableName The name of the table to duplicate
   * @param duplicateRows Duplicating all rows of the origin table to the new table or not
   * @param callback The callback function with the result and possible error
   */
  public async duplicateTable(
    tableName: string,
    duplicateRows: boolean,
    callback?: (result: any, error: any) => void,
  ): Promise<void> {
    try {
      await axios({
        method: 'post',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/tables/duplicate-table/',
        data: {
          table_name: tableName,
          is_duplicate_records: duplicateRows,
        },
        headers: this.baseHeaders,
      });
      if (callback) callback({ success: true }, undefined);
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Renames a new table
   * @param tableName The name of the table
   * @param newTableName The new name of the table
   * @param callback The callback function with the result and possible error
   */
  public async renameTable(
    tableName: string,
    newTableName: string,
    callback?: (result: any, error: any) => void,
  ): Promise<void> {
    try {
      await axios({
        method: 'put',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/tables/',
        data: {
          table_name: tableName,
          new_table_name: newTableName,
        },
        headers: this.baseHeaders,
      });
      if (callback) callback({ success: true }, undefined);
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Deletes a table
   * @param tableName The name of the table
   * @param callback The callback function with the result and possible error
   */
  public async deleteTable(tableName: string, callback?: (result: any, error: any) => void): Promise<void> {
    try {
      await axios({
        method: 'delete',
        url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/tables/',
        data: {
          table_name: tableName,
        },
        headers: this.baseHeaders,
      });
      if (callback) callback({ success: true }, undefined);
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }

  /**
   * Links two rows
   * @param tableName The name of the table
   * @param otherTableName The name of the other table
   * @param linkId The ID of the link
   * @param sourceRowId The row ID of the source row
   * @param targetRowId The row ID of the target row
   */
  public async linkRow(
    tableName: string,
    otherTableName: string,
    linkId: string,
    sourceRowId: string,
    targetRowId: string,
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const result = await axios({
          method: 'post',
          url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/links/',
          data: {
            table_name: tableName,
            other_table_name: otherTableName,
            link_id: linkId,
            table_row_id: sourceRowId,
            other_table_row_id: targetRowId,
          },
          headers: this.baseHeaders,
        });
        // console.log(result.data);
        if (result.status >= 300) reject(new Error('Failed'));
        else resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Deletes a row link
   * @param tableName The name of the table
   * @param otherTableName The name of the other table
   * @param linkId The ID of the link
   * @param sourceRowId The row ID of the source row
   * @param targetRowId The row ID of the target row
   */
  public async deleteRowLink(
    tableName: string,
    otherTableName: string,
    linkId: string,
    sourceRowId: string,
    targetRowId: string,
  ): Promise<boolean> {
    return new Promise<boolean>(async (resolve, reject) => {
      try {
        const result = await axios({
          method: 'delete',
          url: this.dtable?.dtable_server + '/api/v1/dtables/' + this.uuid + '/links/',
          data: {
            table_name: tableName,
            other_table_name: otherTableName,
            link_id: linkId,
            table_row_id: sourceRowId,
            other_table_row_id: targetRowId,
          },
          headers: this.baseHeaders,
        });
        if (result.status >= 300) reject(new Error('Failed'));
        else resolve(result.data);
      } catch (e) {
        reject(e);
      }
    });
  }

  /**
   * Gets the server version and the edition
   * @param callback The callback function with the result and possible error
   */
  public async getServerInfo(callback?: (result: any, error: any) => void): Promise<void> {
    try {
      const result = await axios({
        method: 'get',
        url: this.serverUrl + '/server-info/',
        headers: this.noAuthHeaders,
      });
      if (result.data) {
        if (callback) callback(result.data, undefined);
      } else {
        if (callback) callback(undefined, 'result.data is undefined');
      }
    } catch (e) {
      if (callback) callback(undefined, e);
    }
  }
}
