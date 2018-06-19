import { bindable, bindingMode } from "aurelia-framework";

export class App {
  @bindable({ defaultBindingMode: bindingMode.toView }) firstName: string = '';
  message = 'Hello World!';
}
