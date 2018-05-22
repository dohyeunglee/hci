import { Pipe, PipeTransform } from '@angular/core';
import { Color } from './models';

@Pipe({
  name: 'color'
})
export class ColorPipe implements PipeTransform {
  transform(color: Color): 'red' | 'black' {
    return color === Color.RED ? 'red' : 'black';
  }
}
