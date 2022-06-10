import AuthForm from './AuthForm';

export default class LoginForm extends AuthForm {
  constructor() {
    super([
      {
        type: 'text',
        name: 'username',
        placeholder: 'ash-ketchum',
        labelText: 'Username',
        class: 'form-control',
        required: '',
      },
      {
        type: 'password',
        name: 'password',
        placeholder: 'Pokéteams Password',
        labelText: 'Password',
        class: 'form-control',
        required: '',
      },
      {
        type: 'submit',
        value: 'Login',
        class: 'btn btn-danger btn-block mt-4',
      },
    ]);

    // Insert after submit.
    this.registerText = document.createElement('small');
    this.registerText.classList = 'mt-3 text-center';
    this.registerText.innerText = 'Register for free!';
    this.form.append(this.registerText);
  }
}
