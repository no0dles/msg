export interface PropertyDecorator<TValue> {
  identifier: string;
  (value?: TValue): Function;
}
