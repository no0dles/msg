export interface Routing<TMetadata> {
  matches(source: TMetadata, target: TMetadata): boolean;
}