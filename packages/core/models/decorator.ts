export interface Decorator<T> {
  (value: T): Function;
  parse(obj: any): T;
}
