import { Controller, Inject } from '@tsed/common';
import { CitadelService } from './citadel.service';

@Controller('/citadel')
export class CitadelController {
  @Inject()
  citadelService!: CitadelService;
}
