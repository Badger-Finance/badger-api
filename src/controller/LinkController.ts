import {Controller, Get} from "@tsed/common";
import { ContentType } from "@tsed/schema";

@Controller("/")
export class LinkController {

  @Get()
  getApiLinks(): string {
    return "Hah!";
  }
}
