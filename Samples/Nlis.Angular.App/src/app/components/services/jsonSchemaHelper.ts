import { Injectable } from '@angular/core';
import * as jsonpath from 'jsonpath';

@Injectable()
export class JsonSchemaHelper {
    constructor() { }
    cleanNullObjects = (jsonObj) => {
        if (this.isObject(jsonObj)) {
            Object.keys(jsonObj).forEach(key => {
                const val = this.cleanNullObjects(jsonObj[key]);

                if (this.isNull(val)) {
                    delete jsonObj[key];
                } else {
                    jsonObj[key] = val;
                }
            });
        }
        return jsonObj;
    }

    isObject = (value): boolean => !!(value && typeof(value) === 'object');
    isNull = (value): boolean => value == null;
}
