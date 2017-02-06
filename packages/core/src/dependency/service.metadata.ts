import { Service } from "../decorators/service";
import { Metadata } from "../decorators/metadata";

export interface ServiceMetadata extends Metadata {
  service?: Service;
}