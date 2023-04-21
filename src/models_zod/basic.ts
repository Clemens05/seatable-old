import * as z from 'zod';

export const BaseUUIDSchema = z.string();

export type BaseUUID = z.infer<typeof BaseUUIDSchema>;

export const RowIDSchema = z.string();

export type RowID = z.infer<typeof RowIDSchema>;

export const LinkIDSchema = z.string();

export type LinkID = z.infer<typeof LinkIDSchema>;

export const TableIDSchema = z.string();

export type TableID = z.infer<typeof TableIDSchema>;

export const ColumnIDSchema = z.union([
  z.string().length(4),
  z.literal('_id'),
  z.literal('_mtime'),
  z.literal('_ctime'),
  z.literal('_creator'),
  z.literal('_last_modifier'),
  z.literal('_archived'),
  z.literal('_locked_by'),
  z.literal('_locked'),
  z.string().startsWith('_'),
]);

export type ColumnID = z.infer<typeof ColumnIDSchema>;

export const ColumnTypeSchema = z.union([
  z.literal('default'),
  z.literal('number'),
  z.literal('text'),
  z.literal('checkbox'),
  z.literal('date'),
  z.literal('single-select'),
  z.literal('long-text'),
  z.literal('image'),
  z.literal('file'),
  z.literal('multiple-select'),
  z.literal('collaborator'),
  z.literal('link'),
  z.literal('formula'),
  z.literal('link-formula'),
  z.literal('creator'),
  z.literal('ctime'),
  z.literal('last-modifier'),
  z.literal('mtime'),
  z.literal('geolocation'),
  z.literal('auto-number'),
  z.literal('url'),
  z.literal('email'),
  z.literal('duration'),
  z.literal('button'),
  z.literal('rate'),
]);

export type ColumnType = z.infer<typeof ColumnTypeSchema>;
