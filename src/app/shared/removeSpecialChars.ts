import { Pipe } from '@angular/core';

@Pipe({
    name: "removeSpecialChars"
})

export class removeSpecialChars {
    transform(value) {
        value = value.replace(/[^a-zA-Z0-9 ,.:]/g, '');
        return value.replace(/\s\s+/g, ' ');
    }
}