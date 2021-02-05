import { ProtocolSummary } from '../interface/ProtocolSummary';
import { Controller, Get, PathParams } from "@tsed/common";
import { SettService } from "../service/sett/SettService";
import { UserService } from "../service/user/UserService";
import { UserAccount } from "../interface/UserAccount";
import { ContentType } from "@tsed/schema";

@Controller("/protocol")
export class ProtocolController {

  constructor(private settService: SettService, private userService: UserService) {}

  @Get("/value")
  @ContentType('json')
  async getAssetsUnderManagement(): Promise<ProtocolSummary> {
    return this.settService.getProtocolSummary();
  }

  @Get("/user/:userId")
  @ContentType('json')
  async getUserProfile(@PathParams("userId") userId: string): Promise<UserAccount> { 
    return this.userService.getUserDetails(userId);
  }
}
