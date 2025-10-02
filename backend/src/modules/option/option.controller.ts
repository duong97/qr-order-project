import {BaseController} from '@/core/base/base.controller';
import { OptionService } from './option.service';

export class OptionController extends BaseController<OptionService> {
    constructor() {
        super(new OptionService());
    }
}
