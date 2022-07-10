import { Form, Field, ErrorMessage, defineRule, configure } from 'vee-validate'
import { required, email, min } from '@vee-validate/rules'
import { localize } from '@vee-validate/i18n'
import { query, where, getDocs, collection as dbCollection } from '@firebase/firestore'
import { db } from '@/firebase'

export default (app) => {
  defineRule('required', required)
  defineRule('email', email)
  defineRule('min', min)
  defineRule('unique', async (value, args) => {
    let collection, field
    if (Array.isArray(args)) {
      [collection, field] = args
    } else {
      ({ collection, field } = args)
    }
    const q = query(dbCollection(db, collection), where(field, '==', value))
    const querySnapshot = await getDocs(q)
    return querySnapshot.empty
  })

  configure({
    generateMessage: localize('en', {
      messages: {
        required: '{field} is required',
        email: '{field} must be a valid email',
        min: '{field} must be 0:{min} characters long',
        unique: '{field} is already taken'
      }
    })
  })

  app.component('VeeForm', Form)
  app.component('VeeField', Field)
  app.component('VeeErrorMessage', ErrorMessage)
}
