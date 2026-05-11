export const validationMessages = {
  email: {
    required: 'Email is required',
    invalid: 'Invalid email address',
  },
  password: {
    required: 'Password is required',
    min: 'Password must be at least 8 characters',
    max: 'Password can be at most 20 characters',
    strong:
      'Password should contain at least one uppercase letter, one lowercase letter, one digit, and one special character.',
  },
  confirmPassword: {
    required: 'Confirm password is required',
    notMatch: 'Confirm password does not match',
  },
  isAcceptTerms: {
    required: 'You must accept the terms and conditions',
  },
  required: 'This field is required',
  imageFile: { required: 'Please upload an image file' },
  media: { required: 'Please upload a media file' },
}
