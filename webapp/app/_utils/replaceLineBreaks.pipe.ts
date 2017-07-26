import { Pipe, PipeTransform } from '@angular/core'

@Pipe({name: 'replaceLineBreaks'})
export class ReplaceLineBreaks implements PipeTransform {
  transform(value: string): string {
    let newValue = value.replace(/\n/g, '<br/>')
    return `${newValue}`
  }
}
