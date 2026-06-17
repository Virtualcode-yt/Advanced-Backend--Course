export default blobFromSync;
/**
 * @param {string} path filepath on the disk
 * @param {string} [type] mimetype to use
 */
export function blobFromSync(path: string, type?: string): Blob;
import File from "fetch-blob/file.js";
import Blob from "fetch-blob";
/**
 * @param {string} path filepath on the disk
 * @param {string} [type] mimetype to use
 * @returns {Promise<Blob>}
 */
export function blobFrom(path: string, type?: string): Promise<Blob>;
/**
 * @param {string} path filepath on the disk
 * @param {string} [type] mimetype to use
 * @returns {Promise<File>}
 */
export function fileFrom(path: string, type?: string): Promise<File>;
/**
 * @param {string} path filepath on the disk
 * @param {string} [type] mimetype to use
 */
export function fileFromSync(path: string, type?: string): File;
export { File, Blob };
