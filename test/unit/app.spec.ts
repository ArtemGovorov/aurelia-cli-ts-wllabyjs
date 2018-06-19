import {App} from '../../src/app';
import {StageComponent} from 'aurelia-testing';
import {bootstrap} from 'aurelia-bootstrapper';

describe('the app', () => {
  it('says hello', () => {
    expect(new App().message).toBe('Hello World!');
  });
});


describe('MyComponent', () => {
  let component;

  beforeEach(() => {
    component = StageComponent
      .withResources('app')
      .inView('<app first-name.bind="firstName"></app>')
      .boundTo({ firstName: 'Bob' });
  });

  it('should render first name', (done) => {
    component.create(bootstrap).then(() => {
      
      const nameElement = document.querySelector('.firstName');
      console.log(nameElement);
      expect(nameElement.innerHTML).toBe('Bob');
      done();
    }).catch(e => { console.log(e.toString()) });
  });

  afterEach(() => {
    component.dispose();
  });
});
