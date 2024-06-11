
/*
 * -------------------------------------------------------
 * THIS FILE WAS AUTOMATICALLY GENERATED (DO NOT MODIFY)
 * -------------------------------------------------------
 */

/* tslint:disable */
/* eslint-disable */

export class ClientArgs {
    full_name: string;
    company_name: string;
    phone_number: string;
    address: string;
    email: string;
    nationality: string;
    note?: Nullable<string>;
    document_name?: Nullable<string>;
}

export class TablePaginationArgs {
    page_index?: Nullable<number>;
    size?: Nullable<number>;
}

export class ProjectArgs {
    name: string;
    goals: string;
    deadline: Date;
    start_date: Date;
    costs: number;
    status: string;
    client?: Nullable<string>;
    members: string[];
}

export class ProjectUpdateArgs {
    id: string;
    name: string;
    goals: string;
    deadline: Date;
    start_date: Date;
    costs: number;
    status: string;
    members: string[];
}

export class DocumentArgs {
    access: string[];
    name: string;
}

export abstract class IQuery {
    abstract getKey(): string | Promise<string>;

    abstract getClientNationalities(): ClientNationality[] | Promise<ClientNationality[]>;

    abstract getClientList(searchValue?: Nullable<string>, pagination?: Nullable<TablePaginationArgs>): ResponseClientList | Promise<ResponseClientList>;

    abstract getClientDetail(id?: Nullable<string>): ClientDetail | Promise<ClientDetail>;

    abstract getEmployeeList(searchValue?: Nullable<string>, pagination?: Nullable<TablePaginationArgs>): EmployeeDetail[] | Promise<EmployeeDetail[]>;

    abstract getLinkFileDownload(id: string): string | Promise<string>;

    abstract getProjectStatus(): ProjectStatus[] | Promise<ProjectStatus[]>;

    abstract getProjectList(searchValue?: Nullable<string>, pagination?: Nullable<TablePaginationArgs>): ResponseProjectList | Promise<ResponseProjectList>;

    abstract getProjectDetail(id: string): ProjectDetail | Promise<ProjectDetail>;
}

export abstract class IMutation {
    abstract login(): Response | Promise<Response>;

    abstract logout(): Response | Promise<Response>;

    abstract createClient(payload: ClientArgs, document?: Nullable<Upload>): Nullable<Response> | Promise<Nullable<Response>>;

    abstract updateClient(id: string, payload: ClientArgs): Nullable<Response> | Promise<Nullable<Response>>;

    abstract deleteClient(id: string): Nullable<Response> | Promise<Nullable<Response>>;

    abstract updateFileClient(fileId: string, name: string): Nullable<Response> | Promise<Nullable<Response>>;

    abstract deleteFileClient(fileId: string): Nullable<Response> | Promise<Nullable<Response>>;

    abstract bulkCreate(dataUpload: Upload): Nullable<string> | Promise<Nullable<string>>;

    abstract addDocumentClient(id: string, documentNames: string[], documents: Upload[]): Nullable<Response> | Promise<Nullable<Response>>;

    abstract addDocumentProject(id: string, documentNames: string[], documents: Upload[], access?: Nullable<Nullable<string[]>[]>): Nullable<Response> | Promise<Nullable<Response>>;

    abstract createProject(payload: ProjectArgs, payloadClient?: Nullable<ClientArgs>, payloadDocument?: Nullable<DocumentArgs>, document?: Nullable<Upload>): Nullable<Response> | Promise<Nullable<Response>>;

    abstract updateStatusProject(projectId: string, status: string): Nullable<Response> | Promise<Nullable<Response>>;

    abstract updateProject(payload: ProjectUpdateArgs): Nullable<Response> | Promise<Nullable<Response>>;

    abstract deleteProject(id: string): Nullable<Response> | Promise<Nullable<Response>>;

    abstract updateFileProject(fileId: string, name: string, access: string[]): Nullable<Response> | Promise<Nullable<Response>>;

    abstract deleteFileProject(fileId: string): Nullable<Response> | Promise<Nullable<Response>>;
}

export class ClientNationality {
    id: string;
    code: string;
    country_name: string;
}

export class ClientList {
    id: string;
    name: string;
    company_name: string;
    phone_number: string;
    email: string;
}

export class ResponseClientList {
    data: ClientList[];
    pagination: ResponsePagination;
}

export class ClientDetail {
    id: string;
    name: string;
    company_name: string;
    phone_number: string;
    email: string;
    address: string;
    nationality: string;
    projects: ProjectList[];
    documents: FileList[];
}

export class EmployeeDetail {
    id: string;
    full_name: string;
    role: RoleDetail;
}

export class FileList {
    id: string;
    name: string;
    type?: Nullable<string>;
    access?: Nullable<EmployeeDetail[]>;
}

export class Response {
    message?: Nullable<string>;
}

export class ResponsePagination {
    totalPages: number;
    totalData: number;
    currentPage: number;
    currentSize: number;
}

export class ProjectStatus {
    id: string;
    name: string;
    description?: Nullable<string>;
}

export class ProjectList {
    id: string;
    name: string;
    start_date: Date;
    deadline: Date;
    status: ProjectStatus;
}

export class ResponseProjectList {
    data: ProjectList[];
    pagination: ResponsePagination;
}

export class ProjectDetail {
    clientId: string;
    projectId: string;
    name: string;
    costs: number;
    deadline: Date;
    start_date: Date;
    goals: string;
    status: ProjectStatus;
    members: EmployeeDetail[];
    documents: FileList[];
}

export class RoleDetail {
    id: string;
    name: string;
    description: string;
}

export type Upload = any;
export type UUID = any;
type Nullable<T> = T | null;
