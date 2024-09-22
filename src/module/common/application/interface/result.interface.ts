export interface IEntity<T> {
  data: T,
}

export interface ICollection<T> {
  data: T[],
  page: number,
  itemsPerPage: number,
  totalCount: number,
  hasNextPage: boolean,
  hasPreviousPage: boolean,
}

export interface ICreateEntity {
  data: {
    id: string | number,
  },
}
