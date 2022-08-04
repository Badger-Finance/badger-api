import { Service } from '@tsed/di';

@Service()
export class DevelopmentService {
  async updateDynamoDbSeeds() {
    return { status: 'success' };
  }
}
