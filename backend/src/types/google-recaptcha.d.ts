declare module 'google-recaptcha' {
  interface RecaptchaOptions {
    secret: string;
  }

  interface RecaptchaResponse {
    success: boolean;
    'error-codes'?: string[];
    score?: number;
  }

  class Recaptcha {
    constructor(options: RecaptchaOptions);
    verify(token: string, remoteip: string, callback: (error: any, data: RecaptchaResponse) => void): void;
  }

  export = Recaptcha;
}
