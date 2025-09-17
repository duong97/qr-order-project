import {BaseController} from '@/core/base/base.controller';
import { OptionService } from './option.service';
import { OptionRepository } from './option.repository';

export class OptionController extends BaseController<OptionService> {
    constructor() {
        super(new OptionService(new OptionRepository()));
    }
}
