import { z } from 'zod';

export abstract class BaseValidator {
    onCreate = z.object({})
    onUpdate = z.object({})
    onDelete = z.object({})

    static mustBeString(isRequire: boolean = false) {
        let _zod = z.preprocess(
            (val) => {
                if (typeof val === "number") return String(val);
                return val;
            },
            z.string()
        );

        if (!isRequire) {
            return _zod.optional().nullable();
        }

        return _zod;
    }

    static mustBeNumber(isRequire: boolean = false) {
        let _zod = z
            .preprocess(
                (val) => {
                    if (typeof val === "string" && val.trim() !== "") {
                        const num = Number(val);
                        return isNaN(num) ? val : num; // nếu không parse được thì giữ nguyên để báo lỗi
                    }
                    return val;
                },
                z.number()
            );

        if (!isRequire) {
            return _zod.optional().nullable();
        }

        return _zod;
    }
}
