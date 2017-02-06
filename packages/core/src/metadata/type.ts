export interface Type<T> {
  name: string;
  new(): T;
}
